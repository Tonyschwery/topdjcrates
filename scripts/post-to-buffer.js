#!/usr/bin/env node
/**
 * scripts/post-to-buffer.js
 *
 * Takes the blog post that generate-blog.js just created and pushes it out to
 * Facebook, Instagram, and Threads automatically, using Buffer's GraphQL API.
 *
 * This runs as a SEPARATE step in the GitHub Action, AFTER the new post has
 * been committed and pushed — because Instagram needs the header image to be
 * reachable at a real public URL, and that only exists once the push lands.
 *
 * Requires: Node 20+ (built-in fetch). No npm dependencies.
 *
 * Environment:
 *   BUFFER_ACCESS_TOKEN   (required) — GitHub repository secret
 *   SITE_URL              (optional) — defaults to https://topdjcrates.com
 *
 * Reads (from the same GITHUB_OUTPUT values generate-blog.js already wrote):
 *   POST_SLUG, POST_TITLE, POST_IMAGE, POST_EXCERPT
 */

const BUFFER_API_URL = 'https://api.buffer.com';
const SITE_URL = (process.env.SITE_URL || 'https://topdjcrates.com').replace(/\/$/, '');

// Fixed channel IDs for the three connected topdjcrates accounts. These are
// not secret — they only identify *which* channel, not who can post to it
// (that's what the access token is for) — so it's fine to keep them here.
const CHANNELS = {
  facebook: '6a687bd64b2d03035f558f96',
  instagram: '6a687c874b2d03035f5591bb',
  threads: '6a687c0b4b2d03035f559023',
};

function log(message) {
  console.log(`[post-to-buffer] ${message}`);
}

function warn(message) {
  console.warn(`[post-to-buffer] WARNING: ${message}`);
}

function fail(message) {
  console.error(`\n[post-to-buffer] ERROR: ${message}\n`);
  process.exit(1);
}

/** Runs one GraphQL request against the Buffer API. */
async function bufferRequest(token, query, variables) {
  const response = await fetch(BUFFER_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await response.json();

  if (body.errors && body.errors.length > 0) {
    throw new Error(body.errors.map((e) => e.message).join('; '));
  }

  return body.data;
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id text }
      }
      ... on MutationError {
        message
      }
    }
  }
`;

/**
 * Creates one post on one channel. Never throws — a failure on one platform
 * shouldn't stop the others from posting. Returns true/false for the summary.
 */
async function postToChannel(token, { channelId, label, text, imageUrl }) {
  const input = {
    text,
    channelId,
    schedulingType: 'automatic',
    mode: 'shareNow',
  };

  if (imageUrl) {
    input.assets = [{ image: { url: imageUrl } }];
  }

  try {
    const data = await bufferRequest(token, CREATE_POST_MUTATION, { input });
    const result = data.createPost;

    if (result && result.message) {
      // This is Buffer's MutationError shape — a handled, expected failure.
      warn(`${label}: ${result.message}`);
      return false;
    }

    log(`${label}: queued successfully (post id ${result.post.id})`);
    return true;
  } catch (error) {
    warn(`${label}: ${error.message}`);
    return false;
  }
}

function buildPostUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

async function main() {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) {
    fail('BUFFER_ACCESS_TOKEN is not set. Add it as a GitHub repository secret.');
  }

  const slug = process.env.POST_SLUG || '';
  const title = process.env.POST_TITLE || '';
  const excerpt = process.env.POST_EXCERPT || '';
  const image = process.env.POST_IMAGE || ''; // e.g. /images/foo-abcd1234.jpg

  if (!slug || !title) {
    log('No new post was published today (slug/title missing) — nothing to post. Exiting cleanly.');
    return;
  }

  const postUrl = buildPostUrl(slug);
  const imageUrl = image ? `${SITE_URL}${image}` : '';

  log(`Posting "${title}" to Facebook, Instagram, and Threads...`);
  log(`Article link: ${postUrl}`);
  if (imageUrl) log(`Image: ${imageUrl}`);

  const results = [];

  // --- Facebook: full caption, link, and image if we have one -------------
  results.push(
    await postToChannel(token, {
      channelId: CHANNELS.facebook,
      label: 'Facebook',
      text: `${title}\n\n${excerpt}\n\nRead the full breakdown: ${postUrl}`,
      imageUrl,
    })
  );

  // --- Instagram: intentionally disabled -----------------------------
  // Daily auto-posted blog announcements don't fit Instagram's audience as
  // well as Facebook/Threads do. Left here, commented, in case you want to
  // turn it back on later for real product/lifestyle photos instead.
  //
  // if (imageUrl) {
  //   results.push(
  //     await postToChannel(token, {
  //       channelId: CHANNELS.instagram,
  //       label: 'Instagram',
  //       text: `${title}\n\n${excerpt}\n\nLink in bio for the full article. 🎧`,
  //       imageUrl,
  //     })
  //   );
  // } else {
  //   warn('Instagram: skipped, no image was generated for this post.');
  // }

  // --- Threads: short text + link works well here -------------------------
  results.push(
    await postToChannel(token, {
      channelId: CHANNELS.threads,
      label: 'Threads',
      text: `${title}\n\n${postUrl}`,
    })
  );

  const succeeded = results.filter(Boolean).length;
  log(`Done: ${succeeded}/${results.length} platform(s) queued successfully.`);

  // Non-fatal by design — a social posting hiccup should never fail the
  // whole workflow or block tomorrow's run.
}

main().catch((error) => {
  warn(error.stack || error.message);
  // Exit 0 on purpose: social posting is a bonus step, not a blocker.
  process.exit(0);
});
