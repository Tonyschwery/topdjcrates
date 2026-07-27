import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostSlugs, getPostData } from '@/lib/posts';
import { formatPostDate } from '@/lib/formatDate';

export default function BlogPostPage({ post }) {
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
            {post.image && (
          <>
            <meta property="og:image" content={`https://topdjcrates.com${post.image}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={`https://topdjcrates.com${post.image}`} />
          </>
        )}

        {/* Structured data helps Google understand this is an article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date || undefined,
              image: post.image ? `https://topdjcrates.com${post.image}` : undefined,
              author: { '@type': 'Organization', name: post.author },
              publisher: { '@type': 'Organization', name: 'TOP DJ CRATES' },
              mainEntityOfPage: canonical,
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

  return { props: { post } };
}
