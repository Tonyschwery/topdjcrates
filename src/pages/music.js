import React from 'react';
import Head from 'next/head';
import MusicCard from '@/components/MusicCard';

export default function MusicPage({ 
  musicPacks = [], 
  currentlyPlayingAudioUrl = null, 
  currentTrackProgress = 0, 
  currentTrackDuration = 0, 
  handlePreview = () => {}, 
  handleSeek = () => {} 
}) {

  // --- NEW: GENERATE PRODUCT SCHEMA FOR SEO ---
  const generateProductSchema = () => {
    if (!musicPacks || musicPacks.length === 0) {
      return null;
    }

    // Create a schema for each individual product
    const productSchemas = musicPacks.map(pack => ({
      '@type': 'Product',
      'name': pack.title,
      'image': pack.cover,
      'description': pack.description,
      'sku': pack.id.toString(), // A unique ID for the product
      'brand': {
        '@type': 'Brand',
        'name': 'TOP DJ CRATES'
      },
      'offers': {
        '@type': 'Offer',
        'url': pack.gumroadLink,
        'priceCurrency': 'USD',
        'price': pack.discountedPrice.toFixed(2),
        'availability': 'https://schema.org/InStock',
        'priceValidUntil': new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] // Valid for 1 year
      }
    }));

    // Create a main schema that lists all the products on the page
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': productSchemas.map((schema, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': schema
      }))
    };

    return JSON.stringify(itemListSchema);
  };

  const productSchemaScript = generateProductSchema();
  
  return (
    <>
      <Head>
        <title>High-Quality DJ Music & Crates | TOP DJ CRATES</title>
        <meta name="description" content="Save on high-quality DJ music. Browse the best DJ crates for Afro House, Funky House, Arabic Remixes, and more." />
        
        {/* --- ADDED THE PRODUCT SCHEMA SCRIPT TO THE HEAD --- */}
        {productSchemaScript && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: productSchemaScript }}
          />
        )}
      </Head>
      <div className="px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">The Best DJ Crates Online</h1>
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto">High-quality, curated music for professional DJs. Stop searching and start playing.</p>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {musicPacks && musicPacks.map(pack => (
            <MusicCard 
              key={pack.id} 
              pack={pack} 
              onPreview={handlePreview} 
              currentPlayingAudioUrl={currentlyPlayingAudioUrl} 
              currentTrackProgress={currentTrackProgress} 
              currentTrackDuration={currentTrackDuration} 
              onSeek={handleSeek} 
            />
          ))}
        </div>
      </div>
    </>
  );
}