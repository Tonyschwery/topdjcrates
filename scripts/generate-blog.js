#!/usr/bin/env node
/**
 * scripts/generate-blog.js
 *
 * Daily SEO post generator for TOP DJ CRATES.
 *
 * Reads the existing posts in src/posts, asks Claude (with web search enabled)
 * to find a trending, high-intent DJ topic we haven't covered yet, writes a
 * full Markdown article with frontmatter, and saves it into src/posts/.
 *
 * Requires: Node 20+ (uses built-in fetch). No npm dependencies.
 *
 * Environment:
 *   ANTHROPIC_API_KEY  (required) — set as a GitHub repository secret
 *   ANTHROPIC_MODEL    (optional) — defaults to claude-sonnet-5
 *   DRAFT_MODE         (optional) — "true" writes posts with draft: true
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts');
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const DRAFT_MODE = String(process.env.DRAFT_MODE).toLowerCase() === 'true';

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function fail(message) {
  console.error(`\n[generate-blog] ERROR: ${message}\n`);
  process.exit(1);
}

function log(message) {
  console.log(`[generate-blog] ${message}`);
}

/** Turn a title into a safe, lowercase, hyphenated filename. */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')  // strip accents
    .replace(/[^a-z0-9\s-]/g, '')     // drop punctuation
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
    .replace(/-$/, '');
}

/** Today as YYYY-MM-DD in UTC. */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/** Escape a value so it is safe inside a double-quoted YAML string. */
function yamlSafe(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').trim();
}

/** Write a key=value pair to the GitHub Actions step output, if running there. */
function setActionOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const safe = String(value).replace(/\r?\n/g, ' ');
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${safe}\n`);
}

// ---------------------------------------------------------------------------
// Read what we've already published, so we don't repeat ourselves
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
        if (titleLine) {
          title = titleLine[1].trim().replace(/^["']|["']$/g, '');
        }
      }

      return { fileName, title };
    });
}

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the in-house SEO content writer for TOP DJ CRATES, a store selling curated, DJ-ready WAV music packs ("crates") to working DJs.

BRAND VOICE — follow this precisely:
- Punchy and direct. Short declarative sentences. Practitioner-to-practitioner, never marketing-speak.
- Use **bold** for the load-bearing claims and key phrases. Roughly one bolded phrase per section.
- Second person ("you", "your crate", "your set").
- Name real tools and formats: Rekordbox, Serato, Virtual DJ, WAV, Camelot keys, BPM, intro/outro edits, acapella outs.
- Respect the reader's time and skill. Never condescend. No filler, no "in today's fast-paced world".
- Close by tying back to the product benefit: handpicked, high-quality WAV files, drag, drop, and play.

RESEARCH:
- Use the web search tool first to find what DJs and producers are actually searching for and talking about right now.
- Prefer high-intent, commercially relevant angles (genres, edit formats, transition packs, crate organisation) over generic news.
- Ground claims in real, current sources. Attribute figures in prose (e.g. "the IMS report tracked..."). Never invent statistics.
- Paraphrase everything. Do not quote sources at length.

OUTPUT FORMAT — this is critical:
Return ONLY a Markdown document. No preamble, no explanation, no code fences around the whole thing.
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
- Do NOT repeat the H1 as a heading — the site renders the frontmatter title. Start with a strong opening paragraph.
- Use ## and ### headings that read like real search queries where natural.
- Use pure Markdown only. No raw HTML tags — the renderer escapes them.
- Include at least one numbered or bulleted list of practical, actionable steps.`;

function buildUserPrompt(existingPosts) {
  const alreadyCovered = existingPosts.length
    ? existingPosts.map((p) => `- ${p.title}`).join('\n')
    : '- (nothing published yet)';

  return `Write today's blog post for TOP DJ CRATES.

Today's date is ${todayISO()}.

Search the web to identify ONE trending, high-intent topic relevant to working DJs and producers shopping for music packs, edits, or transition packs right now. Then write the full article on it.

We have ALREADY published the following. Choose a genuinely different angle — do not overlap with these:
${alreadyCovered}

Return only the Markdown document, starting with the frontmatter block.`;
}

// ---------------------------------------------------------------------------
// Anthropic API call
// ---------------------------------------------------------------------------

