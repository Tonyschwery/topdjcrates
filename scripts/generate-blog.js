#!/usr/bin/env node
/**
 * scripts/generate-blog.js
 *
 * Daily SEO post generator for TOP DJ CRATES.
 *
 * 1. Asks Claude for a trending, high-intent DJ topic we haven't covered, and
 *    writes a full Markdown article. Research is done with Brave Search, called
 *    directly from this script via a tool-use loop.
 * 2. Analyses that article to detect its electronic music genre and mood.
 * 3. Builds a genre-matched, ultra-realistic image prompt.
 * 4. Generates the image with Google's Nano Banana Pro (gemini-3-pro-image),
 *    falling back to other model names automatically if that one is rejected.
 * 5. Saves the image to public/images/ and links it in the frontmatter.
 *
 * Requires: Node 20+ (uses built-in fetch). No npm dependencies.
 *
 * Environment:
 *   ANTHROPIC_API_KEY  (required) — GitHub repository secret
 *   BRAVE_API_KEY      (required for research) — GitHub repository secret.
 *                                   Without it the post is still written, but
 *                                   from the model's own knowledge, ungrounded.
 *   GEMINI_API_KEY     (optional) — GitHub repository secret. Without it the
 *                                   post is still published, just without art.
 *   ANTHROPIC_MODEL    (optional) — defaults to claude-sonnet-5
 *   GEMINI_IMAGE_MODEL (optional) — force one model; otherwise tries Pro first
 *   DRAFT_MODE         (optional) — "true" writes posts with draft: true
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const BRAVE_URL = 'https://api.search.brave.com/res/v1/web/search';

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const DRAFT_MODE = String(process.env.DRAFT_MODE).toLowerCase() === 'true';

// How many Brave searches one article is allowed, and how many
// back-and-forth rounds with Claude before we give up.
const MAX_SEARCHES = 6;
const MAX_ROUNDS = 10;

// Google keeps renaming these between preview and stable. Rather than pin one
// name and break at 3am, we try them in order and use whichever answers.
// Set GEMINI_IMAGE_MODEL to force a single specific model.
const IMAGE_MODEL_CHAIN = process.env.GEMINI_IMAGE_MODEL
  ? [process.env.GEMINI_IMAGE_MODEL]
  : [
      'gemini-3-pro-image',          // Nano Banana Pro (stable)
      'gemini-3-pro-image-preview',  // Nano Banana Pro (preview naming)
      'gemini-3.1-flash-image',      // Nano Banana 2 — cheaper fallback
    ];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function fail(message) {
  console.error(`\n[generate-blog] ERROR: ${message}\n`);
  process.exit(1);
}

function warn(message) {
  console.warn(`[generate-blog] WARNING: ${message}`);
}

function log(message) {
  console.log(`[generate-blog] ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
    .replace(/-$/, '');
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function yamlSafe(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').trim();
}

function setActionOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const safe = String(value).replace(/\r?\n/g, ' ');
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${safe}\n`);
}

// ---------------------------------------------------------------------------
// Genre presets — each one drives a distinct visual direction
// ---------------------------------------------------------------------------

const GENRE_PRESETS = {
  techno: {
    label: 'Techno',
    match: ['techno', 'hard techno', 'industrial', 'peak time', 'warehouse'],
    visual:
      'a dark underground industrial club, raw concrete walls, moody strobe lights cutting through heavy atmospheric haze, racks of vintage hardware synthesisers and drum machines, cold steel and deep shadow, a single silhouetted figure behind the decks',
    palette: 'monochrome steel blues and stark white strobe against near-black',
  },
  'afro-house': {
    label: 'Afro House',
    match: ['afro house', 'afro-house', 'afro tech', 'afrohouse', 'black coffee', 'tribal'],
    visual:
      'an open-air rooftop club at golden hour turning to dusk, organic warm textures, woven rattan and natural wood surfaces, vibrant tribal lighting in amber and deep orange, high-end Pioneer CDJ decks and a professional mixer, hand percussion resting beside the booth',
    palette: 'warm amber, terracotta, and burnt gold with deep indigo shadows',
  },
  'tech-house': {
    label: 'Tech House',
    match: ['tech house', 'tech-house', 'groove', 'rolling bassline'],
    visual:
      'a packed intimate basement club, low ceiling, tight crowd energy just out of focus, clean modern DJ booth with Pioneer CDJs and a rotary mixer, crisp directional spotlights, condensation and motion blur',
    palette: 'saturated magenta and cyan wash over warm skin tones',
  },
  amapiano: {
    label: 'Amapiano',
    match: ['amapiano', 'piano', 'log drum', 'yanos', '3-step', '3 step', 'kabza', 'maphorisa'],
    visual:
      'a vibrant South African outdoor party at dusk, string lights overhead, a relaxed stylish crowd, a DJ booth set up under a canopy with professional decks, warm township golden-hour light, shallow depth of field',
    palette: 'sun-warmed gold, dusty rose, and deep violet twilight',
  },
  'uk-garage': {
    label: 'UK Garage',
    match: ['uk garage', 'ukg', 'speed garage', '2-step', 'two step', 'garage'],
    visual:
      'a late-nineties style London basement club, mirrored surfaces and chrome detailing, tight energetic crowd, classic turntables and a battle mixer, sharp white beams through low fog',
    palette: 'chrome silver, electric blue, and rich club-carpet red',
  },
  'drum-and-bass': {
    label: 'Drum & Bass',
    match: ['drum and bass', 'drum & bass', 'dnb', 'd&b', 'jungle', 'breaks'],
    visual:
      'a cavernous warehouse rave, a towering stack of speaker cabinets, dense low fog pierced by rapid laser fans, a raised DJ platform with turntables, blurred motion of a dense crowd',
    palette: 'acid green and ultraviolet against deep black',
  },
  'melodic-techno': {
    label: 'Melodic Techno',
    match: ['melodic techno', 'melodic house', 'progressive', 'organic house', 'afterlife'],
    visual:
      'a vast minimal venue with a single dramatic light installation, sparse architectural geometry, a lone figure at a clean modern booth, wide cinematic framing, atmospheric depth',
    palette: 'deep midnight blue and cold white with a single warm accent',
  },
  'baile-funk': {
    label: 'Baile Funk & Club',
    match: ['baile funk', 'jersey club', 'baile', 'funk carioca', 'moombahton'],
    visual:
      'a raw high-energy street party at night, improvised sound system stacks, vivid coloured bulbs strung overhead, kinetic crowd motion, a DJ working a controller on a scaffold rig',
    palette: 'hot pink, electric yellow, and tropical green under streetlight',
  },
  house: {
    label: 'House',
    match: ['deep house', 'jazz house', 'disco', 'soulful', 'house music', 'house'],
    visual:
      'a classic warm wood-panelled club interior, a glowing mirror ball scattering light, vintage rotary mixer and turntables, an unhurried crowd, rich analogue warmth',
    palette: 'warm amber, deep burgundy, and soft gold',
  },
  default: {
    label: 'Electronic',
    match: [],
    visual:
      'a professional DJ booth in a modern club at peak hour, high-end Pioneer CDJ decks and mixer in sharp focus, atmospheric haze and directional stage lighting, a crowd softly blurred in the background',
    palette: 'deep charcoal with warm gold highlights',
  },
};

const GENRE_KEYS = Object.keys(GENRE_PRESETS).filter((k) => k !== 'default');

/**
 * Deterministic fallback: score the article text against each preset's keywords.
 */
