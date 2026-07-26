/**
 * Client-safe helpers.
 *
 * IMPORTANT: this file must never import `fs`, `path`, `gray-matter`, or
 * anything else Node-only. It is imported by React components that run in the
 * browser. Server-only file reading lives in `src/lib/posts.js` instead.
 */

/**
 * Shared date formatter so the index and post pages always agree.
 * Accepts an ISO date string; returns "" for null/undefined.
 */
export function formatPostDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