async function callClaude(apiKey, existingPosts) {
  const body = {
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT.replace('${DATE}', todayISO()),
    messages: [{ role: 'user', content: buildUserPrompt(existingPosts) }],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 6,
      },
    ],
  };

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log(`Calling Anthropic API (model: ${MODEL}, attempt ${attempt}/${maxAttempts})...`);

    let response;
    try {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': API_VERSION,
        },
        body: JSON.stringify(body),
      });
    } catch (networkError) {
      if (attempt === maxAttempts) fail(`Network failure: ${networkError.message}`);
      await sleep(attempt * 5000);
      continue;
    }

    if (response.ok) {
      const data = await response.json();

      // The response may interleave text with web_search_tool_result blocks.
      // We only want the text Claude wrote.
      const text = (data.content || [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim();

      if (!text) fail('The API returned no text content.');
      return text;
    }

    const errorBody = await response.text();

    // 401/400 are our fault — retrying will not help.
    if (response.status === 401 || response.status === 403) {
      fail(`Authentication failed (${response.status}). Check the ANTHROPIC_API_KEY secret.\n${errorBody}`);
    }
    if (response.status === 400) {
      fail(`Bad request (400). Often an invalid model name.\n${errorBody}`);
    }

    // 429 and 5xx are worth retrying.
    if (attempt === maxAttempts) {
      fail(`API request failed after ${maxAttempts} attempts (${response.status}).\n${errorBody}`);
    }

    const waitMs = attempt * 10000;
    log(`Got ${response.status}. Retrying in ${waitMs / 1000}s...`);
    await sleep(waitMs);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Clean up and validate the model's output
// ---------------------------------------------------------------------------

function normaliseMarkdown(raw) {
  let text = raw.trim();

  // Strip a wrapping code fence if the model added one despite instructions.
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

/** Rebuild the frontmatter so date, draft flag, and quoting are always correct. */
function rebuildDocument(markdown, meta) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();

  const lines = [
    '---',
    `title: "${yamlSafe(meta.title)}"`,
    `date: "${todayISO()}"`,
    `excerpt: "${yamlSafe(meta.excerpt)}"`,
    `keywords: "${yamlSafe(meta.keywords)}"`,
  ];

  if (DRAFT_MODE) lines.push('draft: true');
  lines.push('---', '', body, '');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    fail(
      'ANTHROPIC_API_KEY is not set.\n' +
        'In GitHub: Settings > Secrets and variables > Actions > New repository secret.\n' +
        'Locally: set it in your shell before running this script.'
    );
  }

  const existingPosts = getExistingPosts();
  log(`Found ${existingPosts.length} existing post(s).`);

  const raw = await callClaude(apiKey, existingPosts);
  const markdown = normaliseMarkdown(raw);

  const meta = parseFrontmatter(markdown);
  if (!meta || !meta.title) {
    fail(
      'The generated document is missing valid frontmatter or a title. ' +
        'Nothing was written. First 400 characters of the response:\n\n' +
        markdown.slice(0, 400)
    );
  }

  const wordCount = markdown.split(/\s+/).length;
  if (wordCount < 300) {
    fail(`Generated post is only ~${wordCount} words. Refusing to publish it.`);
  }

  // Work out a filename, and never overwrite an existing post.
  let slug = slugify(meta.title) || `dj-crates-${todayISO()}`;
  let fileName = `${slug}.md`;

  if (fs.existsSync(path.join(POSTS_DIR, fileName))) {
    slug = `${slug}-${todayISO()}`;
    fileName = `${slug}.md`;
  }
  if (fs.existsSync(path.join(POSTS_DIR, fileName))) {
    log(`A post named ${fileName} already exists. Skipping today's run.`);
    setActionOutput('slug', '');
    setActionOutput('title', 'skipped — duplicate');
    return;
  }

  const document = rebuildDocument(markdown, meta);
  const fullPath = path.join(POSTS_DIR, fileName);

  fs.writeFileSync(fullPath, document, 'utf8');

  log(`Wrote ${fileName} (~${wordCount} words)`);
  log(`Title: ${meta.title}`);
  if (DRAFT_MODE) log('DRAFT_MODE is on — this post will not appear on the live site.');

  setActionOutput('slug', slug);
  setActionOutput('title', meta.title);
}

main().catch((error) => fail(error.stack || error.message));
