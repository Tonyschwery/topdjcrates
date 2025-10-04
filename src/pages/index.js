import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FeaturedCratesCarousel from '../components/FeaturedCratesCarousel';

export default function Home({ musicPacks = [] }) {
  return (
    <>
      <Head>
        {/* SEO OPTIMIZED TITLE */}
        <title>Download Professional DJ Music Packs | TOP DJ CRATES</title>
        
        {/* SEO OPTIMIZED DESCRIPTION */}
        <meta 
          name="description" 
          content="The ultimate source to download professional DJ music packs. Stop searching and start playing with exclusive, high-quality music crates curated for DJs."
        />
      </Head>
      <div className="px-4">
        <section className="text-center py-20 md:py-32">
          {/* SEO OPTIMIZED H1 HEADING */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
            The Ultimate DJ Music Pack Destination
          </h1>
          
          {/* SEO OPTIMIZED SUBHEADING */}
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
          {/* SEO OPTIMIZED H2 HEADING */}
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Featured DJ Music Packs
          </h2>
          <FeaturedCratesCarousel musicPacks={musicPacks} />
        </section>
      </div>
    </>
  );
}