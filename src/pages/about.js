import React from 'react';
import Head from 'next/head';
import TestimonialCarousel from '@/components/TestimonialCarousel';

export default function AboutPage({ musicPacks = [] }) {
  return (
    <>
      <Head>
        {/* SEO OPTIMIZED TITLE */}
        <title>Where Do DJs Get Their Music From? | TOP DJ CRATES</title>
        
        {/* SEO OPTIMIZED DESCRIPTION */}
        <meta 
          name="description" 
          content="Wondering where do DJs get their music from? Discover how TOP DJ CRATES provides the secret source for professionals to get high-quality, exclusive DJ music packs."
        />
      </Head>
      <div className="px-4 py-16">
        <section id="about" className="text-center">
          {/* This H1 is already perfect for SEO */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-10">
            The Answer to "Where Do DJs Get Their Music?"
          </h1>
          <div className="text-lg md:text-xl text-text max-w-4xl mx-auto leading-loose space-y-6 text-left">
            <p><strong className="text-gold font-bold">No More Digging for Tracks.</strong> We've Done It For You. Every pack on our site is curated by professional DJs who know exactly what works on the dancefloor.</p>
            <p>These aren’t random loops or stock samples — they’re <strong className="text-gold font-bold">handpicked, high-quality WAV files</strong> ready to plug straight into Rekordbox, Serato, Virtual DJ, or any software you use.</p>
            <p>We save you the hours of digging, sorting, and organizing — so you can focus on what you do best: performing. Just <strong className="text-gold font-bold">drag, drop, and play.</strong> It’s that easy.</p>
          </div>
        </section>
        <div className="mt-20">
           <TestimonialCarousel />
        </div>
      </div>
    </>
  );
}