import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Absolute path to the folder holding our local Markdown posts.
const postsDirectory = path.join(process.cwd(), 'src', 'posts');

/**
 * Turn a filename into a URL slug.
 * "khaleeji-remix-guide.md" -> "khaleeji-remix-guide"
 */
function fileNameToSlug(fileName) {
  return fileName.replace(/\.mdx?$/, '');
}

/**
 * Fallback title for posts that are missing frontmatter.
 * "khaleeji-remix-guide" -> "Khaleeji Remix Guide"
 */
function slugToTitle(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Read every .md / .mdx file in src/posts.
 * Returns raw file contents plus parsed frontmatter, unsorted.
 */
function readAllPostFiles() {
  // If the folder doesn't exist yet, return nothing rather than crashing the build.
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => /\.mdx?$/.test(fileName));

  return fileNames.map((fileName) => {
    const slug = fileNameToSlug(fileName);
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter splits the "---" frontmatter block from the body.
    const { data, content } = matter(fileContents);

    return { slug, data, content };
  });
}

/**
 * Metadata for every published post, newest first.
 * Used by the blog index page.
 */
export function getSortedPostsMeta() {
  const posts = readAllPostFiles()
    // Anything marked `draft: true` stays off the live site.
    .filter(({ data }) => data.draft !== true)
    .map(({ slug, data }) => ({
      slug,
      title: data.title || slugToTitle(slug),
      // JSON.stringify can't serialise a Date object, so normalise to a string.
      date: data.date ? new Date(data.date).toISOString() : null,
      excerpt: data.excerpt || data.description || '',
      author: data.author || 'TOP DJ CRATES',
      // Header image written by scripts/generate-blog.js. Empty string rather
      // than undefined, because getStaticProps can't serialise undefined.
      image: data.image || '',
      imageAlt: data.imageAlt || data.title || '',
      genre: data.genre || '',
    }));

  // Newest first. Posts with no date sink to the bottom.
  return posts.sort((a, b) => {
    if (!a.date && !b.date) return a.title.localeCompare(b.title);
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
}

/**
 * Every slug, shaped for getStaticPaths.
 */
export function getAllPostSlugs() {
  return readAllPostFiles().map(({ slug }) => ({
    params: { slug },
  }));
}

/**
 * Full data for a single post, with the Markdown body rendered to HTML.
 * Returns null if the slug doesn't exist.
 */
export async function getPostData(slug) {
  const post = readAllPostFiles().find((entry) => entry.slug === slug);

  if (!post) {
    return null;
  }

  const { data, content } = post;

  // remark parses the Markdown, remark-html serialises it to an HTML string.
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    contentHtml,
    title: data.title || slugToTitle(slug),
    date: data.date ? new Date(data.date).toISOString() : null,
    excerpt: data.excerpt || data.description || '',
    author: data.author || 'TOP DJ CRATES',
    keywords: data.keywords || '',
    image: data.image || '',
    imageAlt: data.imageAlt || data.title || '',
    genre: data.genre || '',
  };
}

/**
 * Shared date formatter now lives in `src/lib/formatDate.js`.
 *
 * It was moved out because React components call it during render. Importing
 * it from this file kept this whole module (and therefore `fs`) in the client
 * bundle, which caused: Module not found: Can't resolve 'fs'.
 *
 * Do not re-export it from here.
 */