function detectGenreByKeywords(markdown) {
  const haystack = markdown.toLowerCase();
  let best = { key: 'default', score: 0 };

  for (const key of GENRE_KEYS) {
    const preset = GENRE_PRESETS[key];
    let score = 0;

    for (const term of preset.match) {
      // Count occurrences of each keyword.
      const matches = haystack.split(term).length - 1;
      score += matches * (term.includes(' ') ? 2 : 1); // multi-word terms weigh more
    }

    if (score > best.score) best = { key, score };
  }

  return best.key;
}

// ---------------------------------------------------------------------------
// Brave Search
// ---------------------------------------------------------------------------

// The free tier allows roughly one query per second, so we space calls out.
let lastBraveCall = 0;

/**
 * Runs one Brave web search and returns the results as plain text for Claude.
 * Never throws — a failed search returns an explanatory string so the model can
 * carry on and write the article rather than the whole run dying.
 */
async function braveSearch(query, count = 8) {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    warn('BRAVE_API_KEY is not set — search is unavailable this run.');
    return 'Search is unavailable: no API key configured. Write the article from your own knowledge and avoid citing specific figures or recent releases.';
  }

  if (!query) {
    return 'No query was supplied. Send a short, specific search phrase.';
  }

  const sinceLast = Date.now() - lastBraveCall;
  if (sinceLast < 1200) await sleep(1200 - sinceLast);
  lastBraveCall = Date.now();

  log(`  Brave search: "${query}"`);

  let response;
  try {
    response = await fetch(`${BRAVE_URL}?q=${encodeURIComponent(query)}&count=${count}`, {
      headers: {
        accept: 'application/json',
        'accept-encoding': 'gzip',
        // Sent as a header, never in the URL, so it stays out of logs.
        'x-subscription-token': apiKey,
      },
    });
  } catch (networkError) {
    warn(`Brave network failure: ${networkError.message}`);
    return `Search failed (network error): ${networkError.message}. Try once more, then write with what you have.`;
  }

  if (response.status === 429) {
    warn('Brave rate limit hit — pausing.');
    await sleep(3000);
    return 'Search was rate limited. Try at most one more query, then write the article with what you already have.';
  }

  if (response.status === 401 || response.status === 403) {
    warn(`Brave rejected the key (${response.status}). Check BRAVE_API_KEY.`);
    return 'Search is unavailable: the API key was rejected. Write the article from your own knowledge and avoid citing specific figures.';
  }

  if (!response.ok) {
    const text = await response.text();
    warn(`Brave returned HTTP ${response.status}.`);
    return `Search failed (HTTP ${response.status}): ${text.slice(0, 200)}`;
  }

  const data = await response.json();
  const results = data?.web?.results || [];

  if (results.length === 0) {
    return `No results found for "${query}". Try a different phrasing.`;
  }

  return results
    .slice(0, count)
    .map((result, index) => {
      // Brave wraps matched terms in <strong> tags — strip them.
      const snippet = (result.description || '').replace(/<\/?strong>/g, '');
      const age = result.age || result.page_age;
      return [
        `${index + 1}. ${result.title}`,
        `   ${result.url}`,
        `   ${snippet}`,
        age ? `   Published: ${age}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}

/** Tool definition handed to Claude. */
const BRAVE_TOOL = {
  name: 'brave_search',
  description:
    'Search the live web using Brave. Returns numbered results with titles, URLs, snippets and publication dates. Use it to find what DJs and producers are searching for and discussing right now.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query. Keep it short and specific, like a real search.',
      },
    },
    required: ['query'],
  },
};

// ---------------------------------------------------------------------------
// Anthropic: article generation
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the in-house SEO content writer for TOP DJ CRATES, a store selling curated, DJ-ready WAV music packs ("crates") to working DJs.

BRAND VOICE — follow this precisely:
- Punchy and direct. Short declarative sentences. Practitioner-to-practitioner, never marketing-speak.
- Use **bold** for the load-bearing claims and key phrases. Roughly one bolded phrase per section.
- Second person ("you", "your crate", "your set").
- Name real tools and formats: Rekordbox, Serato, Virtual DJ, WAV, Camelot keys, BPM, intro/outro edits, acapella outs.
- Respect the reader's time and skill. Never condescend. No filler.
- Close by tying back to the product benefit: handpicked, high-quality WAV files, drag, drop, and play.

RESEARCH:
- Use the brave_search tool first to find what DJs and producers are actually searching for right now. Run several searches before you start writing.
- Prefer high-intent, commercially relevant angles over generic news.
- Ground claims in the search results. Attribute figures in prose. Never invent statistics.
- Paraphrase everything. Do not quote sources at length.

OUTPUT FORMAT — this is critical:
When you have finished researching, return ONLY a Markdown document. No preamble, no code fences around the whole thing.
It must begin with YAML frontmatter in exactly this shape:

---
title: "A specific, compelling, search-friendly title"
date: "${'${DATE}'}"
excerpt: "One or two sentences used as the meta description and card summary."
keywords: "comma, separated, high intent, search terms"
---

Then the article body in pure Markdown.

BODY RULES:
- 900-1500 words.
- Do NOT repeat the title as a heading — the site renders it from frontmatter.
- Use ## and ### headings that read like real search queries where natural.
- Pure Markdown only. No raw HTML tags — the renderer escapes them.
- Include at least one numbered or bulleted list of practical steps.`;

function buildUserPrompt(existingPosts) {
  const alreadyCovered = existingPosts.length
    ? existingPosts.map((p) => `- ${p.title}`).join('\n')
    : '- (nothing published yet)';

  return `Write today's blog post for TOP DJ CRATES.

Today's date is ${todayISO()}.

Search the web to identify ONE trending, high-intent topic relevant to working DJs and producers shopping for music packs, edits, or transition packs right now. Then write the full article on it.

We have ALREADY published the following. Choose a genuinely different angle:
${alreadyCovered}

Return only the Markdown document, starting with the frontmatter block.`;
}

/**
 * One Anthropic request with retries. Returns the raw parsed response body so
 * callers can inspect content blocks and stop_reason.
 */
async function callAnthropicRaw(apiKey, body, label) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log(`Anthropic ${label} (attempt ${attempt}/${maxAttempts})...`);

    let response;
    try {
      response = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify(body),
      });
    } catch (networkError) {
      if (attempt === maxAttempts) throw new Error(`Network failure: ${networkError.message}`);
      await sleep(attempt * 5000);
      continue;
    }

    if (response.ok) {
      return await response.json();
    }

    const errorBody = await response.text();

    if (response.status === 401 || response.status === 403) {
      fail(`Anthropic auth failed (${response.status}). Check ANTHROPIC_API_KEY.\n${errorBody}`);
    }
    if (response.status === 400) {
      fail(`Anthropic bad request (400) — often an invalid model name.\n${errorBody}`);
    }
    if (attempt === maxAttempts) {
      throw new Error(`Anthropic request failed (${response.status}).\n${errorBody}`);
    }

    await sleep(attempt * 10000);
  }
}

