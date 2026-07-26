import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
            ============================================================ */}
        {posts.length > 0 ? (
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm transition-colors hover:border-gold/60"
                >
                  {post.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2 leading-snug group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>

                    {post.date && (
                      <time
                        dateTime={post.date}
                        className="block text-xs uppercase tracking-wider text-zinc-500 mb-3"
                      >
                        {formatPostDate(post.date)}
                        {post.genre && <span className="text-gold"> &middot; {post.genre}</span>}
                      </time>
                    )}

                    {post.excerpt && (
                      <p className="text-text leading-relaxed mb-4">{post.excerpt}</p>
                    )}

                    <span className="text-sm font-bold text-gold">
                      Read the article &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-center text-zinc-500 py-20">
            New articles are on the way. Check back soon.
          </p>
        )}
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
