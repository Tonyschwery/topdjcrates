import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { getSortedPostsMeta } from '@/lib/posts';
import { formatPostDate } from '@/lib/formatDate';

export default function BlogPage({ posts = [] }) {
  return (
    <>
      <Head>
        <title>Blog | TOP DJ CRATES</title>
        <meta
          name="description"
          content="Stay updated with the latest music trends, DJ tips, Afro-House releases, and exclusive crates on TOP DJ CRATES."
        />
      </Head>

      <div className="px-4 py-16 max-w-6xl mx-auto">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            TOP DJ CRATES BLOG
          </h1>
          <p className="text-lg text-text max-w-2xl mx-auto">
            Your source for exclusive DJ news, industry insights, and crate reviews.
          </p>
        </section>

        {/* ============================================================
            LOCAL POSTS (src/posts/*.md)
            Rendered above the Soro embed. Hides itself when empty.
            ============================================================ */}
        {posts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gold mb-6 tracking-tight">
              Latest Articles
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm transition-colors hover:border-gold/60"
                >
                  <h3 className="text-xl font-bold text-primary mb-2 leading-snug group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>

                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="block text-xs uppercase tracking-wider text-zinc-500 mb-3"
                    >
                      {formatPostDate(post.date)}
                    </time>
                  )}

                  {post.excerpt && (
                    <p className="text-text leading-relaxed mb-4">{post.excerpt}</p>
                  )}

                  <span className="text-sm font-bold text-gold">
                    Read the article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            SORO EMBED — original code, untouched.
            ============================================================ */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm min-h-[500px]">
          <div id="soro-blog" className="w-full"></div>
        </div>

        {/* Safe loading of the blog embed script */}
        <Script
          src="https://app.trysoro.com/api/embed/ca934cbd-2453-4b40-9bab-c11d0fdaba58"
          strategy="afterInteractive"
        />
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: getSortedPostsMeta(),
    },
  };
}
