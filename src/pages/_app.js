import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';
import SocialProofPopup from '@/components/SocialProofPopup';
import { musicPacks as initialMusicPacks } from '@/data/musicPacks';

const sampleNames = [
  "Alex", "Maria", "David", "Fatima", "Chen", "Yuki", "Jose", "Isabella", "Mohammed", "Olga",
  "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia",
  "James", "Amelia", "Benjamin", "Mia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander", "Abigail",
  "Mateo", "Emily", "Sebastian", "Elizabeth", "Daniel", "Sofia", "Michael", "Avery", "Matthew", "Ella",
  "Jackson", "Scarlett", "Leo", "Grace", "Samuel", "Chloe", "Ryan", "Victoria", "Adam", "Riley",
  "Aarav", "Aanya", "Abbas", "Aisha", "Ali", "Amina", "An", "Anu", "Arjun", "Bao",
  "Carlos", "Carmen", "Chaim", "Chang", "Chloe", "Daiki", "Dmitri", "Elena", "Elif", "Emeka",
  "Enzo", "Esra", "Esteban", "Eva", "Ezequiel", "Fang", "Freja", "Gabriel", "Giovanna", "Giuseppe",
  "Habib", "Hafsa", "Hana", "Hans", "Hassan", "Hideki", "Hiroshi", "Hoa", "Hugo", "Ibrahim",
  "Imani", "Ivan", "Javier", "Ji-hoon", "Jin", "Joao", "Johan", "Juan", "Jude", "Kael",
  "Kai", "Karim", "Katarina", "Kenji", "Kevin", "Khaled", "Kiara", "Kim", "Kofi", "Krishna",
  "Lars", "Leila", "Leon", "Li", "Lien", "Luka", "Luna", "Magdalena", "Malik", "Marco",
  "Matteo", "Mei", "Miguel", "Mila", "Min-jun", "Mio", "Musa", "Nabil", "Nadia", "Nia",
  "Niko", "Nina", "Noor", "Okonkwo", "Omar", "Orion", "Oscar", "Pablo", "Paolo", "Pedro",
  "Priya", "Raj", "Ravi", "Reina", "Ren", "Ricardo", "Rohan", "Rosa", "Ryu", "Sadie",
  "Sakura", "Salma", "Santiago", "Saoirse", "Sara", "Seo-yeon", "Sergei", "Shanti", "Sienna", "Simon",
  "Siti", "Sven", "Tariq", "Tatiana", "Teng", "Thanh", "Thiago", "Thomas", "Valeria", "Viktor",
"Wei", "Yara", "Yasmin", "Youssef", "Yui", "Zane", "Zara", "Zeynep", "Zhi", "Zoe"
];
const sampleLocations = [
  "New York, USA",
  "London, UK",
  "Dubai, UAE",
  "Tokyo, Japan",
  "Berlin, Germany",
  "Sydney, Australia",
  "Cairo, Egypt",
  "São Paulo, Brazil",
  "Paris, France",
  "Singapore, Singapore",
  "Riyadh, Saudi Arabia",
  "Moscow, Russia",
  "Beijing, China",
  "Mumbai, India",
  "Mexico City, Mexico",
  "Toronto, Canada",
  "Buenos Aires, Argentina",
  "Istanbul, Turkey",
  "Johannesburg, South Africa",
  "Seoul, South Korea",
  "Lagos, Nigeria",
  "Casablanca, Morocco",
  "Amman, Jordan",
  "Doha, Qatar",
  "Kuwait City, Kuwait",
  "Beirut, Lebanon",
  "Muscat, Oman",
  "Baghdad, Iraq",
  "Algiers, Algeria",
  "Tunis, Tunisia",
  "Jeddah, Saudi Arabia",
  "Alexandria, Egypt",
  "Marrakech, Morocco",
  "Abu Dhabi, UAE",
  "Damascus, Syria",
  "Rome, Italy",
  "Madrid, Spain",
  "Amsterdam, Netherlands",
  "Vienna, Austria",
  "Prague, Czech Republic",
  "Athens, Greece",
  "Stockholm, Sweden",
  "Oslo,Norway",
  "Copenhagen, Denmark",
  "Helsinki, Finland",
  "Warsaw, Poland",
  "Budapest, Hungary",
  "Lisbon, Portugal",
  "Dublin, Ireland",
  "Bangkok, Thailand",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Hanoi, Vietnam",
  "Manila, Philippines",
  "Santiago, Chile",
  "Bogotá, Colombia",
  "Lima, Peru",
  "Caracas, Venezuela",
  "Nairobi, Kenya",
  "Accra, Ghana",
  "Dakar, Senegal",
  "Tel Aviv, Israel",
  "Tehran, Iran",
  "Karachi, Pakistan",
  "Dhaka, Bangladesh",
  "Wellington, New Zealand",
  "Vancouver, Canada"
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState(null);
  const [musicPacks, setMusicPacks] = useState(initialMusicPacks);
  const [currentlyPlayingAudioUrl, setCurrentlyPlayingAudioUrl] = useState(null);
  const audioPlayerRef = useRef(null);
  const [currentTrackProgress, setCurrentTrackProgress] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);


  // LOGIC FOR PROMO POP-UP
  useEffect(() => {
    if (router.pathname === '/' || router.pathname === '/music') {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [router.pathname]);

  // LOGIC FOR SOCIAL PROOF
  useEffect(() => {
    const showRandomNotification = () => {
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomLocation = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      const availableCrates = musicPacks.filter(pack => pack.id !== 16); 
      const randomCrate = availableCrates[Math.floor(Math.random() * availableCrates.length)];

      setNotification({ name: randomName, location: randomLocation, crate: randomCrate });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    const initialTimeout = setTimeout(showRandomNotification, 15000); 
    const interval = setInterval(showRandomNotification, 35000); 

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [musicPacks]);


  // Your existing hooks
  useEffect(() => {
    return () => { if (audioPlayerRef.current) { audioPlayerRef.current.pause(); audioPlayerRef.current.src = ""; } };
  }, []);

  const handlePreview = useCallback((audioUrl) => {
    if(!audioUrl) {
        console.log("Audio preview for this track is not available yet.");
        return;
    }
    if (audioPlayerRef.current) {
      if (currentlyPlayingAudioUrl && currentlyPlayingAudioUrl !== audioUrl) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } else if (currentlyPlayingAudioUrl === audioUrl) {
        if (audioPlayerRef.current.paused) { audioPlayerRef.current.play().catch(e=>console.error(e)); } else { audioPlayerRef.current.pause(); }
        return;
      }
    }
    const newAudio = new Audio(audioUrl);
    audioPlayerRef.current = newAudio;
    newAudio.ontimeupdate = () => { if (newAudio.duration) { setCurrentTrackProgress((newAudio.currentTime / newAudio.duration) * 100); } };
    newAudio.onloadedmetadata = () => setCurrentTrackDuration(newAudio.duration);
    newAudio.onended = () => { setCurrentlyPlayingAudioUrl(null); setCurrentTrackProgress(0); setCurrentTrackDuration(0); };
    newAudio.play().catch(error => {
      console.error(`Audio error:`, error);
      setCurrentlyPlayingAudioUrl(null);
    });
    setCurrentlyPlayingAudioUrl(audioUrl);
  }, [currentlyPlayingAudioUrl]);

  const handleSeek = useCallback((percentage) => {
    if (audioPlayerRef.current && !isNaN(audioPlayerRef.current.duration)) {
      audioPlayerRef.current.currentTime = (percentage / 100) * audioPlayerRef.current.duration;
      setCurrentTrackProgress(percentage);
    }
  }, []);

  const sharedProps = {
    musicPacks,
    currentlyPlayingAudioUrl,
    currentTrackProgress,
    currentTrackDuration,
    handlePreview,
    handleSeek,
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', 'name': 'TOP DJ CRATES', 'url': 'https://www.topdjcrates.com', 'logo': 'https://www.topdjcrates.com/logo.png', }), }} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5306322008183785" crossOrigin="anonymous"></script>
        <noscript>
          <img height="1" width="1" style={{display: 'none'}} src="https://www.facebook.com/tr?id=1295511112023946&ev=PageView&noscript=1"/>
        </noscript>
      </Head>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-S4DNDVZD5L" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S4DNDVZD5L');
        `}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1295511112023946');
          fbq('track', 'PageView');
        `}
      </Script>
      <div className="min-h-screen bg-background text-text font-sans antialiased">
        <Header />
        <main className="container mx-auto bg-vinyl-grooves">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Component {...sharedProps} {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        {showPopup && (
          <PromoPopup
            onClose={() => setShowPopup(false)}
            purchaseLink="https://topdjcrates.gumroad.com/l/guvsms"
          />
        )}
        <SocialProofPopup 
          notification={notification} 
          onClose={() => setNotification(null)} 
        />
      </div>
    </>
  );
}

export default MyApp;

