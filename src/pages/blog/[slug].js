import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostSlugs, getPostData, getSortedPostsMeta } from '@/lib/posts';
import { formatPostDate } from '@/lib/formatDate';

export default function BlogPostPage({ post, relatedPosts = [] }) {
  // Safety net: should never render because getStaticProps returns notFound.
  if (!post) return null;

  const canonical = `https://topdjcrates.com/blog/${post.slug}`;

  return (
    <>
      <Head>
        <title>{`${post.title} | TOP DJ CRATES`}</title>
        <meta name="description" content={post.excerpt} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
        <link rel="canonical" href={canonical} />

        {/* Open Graph — controls how the post looks when shared */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="TOP DJ CRATES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image && (
          <>
            <meta property="og:image" content={`https://topdjcrates.com${post.image}`} />
            <meta name="twitter:image" content={`https://topdjcrates.com${post.image}`} />
          </>
        )}

        {/* Structured data helps Google understand this is an article + breadcrumb hierarchy */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'BlogPosting',
                  headline: post.title,
                  description: post.excerpt,
                  keywords: post.keywords || undefined,
                  articleSection: post.genre || 'DJ Music Crates',
                  datePublished: post.date || undefined,
                  dateModified: post.date || undefined,
                  image: post.image ? `https://topdjcrates.com${post.image}` : undefined,
                  author: { '@type': 'Organization', name: post.author, url: 'https://topdjcrates.com/' },
                  publisher: {
                    '@type': 'Organization',
                    name: 'TOP DJ CRATES',
                    url: 'https://topdjcrates.com/',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://i.imgur.com/c2EkBbU.jpeg',
                    },
                  },
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonical,
                  },
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://topdjcrates.com/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Blog',
                      item: 'https://topdjcrates.com/blog',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: post.title,
                      item: canonical,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>

      <article className="px-4 py-16 max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-block mb-8 text-sm text-gold hover:underline"
        >
          &larr; Back to all posts
        </Link>

        <header className="mb-10 border-b border-zinc-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-zinc-400">
            {post.author}
            {post.date && (
              <>
                {' '}&middot;{' '}
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </>
            )}
            {post.genre && (
              <>
                {' '}&middot;{' '}
                <span className="text-gold">{post.genre}</span>
              </>
            )}
          </div>
        </header>

        {/* AI-generated header image, when the pipeline produced one. */}
        {post.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            className="w-full aspect-video object-cover rounded-2xl border border-zinc-800/80 shadow-2xl mb-12"
            loading="eager"
          />
        )}

        {/*
          Markdown body. The arbitrary-variant classes below style the generated
          HTML directly, so this works without the @tailwindcss/typography plugin.
        */}
        <div
          className="
            text-lg text-text leading-loose space-y-6
            [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-12 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-gold [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-6
            [&_strong]:text-gold [&_strong]:font-bold
            [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6
            [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-zinc-300
            [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-base
            [&_img]:rounded-xl [&_img]:my-8
            [&_hr]:border-zinc-800 [&_hr]:my-10
          "
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <Link
            href="/music"
            className="inline-block bg-gold text-background font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse the Crates
          </Link>
        </div>

        {relatedPosts.length > 0 && (
          <aside className="mt-16 pt-10 border-t border-zinc-800">
            <h2 className="text-2xl font-bold text-primary mb-6">
              More DJ Guides &amp; Crate Spotlights
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden transition-colors hover:border-gold/60 p-4"
                >
                  {related.genre && (
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gold mb-2">
                      {related.genre}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-primary group-hover:text-gold transition-colors leading-snug mb-2">
                    {related.title}
                  </h3>
                  <span className="text-xs font-bold text-gold">
                    Read guide &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: getAllPostSlugs(),
    // Any slug we don't have a file for returns a proper 404.
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.slug);

  if (!post) {
    return { notFound: true };
  }

  const allPosts = getSortedPostsMeta().filter((p) => p.slug !== post.slug);
  const sameGenre = post.genre
    ? allPosts.filter((p) => p.genre && p.genre.toLowerCase() === post.genre.toLowerCase())
    : [];
  const otherPosts = allPosts.filter((p) => !sameGenre.some((s) => s.slug === p.slug));
  const relatedPosts = [...sameGenre, ...otherPosts].slice(0, 3);

  return { props: { post, relatedPosts } };
}