/** Convenience wrapper: returns just the joined text of a response. */
async function callAnthropic(apiKey, body, label) {
  const data = await callAnthropicRaw(apiKey, body, label);
  return (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

/**
 * Tool-use loop: Claude asks for searches, we run them against Brave and hand
 * the results back, until it stops asking and writes the article.
 */
async function generateArticle(apiKey, existingPosts) {
  const messages = [{ role: 'user', content: buildUserPrompt(existingPosts) }];
  let searchesUsed = 0;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const data = await callAnthropicRaw(
      apiKey,
      {
        model: MODEL,
        max_tokens: 8000,
        system: SYSTEM_PROMPT.replace('${DATE}', todayISO()),
        messages,
        tools: [BRAVE_TOOL],
      },
      `article round ${round}`
    );

    const blocks = data.content || [];
    const toolUses = blocks.filter((block) => block.type === 'tool_use');

    // No tool requested — this is the finished article.
    if (data.stop_reason !== 'tool_use' || toolUses.length === 0) {
      log(`Article written after ${searchesUsed} search(es).`);
      return blocks
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim();
    }

    messages.push({ role: 'assistant', content: blocks });

    const toolResults = [];
    for (const toolUse of toolUses) {
      let result;

      if (searchesUsed >= MAX_SEARCHES) {
        result =
          'Search budget for this run is exhausted. Write the full article now using what you have already found.';
      } else {
        searchesUsed++;
        result = await braveSearch(String(toolUse.input?.query || '').trim());
      }

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: result,
      });
    }

    messages.push({ role: 'user', content: toolResults });
  }

  throw new Error(
    `Article generation did not finish within ${MAX_ROUNDS} rounds. Aborting rather than publishing a partial post.`
  );
}

