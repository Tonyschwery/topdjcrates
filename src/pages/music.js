import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MusicCard from '@/components/MusicCard';
import { musicPacks as initialMusicPacks } from '@/data/musicPacks';

export default function MusicPage({
  musicPacks = [],
  sharedCrate = null,
  shareUrl = '',
  currentlyPlayingAudioUrl = null,
  currentTrackProgress = 0,
  currentTrackDuration = 0,
  handlePreview = () => { },
  handleSeek = () => { }
}) {
  const router = useRouter();
  const crateRefs = useRef({});

  // Separate bundle packs from regular packs
  const bundlePacks = musicPacks.filter(pack => pack.buttonText === 'Get Bundle');
  const regularPacks = musicPacks.filter(pack => pack.buttonText !== 'Get Bundle');

  // Scroll to specific crate when URL has query parameter
  useEffect(() => {
    if (router.isReady && router.query.crate) {
      const crateId = parseInt(router.query.crate);
      const crateElement = crateRefs.current[crateId];

      if (crateElement) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          crateElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          // Update URL without query param after scrolling (optional)
          // router.replace('/music', undefined, { shallow: true });
        }, 300);
      }
    }
  }, [router.isReady, router.query.crate]);

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
        {/* Dynamic meta tags for shared crate */}
        {sharedCrate ? (
          <>
            <title>{sharedCrate.title} | TOP DJ CRATES</title>
            <meta name="description" content={sharedCrate.description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={shareUrl} />
            <meta property="og:title" content={`${sharedCrate.title} | TOP DJ CRATES`} />
            <meta property="og:description" content={sharedCrate.description} />
            <meta property="og:image" content={sharedCrate.cover} />
            <meta property="og:image:secure_url" content={sharedCrate.cover} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="TOP DJ CRATES" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={shareUrl} />
            <meta name="twitter:title" content={`${sharedCrate.title} | TOP DJ CRATES`} />
            <meta name="twitter:description" content={sharedCrate.description} />
            <meta name="twitter:image" content={sharedCrate.cover} />
          </>
        ) : (
          <>
            <title>High-Quality DJ Music & Crates | TOP DJ CRATES</title>
            <meta name="description" content="Save on high-quality DJ music. Browse the best DJ crates for Afro House, Funky House, Arabic Remixes, and more." />

            {/* Default Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={shareUrl} />
            <meta property="og:title" content="High-Quality DJ Music & Crates | TOP DJ CRATES" />
            <meta property="og:description" content="Save on high-quality DJ music. Browse the best DJ crates for Afro House, Funky House, Arabic Remixes, and more." />
            <meta property="og:site_name" content="TOP DJ CRATES" />

            {/* Default Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={shareUrl} />
            <meta name="twitter:title" content="High-Quality DJ Music & Crates | TOP DJ CRATES" />
            <meta name="twitter:description" content="Save on high-quality DJ music. Browse the best DJ crates for Afro House, Funky House, Arabic Remixes, and more." />
          </>
        )}

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

        {/* Bundle Packs Special Section */}
        {bundlePacks.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                💰 Save More Time, More Money by Refreshing Your Library!
              </h2>
              <p className="text-xl text-text font-semibold">
                Go for Bundle Offers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
              {bundlePacks.map(pack => (
                <div
                  key={pack.id}
                  ref={(el) => {
                    if (el) crateRefs.current[pack.id] = el;
                  }}
                  id={`crate-${pack.id}`}
                >
                  <MusicCard
                    pack={pack}
                    onPreview={handlePreview}
                    currentPlayingAudioUrl={currentlyPlayingAudioUrl}
                    currentTrackProgress={currentTrackProgress}
                    currentTrackDuration={currentTrackDuration}
                    onSeek={handleSeek}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2026 Releases Section */}
        {(() => {
          const packs2026 = regularPacks.filter(pack => pack.year === 2026);
          const olderPacks = regularPacks.filter(pack => pack.year !== 2026);

          return (
            <>
              {/* 2026 Separator & Grid */}
              {packs2026.length > 0 && (
                <div className="mb-20">
                  <div className="relative flex items-center justify-center mb-12">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative bg-background px-4">
                      <span className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider border-2 border-primary px-6 py-2 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        🔥 2026 Releases
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {packs2026.map(pack => (
                      <div
                        key={pack.id}
                        ref={(el) => {
                          if (el) crateRefs.current[pack.id] = el;
                        }}
                        id={`crate-${pack.id}`}
                      >
                        <MusicCard
                          pack={pack}
                          onPreview={handlePreview}
                          currentPlayingAudioUrl={currentlyPlayingAudioUrl}
                          currentTrackProgress={currentTrackProgress}
                          currentTrackDuration={currentTrackDuration}
                          onSeek={handleSeek}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Releases Header */}
              {olderPacks.length > 0 && packs2026.length > 0 && (
                <div className="relative flex items-center justify-center mb-12">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative bg-background px-4">
                    <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">
                      Previous Releases
                    </h3>
                  </div>
                </div>
              )}

              {/* Previous Releases Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {olderPacks.map(pack => (
                  <div
                    key={pack.id}
                    ref={(el) => {
                      if (el) crateRefs.current[pack.id] = el;
                    }}
                    id={`crate-${pack.id}`}
                  >
                    <MusicCard
                      pack={pack}
                      onPreview={handlePreview}
                      currentPlayingAudioUrl={currentlyPlayingAudioUrl}
                      currentTrackProgress={currentTrackProgress}
                      currentTrackDuration={currentTrackDuration}
                      onSeek={handleSeek}
                    />
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}

// Server-side props to generate proper meta tags for social sharing
export async function getServerSideProps(context) {
  const { crate } = context.query;
  const baseUrl = 'https://www.topdjcrates.com';

  // If there's a crate query parameter, find the corresponding crate
  let sharedCrate = null;
  let shareUrl = `${baseUrl}/music`;

  if (crate) {
    const crateId = parseInt(crate);
    sharedCrate = initialMusicPacks.find(pack => pack.id === crateId);

    if (sharedCrate) {
      shareUrl = `${baseUrl}/music?crate=${sharedCrate.id}`;
    }
  }

  return {
    props: {
      musicPacks: initialMusicPacks,
      sharedCrate,
      shareUrl,
    },
  };
}