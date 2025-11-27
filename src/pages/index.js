import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
// I kept your existing carousel import
import FeaturedCratesCarousel from '../components/FeaturedCratesCarousel';
// 1. ADDED: This import for the new animation
import FeaturedIntro from '../components/FeaturedIntro'; 
import { musicPacks } from '../data/musicPacks'; 

export default function Home({ musicPacks = [] }) {
  // 2. ADDED: Logic to find the specific NYE pack (ID 30)
  const nyePack = musicPacks.find(pack => pack.id === 30);

  return (
    <>
      <Head>
        <title>Download Professional DJ Music Packs | TOP DJ CRATES</title>
        <meta 
          name="description" 
          content="The ultimate source to download professional DJ music packs. Stop searching and start playing with exclusive, high-quality music crates curated for DJs."
        />
      </Head>
      
      {/* 3. ADDED: This displays the animation if the pack is found */}
      {nyePack && <FeaturedIntro pack={nyePack} />}

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
      </div>
    </>
  );
}

// Added this to ensure data loads correctly for the find() function
export async function getStaticProps() {
  const { musicPacks } = await import('../data/musicPacks');
  return {
    props: {
      musicPacks,
    },
  };
}