// ---------------------------------------------------------------------------
// Step 2: analyse the finished article for genre + mood
// ---------------------------------------------------------------------------

async function analyseArticle(apiKey, markdown) {
  const keywordGenre = detectGenreByKeywords(markdown);

  const prompt = `Read this blog article and classify it.

Return ONLY a JSON object, no code fences, no commentary, in exactly this shape:
{"genre": "<one of: ${GENRE_KEYS.join(', ')}>", "mood": "<3-8 words describing the article's emotional tone and energy>"}

The genre must be the dominant electronic music genre the article is about. If the article covers several, pick the one given the most weight. If none clearly dominates, use "default".

The mood should describe atmosphere, not content. Examples: "urgent and confrontational, late-night intensity", "warm optimistic momentum, communal energy", "focused technical precision, workmanlike calm".

ARTICLE:
${markdown.slice(0, 6000)}`;

  try {
    const raw = await callAnthropic(
      apiKey,
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      },
      'genre/mood analysis'
    );

    const cleaned = raw.replace(/```(?:json)?/g, '').trim();
    const parsed = JSON.parse(cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1));

    const genre = GENRE_PRESETS[parsed.genre] ? parsed.genre : keywordGenre;
    const mood = (parsed.mood || '').trim() || 'high-energy nocturnal club atmosphere';

    log(`Analysis: genre="${genre}", mood="${mood}"`);
    return { genre, mood };
  } catch (error) {
    warn(`Genre/mood analysis failed (${error.message}). Falling back to keyword detection.`);
    return { genre: keywordGenre, mood: 'high-energy nocturnal club atmosphere' };
  }
}

// ---------------------------------------------------------------------------
// Step 3: build the image prompt
// ---------------------------------------------------------------------------

function buildImagePrompt({ genre, mood, title }) {
  const preset = GENRE_PRESETS[genre] || GENRE_PRESETS.default;

  return [
    `Ultra-realistic cinematic editorial photograph for an article titled "${title}".`,
    `Scene: ${preset.visual}.`,
    `Colour palette: ${preset.palette}.`,
    `Mood and atmosphere: ${mood}.`,
    'Shot on a full-frame camera with a fast prime lens, shallow depth of field, natural volumetric lighting, fine grain, razor-sharp focus on the foreground subject.',
    'Photorealistic, 8K detail, clean, premium, professional commercial photography quality.',
    'Composition: wide 16:9 landscape framing with clear negative space, suitable as a blog header image.',
    'STRICT NEGATIVE CONSTRAINTS: absolutely no text of any kind, no lettering, no words, no signage, no captions, no watermarks, no logos, no brand marks, no visible screen interfaces or readable displays, no illustration, no cartoon, no 3D render, no CGI look, no distorted hands or faces, no oversaturation.',
  ].join(' ');
}

// ---------------------------------------------------------------------------
// Step 4: generate the image (Nano Banana Pro, falling back down the chain)
// ---------------------------------------------------------------------------

/** Config variations to try, most-preferred first. */
const BODY_VARIANTS = [
  {
    label: 'image mode + 16:9',
    config: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '16:9' } },
  },
  { label: 'image mode', config: { responseModalities: ['TEXT', 'IMAGE'] } },
  { label: '16:9 only', config: { imageConfig: { aspectRatio: '16:9' } } },
  { label: 'plain request', config: null },
];

/** One single request. Throws an Error carrying .status on failure. */
async function attemptImage({ apiKey, model, prompt, config }) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (config) body.generationConfig = config;

  const response = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Sent as a header, never in the URL, so it stays out of logs.
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart) {
    const textPart = parts.find((p) => p.text);
    const error = new Error(
      `Response contained no image data${textPart ? `: ${textPart.text.slice(0, 200)}` : ''}`
    );
    error.status = 200;
    throw error;
  }

  return imagePart.inlineData;
}

function saveImage(buffer, extension, slug) {
  if (buffer.length < 5000) {
    throw new Error(`Returned image is suspiciously small (${buffer.length} bytes).`);
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // Unique filename: slug + short random suffix, so re-runs never collide.
  const suffix = crypto.randomBytes(4).toString('hex');
  const fileName = `${slug}-${suffix}.${extension}`;
  fs.writeFileSync(path.join(IMAGES_DIR, fileName), buffer);

  log(`Saved public/images/${fileName} (${Math.round(buffer.length / 1024)} KB)`);
  return `/images/${fileName}`;
}

// --- Provider 1: Google Gemini (paid, best quality) ------------------------

async function geminiImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const failures = [];

  for (const model of IMAGE_MODEL_CHAIN) {
    for (const variant of BODY_VARIANTS) {
      try {
        log(`  Gemini: ${model} [${variant.label}]...`);
        const inlineData = await attemptImage({ apiKey, model, prompt, config: variant.config });
        const mimeType = inlineData.mimeType || 'image/png';
        return {
          buffer: Buffer.from(inlineData.data, 'base64'),
          extension: mimeType.includes('jpeg') ? 'jpg' : 'png',
        };
      } catch (error) {
        failures.push(`${model} [${variant.label}]: ${error.message.slice(0, 160)}`);

        // Out of credits or bad key — no Gemini model will work. Give up fast
        // so we move on to the free providers instead of hammering the API.
        if ([401, 403, 429].includes(error.status)) {
          throw new Error(`Gemini unavailable (${error.status}): ${error.message.slice(0, 200)}`);
        }
      }
    }
  }

  throw new Error(failures.join(' | '));
}

// --- Provider 2: Cloudflare Workers AI (free tier, needs a free account) ---

async function cloudflareImage(prompt) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_API_TOKEN;
  const model = process.env.CF_IMAGE_MODEL || '@cf/black-forest-labs/flux-1-schnell';

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: prompt.slice(0, 2000) }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 250)}`);
  }

  const contentType = response.headers.get('content-type') || '';

  // Some Cloudflare models return raw image bytes, others return JSON
  // with a base64 string. Handle both.
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const base64 = data?.result?.image;
    if (!base64) throw new Error(`No image in response: ${JSON.stringify(data).slice(0, 250)}`);
    return { buffer: Buffer.from(base64, 'base64'), extension: 'jpg' };
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    extension: contentType.includes('jpeg') ? 'jpg' : 'png',
  };
}

