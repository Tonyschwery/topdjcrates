import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
// I kept your existing carousel import
import FeaturedCratesCarousel from '../components/FeaturedCratesCarousel';
import { musicPacks } from '../data/musicPacks'; 
import { getSortedPostsMeta } from '@/lib/posts';
import { formatPostDate } from '@/lib/formatDate';

export default function Home({ musicPacks = [], latestPosts = [] }) {

  return (
    <>
      <Head>
        <title>TOP DJ CRATES | Professional DJ Music Packs (40% OFF Code: LMS26)</title>
        <meta 
          name="description" 
          content="Use coupon code LMS26 at checkout for 40% OFF all items! Save big on high-quality, professional DJ crates. Newly added 2026 Reggaeton, Wedding Anthems, and Indie Dance crates are now live. Start playing what professional DJs actually use."
        />
        <link rel="canonical" href="https://topdjcrates.com/" />
      </Head>

      {/* --- EVERYTHING BELOW THIS IS YOUR ORIGINAL CODE PRESERVED --- */}
      <div className="px-4">
        <section className="text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
            The Ultimate DJ Music Pack Destination
          </h1>
          
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto mb-8">
            Stop searching. Instantly download curated music packs and get the tracks professional DJs actually use.
          </p>
          <Link href="/music" legacyBehavior>
            <a className="bg-accent hover:opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Explore The Crates
            </a>
          </Link>
        </section>
        <section className="pb-20">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Featured DJ Music Packs
          </h2>
          <FeaturedCratesCarousel musicPacks={musicPacks} />
        </section>

        {latestPosts.length > 0 && (
          <section className="pb-24">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Latest from the Blog
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {latestPosts.map((post) => (
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
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-primary mb-2 leading-snug group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                    {post.date && (
                      <time dateTime={post.date} className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        {formatPostDate(post.date)}
                      </time>
                    )}
                    <span className="text-sm font-bold text-gold">Read the article &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/blog" className="text-gold underline underline-offset-4 hover:opacity-80">
                See all articles &rarr;
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// Added this to ensure data loads correctly for the find() function
export async function getStaticProps() {
  const { musicPacks } = await import('../data/musicPacks');
  const latestPosts = getSortedPostsMeta().slice(0, 3);
  return {
    props: {
      musicPacks,
      latestPosts,
    },
  };
}