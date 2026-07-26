import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home({ musicPacks = [] }) {
  return (
    <>
      <Head>
        <title>TOP DJ CRATES - High-Quality Music Packs & Tools</title>
        <meta name="description" content="The ultimate source for pro DJs. Stop searching and start playing with exclusive, high-quality music crates."/>
      </Head>
      <div className="px-4">
        <section className="text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">The Crates DJs Actually Use</h1>
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto mb-8">Stop searching. Start playing. High-quality, curated music packs for professional DJs.</p>
          <Link href="/music" legacyBehavior>
            <a className="bg-accent hover:opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">Explore The Crates</a>
          </Link>
        </section>
        <section className="pb-20">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Featured Crates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {musicPacks && musicPacks.slice(0, 8).map((pack) => (
              <Link key={pack.id} href="/music" passHref>
                <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                  <img src={pack.cover} alt={pack.title} className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-primary truncate">{pack.title}</h3>
                    <p className="text-sm text-gray-400">{pack.artist}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}