// --- Provider 3: Pollinations (completely free, no account, no key) -------

async function pollinationsImage(prompt) {
  // Long prompts make unwieldy URLs, so trim to the important part.
  const trimmed = prompt.slice(0, 1200);
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}` +
    `?width=1280&height=720&nologo=true&model=flux&seed=${Math.floor(Math.random() * 100000)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Expected an image, got ${contentType}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    extension: contentType.includes('jpeg') ? 'jpg' : 'png',
  };
}

// --- Try each provider in turn --------------------------------------------

async function generateImage({ prompt, slug }) {
  const providers = [];

  if (process.env.GEMINI_API_KEY) {
    providers.push({ name: 'Gemini (paid)', run: geminiImage });
  }
  if (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN) {
    providers.push({ name: 'Cloudflare (free)', run: cloudflareImage });
  }
  if (String(process.env.DISABLE_POLLINATIONS).toLowerCase() !== 'true') {
    providers.push({ name: 'Pollinations (free)', run: pollinationsImage });
  }

  if (providers.length === 0) {
    throw new Error('No image provider is configured.');
  }

  const failures = [];

  for (const provider of providers) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      log(`Image provider: ${provider.name}, attempt ${attempt}/2...`);

      try {
        const { buffer, extension } = await provider.run(prompt);
        log(`  -> success via ${provider.name}`);
        return saveImage(buffer, extension, slug);
      } catch (error) {
        log(`  -> ${error.message.slice(0, 200)}`);

        if (attempt === 2) {
          failures.push(`${provider.name}: ${error.message.slice(0, 300)}`);
        } else {
          await sleep(5000);
        }
      }
    }
  }

  throw new Error(`All image providers failed.\n\n${failures.join('\n\n')}`);
}

