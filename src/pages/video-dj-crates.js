import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PlayIcon, PauseIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { videomusicPacks as initialVideoPacks } from '@/data/videomusicPacks';
import TracklistModal from '@/components/TracklistModal';

export default function VideoCratesPage({
  videomusicPacks = [],
  sharedCrate = null,
  shareUrl = ''
}) {
  const router = useRouter();
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [activeTracklistPack, setActiveTracklistPack] = useState(null);
  const shareMenuRef = useRef(null);
  const crateRefs = useRef({});

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(null);
      }
    };
    if (showShareMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Scroll to specific crate when URL has query parameter
  useEffect(() => {
    if (router.isReady && router.query.crate) {
      const crateId = parseInt(router.query.crate);
      const crateElement = crateRefs.current[crateId];

      if (crateElement) {
        setTimeout(() => {
          crateElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }
    }
  }, [router.isReady, router.query.crate]);

  // Handle share link builder
  const getShareUrl = (packId) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/video-dj-crates?crate=${packId}`;
  };

  const handleShareClick = (packId, title) => {
    const url = getShareUrl(packId);
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this VJ Video pack: ${title}`,
        url: url
      }).catch(err => console.error(err));
    } else {
      setShowShareMenu(packId);
    }
  };

  const copyToClipboard = (packId) => {
    const url = getShareUrl(packId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
        setShowShareMenu(null);
      });
    }
  };

  const handleGetVideoPackClick = (pack) => {
    // 1. Facebook Pixel initiate checkout tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: pack.title,
        content_ids: [pack.id],
        content_type: 'product',
        value: pack.discountedPrice,
        currency: 'USD'
      });
    }

    // 2. Google Analytics Tracking
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Standard GA4 Ecommerce Event
      window.gtag('event', 'begin_checkout', {
        value: pack.discountedPrice,
        currency: 'USD',
        items: [{
          item_id: pack.id.toString(),
          item_name: pack.title,
          price: pack.discountedPrice,
          quantity: 1,
          item_category: 'video'
        }]
      });

      // Simple Custom GA4 Event
      window.gtag('event', 'click_get_crate', {
        event_category: 'engagement',
        event_label: pack.title,
        pack_id: pack.id,
        price: pack.discountedPrice,
        pack_type: 'video'
      });
    }
  };

  // --- GENERATE PRODUCT SCHEMA FOR SEO ---
  const generateProductSchema = () => {
    if (!videomusicPacks || videomusicPacks.length === 0) {
      return null;
    }

    const productSchemas = videomusicPacks.map(pack => ({
      '@type': 'Product',
      'name': pack.title,
      'image': pack.cover,
      'description': pack.description,
      'sku': pack.id.toString(),
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
        'priceValidUntil': new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      }
    }));

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
        {/* Dynamic Meta Tags for Shared VJ Crate */}
        {sharedCrate ? (
          <>
            <title>{sharedCrate.title} | Premium VJ Video Crates | TOP DJ CRATES</title>
            <meta name="description" content={sharedCrate.description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={shareUrl} />
            <meta property="og:title" content={`${sharedCrate.title} | Premium VJ Video Crates | TOP DJ CRATES`} />
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
            <meta name="twitter:title" content={`${sharedCrate.title} | Premium VJ Video Crates | TOP DJ CRATES`} />
            <meta name="twitter:description" content={sharedCrate.description} />
            <meta name="twitter:image" content={sharedCrate.cover} />
          </>
        ) : (
          <>
            <title>Premium VJ & Video DJ Crates | TOP DJ CRATES (40% OFF Code: LMS26)</title>
            <meta 
              name="description" 
              content="Elevate your visual sets with premium high-definition VJ video crates. Meticulously compiled music videos and custom edits formatted perfectly in MP4. Use code LMS26 for 40% OFF!" 
            />

            {/* Default Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={shareUrl || 'https://www.topdjcrates.com/video-dj-crates'} />
            <meta property="og:title" content="Premium VJ & Video DJ Crates | TOP DJ CRATES (40% OFF Code: LMS26)" />
            <meta property="og:description" content="Elevate your visual sets with premium high-definition VJ video crates. Meticulously compiled music videos and custom edits formatted perfectly in MP4. Use code LMS26 for 40% OFF!" />
            <meta property="og:image" content="https://i.imgur.com/30xrVla.png" />
            <meta property="og:site_name" content="TOP DJ CRATES" />

            {/* Default Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={shareUrl || 'https://www.topdjcrates.com/video-dj-crates'} />
            <meta name="twitter:title" content="Premium VJ & Video DJ Crates | TOP DJ CRATES (40% OFF Code: LMS26)" />
            <meta name="twitter:description" content="Elevate your visual sets with premium high-definition VJ video crates. Meticulously compiled music videos and custom edits formatted perfectly in MP4. Use code LMS26 for 40% OFF!" />
            <meta name="twitter:image" content="https://i.imgur.com/30xrVla.png" />
          </>
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={shareUrl || 'https://www.topdjcrates.com/video-dj-crates'} />

        {/* Schema.org Product List Markup */}
        {productSchemaScript && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: productSchemaScript }}
          />
        )}
      </Head>

      <div className="px-4 py-16 max-w-7xl mx-auto">
        {/* Page Header */}
        <section className="text-center mb-16">
          <span className="bg-red-600 text-white font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
            🔥 BRAND NEW STORE FRONT
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mt-4 mb-4 tracking-tight uppercase">
            Visual DJ & VJ Video Crates
          </h1>
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto">
            Premium high-definition video collections and custom edits. Built strictly for professional video DJs and VJs.
          </p>
        </section>

        {/* Video Crates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {videomusicPacks.map((pack) => (
            <div 
              key={pack.id} 
              ref={(el) => {
                if (el) crateRefs.current[pack.id] = el;
              }}
              id={`crate-${pack.id}`}
              className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between h-full group relative shadow-2xl transition-all duration-300 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
            >
              <div>
                {/* Cover Image */}
                <div className="relative overflow-hidden rounded-lg border border-zinc-800 shadow-md mb-4 aspect-square">
                  <img 
                    src={pack.cover} 
                    alt={pack.title} 
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-gold text-zinc-950 font-black text-xs uppercase tracking-widest py-2.5 px-5 rounded-lg shadow-lg">
                      🎥 Preview Tracks Below
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-primary mb-2 uppercase tracking-wide">
                  {pack.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {pack.description}
                </p>

                {/* Tracks List */}
                <div className="mb-6">
                  {pack.tracklistUrl && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setActiveTracklistPack(pack);
                          if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                            window.gtag('event', 'view_tracklist', {
                              event_category: 'engagement',
                              event_label: pack.title,
                              pack_id: pack.id,
                              pack_type: 'video'
                            });
                          }
                        }}
                        className="inline-flex items-center text-xs font-black text-gold hover:text-white transition-colors border border-gold/45 hover:border-white px-3 py-1.5 rounded-full uppercase tracking-wider bg-zinc-950/40 hover:bg-zinc-800"
                      >
                        <span className="mr-1.5">📄</span> View Full Tracklist
                      </button>
                    </div>
                  )}
                  <h4 className="text-xs font-black text-gold tracking-widest uppercase mb-3">
                    🎥 Video Previews (Click to Play):
                  </h4>
                  <div className="space-y-2">
                    {pack.tracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setCurrentVideoUrl(track.videoPreview);
                          setCurrentVideoTitle(track.title);
                        }}
                        className="w-full flex items-center justify-between text-left p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-900 hover:border-gold/25 transition-all group/track"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-gold group-hover/track:scale-110 transition-transform duration-200">
                            ▶️
                          </span>
                          <span className="text-xs text-gray-300 font-medium truncate">
                            {track.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black shrink-0 ml-2">
                          PREVIEW
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Bottom: Prices & Actions */}
              <div className="mt-6 border-t border-zinc-800/80 pt-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ${pack.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl font-black text-gold tracking-tight">
                      ${pack.discountedPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => handleShareClick(pack.id, pack.title)}
                      className="bg-zinc-800 text-text font-bold py-2 px-3 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                      aria-label="Share this pack"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>

                    {/* Share Menu */}
                    {showShareMenu === pack.id && (
                      <div 
                        ref={shareMenuRef}
                        className="absolute bottom-full right-0 mb-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 p-2"
                      >
                        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-zinc-700">
                          <span className="text-xs font-bold text-gray-400">SHARE</span>
                          <button onClick={() => setShowShareMenu(null)} className="text-gray-400 hover:text-white">
                            &times;
                          </button>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(pack.id)} 
                          className="w-full text-left px-2 py-1.5 text-xs text-gray-200 hover:bg-zinc-700 rounded transition-colors"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    )}

                    <a
                      href={pack.gumroadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleGetVideoPackClick(pack)}
                      className="bg-gold hover:bg-white text-zinc-950 font-black py-2 px-4 rounded-lg text-center transition-all duration-300 uppercase tracking-wide text-xs"
                    >
                      {pack.buttonText || 'Get Video Pack'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Video Preview Modal (Cinematic Frame) */}
        {currentVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-modal-pop">
            <div className="relative w-full max-w-4xl bg-zinc-950 border border-gold/40 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60">
                <h3 className="font-extrabold text-gold text-sm truncate uppercase tracking-wide">
                  🎥 Video Preview: {currentVideoTitle}
                </h3>
                <button
                  onClick={() => {
                    setCurrentVideoUrl(null);
                    setCurrentVideoTitle('');
                  }}
                  className="text-gray-400 hover:text-gold transition-colors p-1"
                  aria-label="Close video player"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  src={currentVideoUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Modal Footer Tip */}
              <div className="px-5 py-2.5 bg-zinc-900/60 border-t border-zinc-800/80 text-[10px] text-gray-400 text-center font-semibold">
                ⚡ Note: Previews are highly compressed for rapid stream loading. Purchase files contain premium uncompressed VJ edits.
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Tracklist Modal */}
        {activeTracklistPack && (
          <TracklistModal
            url={activeTracklistPack.tracklistUrl}
            title={activeTracklistPack.title}
            onClose={() => setActiveTracklistPack(null)}
          />
        )}
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
  let shareUrl = `${baseUrl}/video-dj-crates`;

  if (crate) {
    const crateId = parseInt(crate);
    sharedCrate = initialVideoPacks.find(pack => pack.id === crateId);

    if (sharedCrate) {
      shareUrl = `${baseUrl}/video-dj-crates?crate=${sharedCrate.id}`;
    }
  }

  return {
    props: {
      videomusicPacks: initialVideoPacks,
      sharedCrate,
      shareUrl,
    },
  };
}
