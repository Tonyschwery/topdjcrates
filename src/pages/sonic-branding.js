import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  DeviceTabletIcon, 
  Cog6ToothIcon, 
  GlobeAltIcon, 
  MapPinIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 448 512" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const SonicBranding = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const genres = [
    "Luxury Lounge", "Deep House", "Organic & Ethnic", 
    "Nu-Jazz / Chillout", "High-End Retail", "Afro-House"
  ];

  const whatsappNumber = "+974 5044 1108";
  const whatsappLink = "https://wa.me/97450441108";
  const emailAddress = "topdjcrates@proton.me";
  const mailLink = `mailto:${emailAddress}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowContactModal(false);
      }
    };
    if (showContactModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContactModal]);

  return (
    <div className="bg-background text-text selection:bg-gold selection:text-background relative">
      <Head>
        {/* Basic SEO */}
        <title>Sonic Branding & Remote Music Curation for Luxury Hotels & Venues | TopDJCrates</title>
        <meta name="description" content="Elevate your brand with TopDJCrates. Expert sonic branding, remote music curation, and bespoke sound design for luxury hotels, restaurants, and retail outlets worldwide." />
        <meta name="keywords" content="Sonic Branding, Music Curation for Hotels, Hospitality Music Solutions, Commercial Music Management, Luxury Venue Sound Design, Bespoke Playlists for Restaurants, Retail Music Strategy, Remote Music Management, Background Music for Business, TopDJCrates, Qatar Music Services, Middle East Hospitality Sound" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://topdjcrates.com/sonic-branding" />

        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://topdjcrates.com/sonic-branding" />
        <meta property="og:title" content="Sonic Branding & Remote Music Curation | TopDJCrates" />
        <meta property="og:description" content="Expert music curation for luxury venues worldwide. We handle your brand's sound so you can focus on your business." />
        <meta property="og:image" content="https://topdjcrates.com/og-sonic-branding.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://topdjcrates.com/sonic-branding" />
        <meta name="twitter:title" content="Sonic Branding & Remote Music Curation | TopDJCrates" />
        <meta name="twitter:description" content="Expert music curation for luxury venues worldwide. We handle your brand's sound so you can focus on your business." />
        <meta name="twitter:image" content="https://topdjcrates.com/og-sonic-branding.jpg" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Sonic Branding & Remote Music Curation",
              "serviceType": "Commercial Music Curation",
              "provider": {
                "@type": "Organization",
                "name": "TopDJCrates",
                "url": "https://topdjcrates.com"
              },
              "areaServed": "Worldwide",
              "description": "Expert music curation and remote sound management for luxury hotels, retail, and hospitality venues.",
              "offers": {
                "@type": "Offer",
                "price": "500",
                "priceCurrency": "QAR",
                "description": "Monthly premium curation package"
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-vinyl-grooves">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop" 
            alt="Luxury Venue Background" 
            className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1 mb-6 border border-gold/50 rounded-full bg-gold/10 text-gold text-sm font-medium tracking-widest uppercase">
              B2B Premium Services
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white">
              TopDJCrates <span className="text-gold">Sonic Branding</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Expert Music Curation for Luxury Venues, Hotels, and Retail worldwide. 
              <span className="block mt-2 font-light italic">We handle the music so you can handle the business.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setShowContactModal(true)}
                className="px-8 py-4 bg-gold hover:opacity-90 text-background rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-gold/20"
              >
                <WhatsAppIcon /> Request a Consultation
              </button>
              <a 
                href="#services"
                className="px-8 py-4 border border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm rounded-full font-bold text-lg transition-all text-white"
              >
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Section */}
      <section id="services" className="py-24 bg-zinc-950/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">World-Class <span className="text-gold">Sound Design</span></h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                We translate your brand values into a sonic identity. We curate high-end playlists and bespoke sets specifically for your venue, managing everything from our central hub.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-gold/30 transition-colors">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 text-gold">
                    <Cog6ToothIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Remote Management</h3>
                  <p className="text-gray-400 text-sm">
                    You don't need to learn a dashboard. Just email or WhatsApp us, and we update your music instantly.
                  </p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-gold/30 transition-colors">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 text-gold">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Global Curation</h3>
                  <p className="text-gray-400 text-sm">
                    Whether you are in Doha or Dubai, London or Ibiza, we bring the global sound directly to your speakers.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <span className="w-2 h-8 bg-gold rounded-full" />
                  Available Vibe Genres
                </h3>
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-background border border-zinc-700 rounded-full text-sm font-medium hover:border-gold/50 hover:text-gold transition-all cursor-default text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <p className="text-gray-500 italic text-sm">
                    Tailored sets for poolside, sunset lounges, fine dining, and boutique retail.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Effortless <span className="text-gold">Installation</span></h2>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-background shadow-lg shadow-gold/20">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">In Qatar</h3>
                    <p className="text-gray-400">
                      We deliver the dedicated streaming tablet, perform the full physical installation, and integrate it with your existing sound system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 border border-zinc-700 rounded-2xl flex items-center justify-center text-gold bg-zinc-900/50">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">International</h3>
                    <p className="text-gray-400">
                      We ship the pre-configured hardware and provide 1-on-1 virtual setup support to ensure your music never stops.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <p className="text-gold text-sm flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    Professional speaker system procurement and installation available for new venues.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent pointer-events-none" />
                <img 
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop" 
                  alt="Streaming Tablet and Sound System" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legal & Professionalism Section */}
      <section className="py-24 bg-zinc-900/50 border-y border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-zinc-950 border border-gold/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="flex-shrink-0 w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.119c-.035.505-.063 1.012-.081 1.52a10.894 10.894 0 001.378 5.753c.456.816.899 1.588 1.423 2.322a11.027 11.027 0 0010.338 5.03c.524-.734.967-1.506 1.423-2.322a10.894 10.894 0 001.378-5.753c-.018-.508-.046-1.015-.081-1.52a11.959 11.959 0 01-7.652-3.375z" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white uppercase tracking-tight">The <span className="text-gold">Business Advantage</span></h2>
                <div className="space-y-4">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Personal music services such as <span className="text-white font-bold">Spotify</span> or <span className="text-white font-bold">Apple Music</span> are not approved for use in any business environment. 
                  </p>
                  <p className="text-gray-400">
                    Using unauthorized consumer accounts in a venue can lead to serious legal concerns and copyright infringements. You need a suitable music provider and the correct licenses to protect your business.
                  </p>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-white font-medium text-lg">
                      <span className="text-gold font-bold">TopDJCrates</span> is a game changer: 
                    </p>
                    <p className="text-gray-400 mt-2">
                      Made to bring you music that's legal for your business, without compromising on quality. Simply add public performance licenses from your local collecting societies, and we handle the rest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden bg-vinyl-grooves">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Investment in <span className="text-gold">Atmosphere</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Premium sound curation billed every 6 months or annually to suit your business cycle.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Single Premium Package Card */}
            <motion.div 
              className="p-10 bg-zinc-900 border border-gold/30 rounded-3xl flex flex-col relative overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Sonic Branding Premium</h3>
                  <p className="text-gold font-medium">Professional Remote Curation</p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-4xl font-extrabold text-white">500 QAR</div>
                  <div className="text-gray-400 text-sm">per month</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <ul className="space-y-4">
                  {[
                    "Professional Music Curation",
                    "Custom Genre Selection",
                    "Remote Management by Our Team",
                    "Instant Style Changes via Support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckIcon className="w-5 h-5 text-gold shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {[
                    "Seasonal Rotation Management",
                    "VIP Priority Support",
                    "1-on-1 Brand Sound Consultation"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckIcon className="w-5 h-5 text-gold shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background/50 rounded-2xl p-6 mb-8 border border-zinc-800">
                <div className="flex items-center gap-3 text-white font-bold mb-2">
                  <DeviceTabletIcon className="w-6 h-6 text-gold" /> Hardware Information
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A dedicated high-performance streaming tablet is required for the service. 
                  <span className="text-gold font-bold block mt-1 underline decoration-gold/30 underline-offset-4">Note: Hardware device is charged separately.</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full py-4 text-center bg-gold text-background rounded-xl font-extrabold hover:opacity-90 transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-3"
                >
                  <WhatsAppIcon /> Request Premium Setup
                </button>
                <p className="text-gray-500 text-xs text-center font-medium">
                  Available on 6-month or annual billing cycles only.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA / Footer */}
      <section className="py-24 bg-background border-t border-zinc-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">Ready to Elevate Your Venue?</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Start your free audio consultation today. We'll help you define your brand's sound and arrange your tablet setup.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <button 
                onClick={() => setShowContactModal(true)}
                className="flex items-center gap-3 text-2xl font-bold text-white hover:text-gold transition-colors"
              >
                <WhatsAppIcon size={32} className="text-green-500" /> {whatsappNumber}
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="flex items-center gap-3 text-2xl font-bold text-white hover:text-gold transition-colors"
              >
                <EnvelopeIcon className="w-8 h-8 text-gold" /> {emailAddress}
              </button>
            </div>
            
            <div className="mt-20 pt-10 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <img src="/LOGO.png" alt="Logo" className="w-10 h-10 grayscale opacity-50" />
                <span className="text-gray-500 text-sm tracking-widest uppercase">TopDJCrates © 2024</span>
              </div>
              <div className="flex gap-6 text-gray-500 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Options Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowContactModal(false)}
            />
            <motion.div 
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-gold/30 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Request Consultation</h3>
                <p className="text-gray-400">How would you like to reach us?</p>
              </div>

              <div className="space-y-4">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">WhatsApp</div>
                    <div className="text-sm text-gray-400">{whatsappNumber}</div>
                  </div>
                </a>

                <div className="relative group">
                  <a 
                    href={mailLink}
                    className="flex items-center gap-4 p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-all"
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <EnvelopeIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-grow">
                      <div className="font-bold text-white">Email</div>
                      <div className="text-sm text-gray-400">{emailAddress}</div>
                    </div>
                  </a>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(emailAddress);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-gold transition-colors flex items-center gap-2"
                    title="Copy Email"
                  >
                    {copied ? (
                      <span className="text-xs font-bold">Copied!</span>
                    ) : (
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
                We usually respond within 24 hours. Your brand's sound is our priority.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SonicBranding;