// ---------------------------------------------------------------------------
// Existing posts, parsing, document assembly
// ---------------------------------------------------------------------------

function getExistingPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      let title = fileName.replace(/\.mdx?$/, '');

      if (match) {
        const titleLine = match[1].match(/^title:\s*(.+)$/m);
        if (titleLine) title = titleLine[1].trim().replace(/^["']|["']$/g, '');
      }

      return { fileName, title };
    });
}

function normaliseMarkdown(raw) {
  let text = raw.trim();
  const fenced = text.match(/^```(?:markdown|md)?\r?\n([\s\S]*?)\r?\n```$/);
  if (fenced) text = fenced[1].trim();
  return text;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const block = match[1];
  const read = (key) => {
    const line = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return line ? line[1].trim().replace(/^["']|["']$/g, '') : '';
  };

  return {
    title: read('title'),
    date: read('date'),
    excerpt: read('excerpt'),
    keywords: read('keywords'),
  };
}

function rebuildDocument(markdown, meta, extras) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();

  const lines = [
    '---',
    `title: "${yamlSafe(meta.title)}"`,
    `date: "${todayISO()}"`,
    `excerpt: "${yamlSafe(meta.excerpt)}"`,
    `keywords: "${yamlSafe(meta.keywords)}"`,
  ];

  if (extras.image) {
    lines.push(`image: "${yamlSafe(extras.image)}"`);
    lines.push(`imageAlt: "${yamlSafe(extras.imageAlt)}"`);
  }
  if (extras.genre) lines.push(`genre: "${yamlSafe(extras.genre)}"`);
  if (DRAFT_MODE) lines.push('draft: true');

  lines.push('---', '', body, '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    fail(
      'ANTHROPIC_API_KEY is not set.\n' +
        'In GitHub: Settings > Secrets and variables > Actions > New repository secret.'
    );
  }

  if (!process.env.BRAVE_API_KEY) {
    warn(
      'BRAVE_API_KEY is not set. The post will be written without live research.\n' +
        '           In GitHub: Settings > Secrets and variables > Actions > New repository secret.'
    );
  } else {
    log('Brave Search is configured.');
  }

  const existingPosts = getExistingPosts();
  log(`Found ${existingPosts.length} existing post(s).`);

  // --- 1. Article -----------------------------------------------------------
  const raw = await generateArticle(anthropicKey, existingPosts);
  const markdown = normaliseMarkdown(raw);

  const meta = parseFrontmatter(markdown);
  if (!meta || !meta.title) {
    fail(
      'Generated document is missing valid frontmatter or a title. Nothing written.\n\n' +
        markdown.slice(0, 400)
    );
  }

  const wordCount = markdown.split(/\s+/).length;
  if (wordCount < 300) {
    fail(`Generated post is only ~${wordCount} words. Refusing to publish.`);
  }

  let slug = slugify(meta.title) || `dj-crates-${todayISO()}`;
  let fileName = `${slug}.md`;

  if (fs.existsSync(path.join(POSTS_DIR, fileName))) {
    slug = `${slug}-${todayISO()}`;
    fileName = `${slug}.md`;
  }
  if (fs.existsSync(path.join(POSTS_DIR, fileName))) {
    log(`${fileName} already exists. Skipping today's run.`);
    setActionOutput('slug', '');
    setActionOutput('title', 'skipped — duplicate');
    return;
  }

  // --- 2 & 3. Analyse and build the image prompt ----------------------------
  const { genre, mood } = await analyseArticle(anthropicKey, markdown);
  const preset = GENRE_PRESETS[genre] || GENRE_PRESETS.default;
  const imagePrompt = buildImagePrompt({ genre, mood, title: meta.title });

  // --- 4. Image (non-fatal: never lose the article over a failed image) -----
  let imagePath = '';
  const imageAlt = `${preset.label} DJ setup — editorial header image for ${meta.title}`;

  try {
    imagePath = await generateImage({ prompt: imagePrompt, slug });
  } catch (error) {
    warn(`Image generation failed, publishing without art: ${error.message}`);
    // Written to a file so the workflow can show it on the run summary page.
    fs.writeFileSync('image-error.log', error.message);
  }

  // --- 5. Write ------------------------------------------------------------
  const document = rebuildDocument(markdown, meta, {
    image: imagePath,
    imageAlt,
    genre: preset.label,
  });

  fs.writeFileSync(path.join(POSTS_DIR, fileName), document, 'utf8');

  log(`Wrote ${fileName} (~${wordCount} words, genre: ${preset.label})`);
  log(`Title: ${meta.title}`);
  if (imagePath) log(`Image: ${imagePath}`);
  if (DRAFT_MODE) log('DRAFT_MODE is on — this post stays off the live site.');

  setActionOutput('slug', slug);
  setActionOutput('title', meta.title);
  setActionOutput('image', imagePath);
  setActionOutput('genre', preset.label);
}

main().catch((error) => fail(error.stack || error.message));
