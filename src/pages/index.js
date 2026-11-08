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
        <title>TOP DJ CRATES | Buy Curated DJ Music Packs & Crates (WAV & MP3 Download)</title>
        <meta 
          name="description" 
          content="Use coupon code LMS26 for 40% OFF! Download handpicked, gig-ready DJ crates in WAV & MP3 for Afro House, Amapiano, Tech House, Melodic House, Funk/Disco, Reggaeton, Arabic/Oriental, Latin House & Wedding sets. Ready for Rekordbox, Serato & Virtual DJ."
        />
        <meta
          name="keywords"
          content="DJ crates, DJ crates for sale, DJ music packs download, Afro House DJ crate, Amapiano DJ crate, Tech House DJ pack, Melodic House DJ crate, Funk Disco House crate, Reggaeton DJ edits, Arabic Oriental DJ remixes, WAV DJ crates, Rekordbox crates, Serato crates"
        />
        <link rel="canonical" href="https://topdjcrates.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://topdjcrates.com/" />
        <meta property="og:title" content="TOP DJ CRATES | Buy Curated DJ Music Packs & Crates (WAV & MP3 Download)" />
        <meta property="og:description" content="Download handpicked, gig-ready DJ crates in WAV & MP3 for Afro House, Amapiano, Tech House, Melodic House, Funk/Disco, Reggaeton, Arabic/Oriental & Open Format DJs. Use code LMS26 for 40% OFF!" />
        <meta property="og:image" content="https://i.imgur.com/c2EkBbU.jpeg" />
        <meta property="og:site_name" content="TOP DJ CRATES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://topdjcrates.com/" />
        <meta name="twitter:title" content="TOP DJ CRATES | Buy Curated DJ Music Packs & Crates (WAV & MP3 Download)" />
        <meta name="twitter:description" content="Download handpicked, gig-ready DJ crates in WAV & MP3 for Afro House, Amapiano, Tech House, Melodic House, Funk/Disco, Reggaeton, Arabic/Oriental & Open Format DJs. Use code LMS26 for 40% OFF!" />
        <meta name="twitter:image" content="https://i.imgur.com/c2EkBbU.jpeg" />

        {/* Organization & WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'OnlineStore',
                  '@id': 'https://topdjcrates.com/#organization',
                  name: 'TOP DJ CRATES',
                  url: 'https://topdjcrates.com/',
                  logo: 'https://i.imgur.com/c2EkBbU.jpeg',
                  description:
                    'Curated, club-ready WAV and MP3 DJ music packs and video DJ crates for professional DJs across Afro House, Amapiano, Tech House, Melodic House, Disco/Funk, Reggaeton, Arabic/Oriental, Latin House, and Open Format.',
                  email: 'topdjcrates@proton.me',
                  sameAs: ['https://topdjcrates.gumroad.com'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://topdjcrates.com/#website',
                  url: 'https://topdjcrates.com/',
                  name: 'TOP DJ CRATES',
                  publisher: { '@id': 'https://topdjcrates.com/#organization' },
                },
              ],
            }),
          }}
        />
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