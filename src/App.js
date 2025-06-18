import React, { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
  // State for current active section for navigation highlighting
  const [activeSection, setActiveSection] = useState('home');
  // State for managing custom modal visibility and content
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  // Refs for sections to enable smooth scrolling
  const homeRef = useRef(null);
  const musicRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // --- AUDIO PLAYBACK STATE & REF FIX ---
  // State to store the URL of the currently playing track (for comparison)
  const [currentlyPlayingAudioUrl, setCurrentlyPlayingAudioUrl] = useState(null);
  // Ref to store the actual HTMLAudioElement instance (for play/pause control)
  const audioPlayerRef = useRef(null);
  // --- END AUDIO PLAYBACK STATE & REF FIX ---

  // Mock music data - each object is now a "pack" with multiple "tracks"
  const [musicPacks, setMusicPacks] = useState([
    {
      id: 1,
      title: 'Arabic oriental remixes 2025',
      artist: 'Various Artists',
      genre: 'Oriental Remixes',
      description: 'A curated selection of Edits and Extended Oriental remixes Curated by top DJs to ignite the dancefloor.',
      cover: 'https://i.imgur.com/sua7apk.png', // Placeholder image
      tracks: [
        { id: '1a', title: 'Midnight Groove', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: '1b', title: 'Soulful Sunrise', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: '1c', title: 'Velvet Horizon', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: '1d', title: 'After Hours Funk', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { id: '1e', title: 'Urban Echoes', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      ]
    },
    {
      id: 2,
      title: 'AFRO ORIENTAL HOUSE',
      artist: 'VARIOUS',
      genre: 'AFRO-ORIENTAL',
      description: 'Including freshest top hits arabic afro house , remixes and unreleased tracks of the year! ',
      cover: 'https://i.imgur.com/IYiNzv9.png', // Placeholder image
      tracks: [
        { id: '2a', title: 'ROCK THE DANA DANA', audioPreview: '/AUDIO/OR PREVIEW 1.mp3' },
        { id: '2b', title: 'Distant Signal', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
        { id: '2c', title: 'Rave Revival', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
        { id: '2d', title: 'Subterranean Beat', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        { id: '2e', title: 'Acid Wave', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      ]
    },
    {
      id: 3,
      title: 'Progressive Trance Dreams',
      artist: 'Dream Weaver',
      genre: 'Progressive Trance',
      description: 'Soaring melodies and driving baselines for uplifting journeys into sound.',
      cover: 'https://placehold.co/400x400/3b82f6/ffffff?text=Trance+Dreams', // Placeholder image
      tracks: [
        { id: '3a', title: 'Celestial Ascent', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
        { id: '3b', title: 'Lunar Embrace', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
        { id: '3c', title: 'Starlight Symphony', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
        { id: '3d', title: 'Galactic Flow', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
        { id: '3e', title: 'Aurora Bliss', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
      ]
    },
    {
      id: 4,
      title: 'DnB Liquid Funk Bundle',
      artist: 'Bassline Cartel',
      genre: 'Drum & Bass',
      description: 'Smooth and soulful drum & bass, perfect for chillout and dancefloors alike.',
      cover: 'https://placehold.co/400x400/f97316/ffffff?text=DnB+Funk+Bundle', // Placeholder image
      tracks: [
        { id: '4a', title: 'Flow State', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
        { id: '4b', title: 'Jungle Whisper', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
        { id: '4c', title: 'Urban Pulse', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3' },
        { id: '4d', title: 'Sunset Cruising', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3' },
        { id: '4e', title: 'City Lights', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3' },
      ]
    },
    {
      id: 5,
      title: 'Future Bass Toolkit Vol. 1',
      artist: 'Beat Innovator',
      genre: 'Future Bass',
      description: 'Catchy melodies and heavy drops for modern electronic sets and festivals.',
      cover: 'https://placehold.co/400x400/a855f7/ffffff?text=Future+Bass+Vol+1', // Placeholder image
      tracks: [
        { id: '5a', title: 'Neon Dreams', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3' },
        { id: '5b', title: 'Pixel Heart', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3' },
        { id: '5c', title: 'Glitch Garden', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3' },
        { id: '5d', title: 'Warp Drive', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3' },
        { id: '5e', title: 'Synthwave Skyline', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3' },
      ]
    },
    {
      id: 6,
      title: 'Tech House Grooves Vol. 3',
      artist: 'Groove Machine',
      genre: 'Tech House',
      description: 'Minimal yet powerful tech house for energetic and driving club nights.',
      cover: 'https://placehold.co/400x400/1e40af/ffffff?text=Tech+House+Vol+3', // Placeholder image
      tracks: [
        { id: '6a', title: 'Late Night Session', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3' },
        { id: '6b', title: 'Warehouse Vibe', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3' },
        { id: '6c', title: 'Driving Percussion', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3' },
        { id: '6d', title: 'Underground Rhythm', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3' },
        { id: '6e', title: 'Echo Chamber', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3' },
      ]
    },
    {
      id: 7,
      title: 'Global Beats Collection',
      artist: 'World Fusion',
      genre: 'Global/Afro House',
      description: 'Organic rhythms and vibrant melodies inspired by global sounds.',
      cover: 'https://placehold.co/400x400/84cc16/ffffff?text=Global+Beats',
      tracks: [
        { id: '7a', title: 'Desert Dance', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-31.mp3' },
        { id: '7b', title: 'Jungle Drums', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-32.mp3' },
        { id: '7c', title: 'Tribal Echoes', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-33.mp3' },
        { id: '7d', title: 'Oasis Groove', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-34.mp3' },
        { id: '7e', title: 'River Song', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-35.mp3' },
      ]
    },
    {
      id: 8,
      title: 'Classic Funk & Disco Edits',
      artist: 'Groove Revival',
      genre: 'Funk/Disco',
      description: 'Timeless funk and disco edits reimagined for modern DJ sets.',
      cover: 'https://placehold.co/400x400/d946b5/ffffff?text=Funk+Disco+Edits',
      tracks: [
        { id: '8a', title: 'Boogie Wonderland', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-36.mp3' },
        { id: '8b', title: 'Disco Fever', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-37.mp3' },
        { id: '8c', title: 'Street Funk', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-38.mp3' },
        { id: '8d', title: 'Retro Vibes', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-39.mp3' },
        { id: '8e', title: 'Saturday Night', audioPreview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-40.mp3' },
      ]
    },
  ]);

  // Effect to clean up audio player when component unmounts
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = ""; // Clear src to release resource
      }
    };
  }, []); // Run only on mount and unmount

  // Handle scroll to section for navigation
  const scrollToSection = (sectionRef, sectionId) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  // Function to handle audio preview
  const handlePreview = (audioUrl) => {
    // If the same track is currently playing, pause it and reset state
    if (currentlyPlayingAudioUrl === audioUrl) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      setCurrentlyPlayingAudioUrl(null); // No track is playing
      return;
    }

    // If a different track is playing, stop it first
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }

    // Create a new Audio object and play the selected track
    audioPlayerRef.current = new Audio(audioUrl);
    audioPlayerRef.current.play().catch(error => {
      console.error("Audio playback error:", error);
      // Optional: Show a user-friendly message about playback failure
      setModalContent("Could not play audio. Please ensure your browser allows autoplay or try again.");
      setShowModal(true);
    });

    // Update the state with the URL of the newly playing track
    setCurrentlyPlayingAudioUrl(audioUrl);

    // Optional: Stop playing after a certain duration for a true "preview"
    // audioPlayerRef.current.onended = () => {
    //   setCurrentlyPlayingAudioUrl(null);
    // };
    // setTimeout(() => {
    //   if (audioPlayerRef.current && !audioPlayerRef.current.paused && currentlyPlayingAudioUrl === audioUrl) {
    //     audioPlayerRef.current.pause();
    //     audioPlayerRef.current.currentTime = 0;
    //     setCurrentlyPlayingAudioUrl(null);
    //   }
    // }, 30000); // Stop after 30 seconds
  };

  // Function to handle "Buy Now" button click with custom modal
  const handleBuyNow = (packTitle) => {
    setModalContent(
      `Thank you for your interest in "${packTitle}"! For a real transaction, this would integrate with a secure payment gateway like Stripe or PayPal.`
    );
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-purple-950 text-gray-100 font-inter antialiased overflow-x-hidden">
      {/* Tailwind CSS CDN */}
      {/* Removed from here and placed in public/index.html */}
      {/* Inter font */}
      {/* Removed from here and placed in public/index.html */}

      {/* Header */}
      <header className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-4 shadow-xl fixed w-full z-20 transition-all duration-300">
        <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-extrabold text-emerald-400 mb-4 md:mb-0">
            Your Sound Canvas
          </h1>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
            <li>
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection(homeRef, 'home'); }}
                className={`text-lg px-3 py-1 rounded-full transition-all duration-300
                  ${activeSection === 'home' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700'}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#music"
                onClick={(e) => { e.preventDefault(); scrollToSection(musicRef, 'music'); }}
                className={`text-lg px-3 py-1 rounded-full transition-all duration-300
                  ${activeSection === 'music' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700'}`}
              >
                Music
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef, 'about'); }}
                className={`text-lg px-3 py-1 rounded-full transition-all duration-300
                  ${activeSection === 'about' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700'}`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection(contactRef, 'contact'); }}
                className={`text-lg px-3 py-1 rounded-full transition-all duration-300
                  ${activeSection === 'contact' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700'}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section ref={homeRef} id="home" className="relative h-screen flex items-center justify-center text-center p-4 overflow-hidden">
        {/* Dynamic Background Effect (inspired by MusicLab's interactivity) */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 opacity-70 animate-gradient-shift"></div>
        <div className="absolute inset-0 z-0 opacity-20" style={{
          background: 'radial-gradient(circle at center, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0) 50%), radial-gradient(circle at top left, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 50%)'
        }}></div>

        <div className="z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl animate-fade-in-up">
            Unleash Your Next Anthem.
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-up delay-200">
            Exclusive tracks and powerful tools for professional DJs.
          </p>
          <button
            onClick={() => scrollToSection(musicRef, 'music')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in-up delay-400 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-75"
          >
            Explore Beats
          </button>
        </div>
        {/* Keyframes for subtle gradient animation */}
        <style>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 15s ease infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
        `}</style>
      </section>

      {/* Music Showcase Section */}
      <section ref={musicRef} id="music" className="container mx-auto py-16 px-4 md:px-8 bg-gray-900 rounded-xl shadow-inner-xl my-12">
        <h3 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-400 mb-16 relative">
          <span className="relative z-10">Our Latest Drops</span>
          <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-24 h-2 bg-emerald-600 rounded-full opacity-70 z-0"></span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {musicPacks.map(pack => ( // Changed from musicTracks to musicPacks
            <MusicCard
              key={pack.id}
              pack={pack} // Pass the entire pack object
              onPreview={handlePreview}
              currentPlayingAudioUrl={currentlyPlayingAudioUrl} // Pass the stored URL
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="container mx-auto py-16 px-4 md:px-8 text-center bg-gray-800 rounded-xl shadow-xl my-12">
        <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-10">About Us</h3>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          We are a dedicated team of producers creating high-quality, exclusive tracks designed to elevate your DJ sets and electrify dancefloors worldwide. Our passion lies in crafting innovative sounds that push boundaries and inspire creativity.
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mt-4">
          Join our community of forward-thinking DJs and discover the perfect sound for your next mix.
        </p>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="container mx-auto py-16 px-4 md:px-8 text-center bg-gray-900 rounded-xl shadow-inner-xl my-12">
        <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-10">Get in Touch</h3>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Have questions or a custom request? We'd love to hear from you!
        </p>
        <form className="max-w-xl mx-auto space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors duration-200"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors duration-200"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors duration-200 resize-y"
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-75"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-gray-400 border-t border-gray-800">
        <p className="text-md mb-4">&copy; {new Date().getFullYear()} Your Sound Canvas. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-2xl">
          {/* Social media icons (using simple text/emojis, can replace with SVG/Font Awesome) */}
          <a href="#" className="hover:text-emerald-400 transition-colors duration-200" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.65h-2.54V12h2.54V9.743c0-2.507 1.492-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.246 0-1.637.77-1.637 1.562V12h2.773l-.443 2.65h-2.33V21.88C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </a>
          <a href="#" className="hover:text-emerald-400 transition-colors duration-200" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.062 1.065.053 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153s.899 1.112 1.153 1.772c.248.638.412 1.363.465 2.428.052 1.066.062 1.409.062 4.122s-.01 3.056-.062 4.122c-.053 1.065-.217 1.79-.465 2.428-.254.66-.598 1.216-1.153 1.772s-1.112.899-1.772 1.153c-.638.248-1.363.412-2.428.465-1.066.052-1.409.062-4.122.062s-3.056-.01-4.122-.062c-1.065-.053-1.79-.217-2.428-.465-.66-.254-1.216-.598-1.772-1.153s-.899-1.112-1.153-1.772c-.248-.638-.412-1.363-.465-2.428-.052-1.066-.062-1.409-.062-4.122s.01-3.056.062-4.122c.053-1.065.217-1.79.465-2.428.254-.66.598-1.216 1.153-1.772s1.112-.899 1.772-1.153c.638-.248 1.363-.412 2.428-.465C8.944 2.01 9.283 2 12 2zm0 1.62c-2.717 0-3.048.01-4.097.054-.985.044-1.58.196-1.954.34-.4.152-.779.375-1.127.723-.348.348-.571.728-.723 1.127-.144.374-.296.969-.34 1.954-.044 1.049-.054 1.38-.054 4.097s.01 3.048.054 4.097c.044.985.196 1.58.34 1.954.152.4.375.779.723 1.127.348.348.728.571 1.127.723.374.144.969.296 1.954.34 1.049.044 1.38.054 4.097.054s3.048-.01 4.097-.054c.985-.044 1.58-.196 1.954-.34.4-.152.779-.375 1.127-.723.348-.348.571-.728.723-1.127.144-.374.296-.969.34-1.954.044-1.049.054-1.38.054-4.097s-.01-3.048-.054-4.097c-.044-.985-.196-1.58-.34-1.954-.152-.4-.375-.779-.723-1.127-.348-.348-.728-.571-1.127-.723-.374-.144-.969-.296-1.954-.34C15.056 3.63 14.717 3.62 12 3.62zm0 3.75a4.63 4.63 0 100 9.26 4.63 4.63 0 000-9.26zm0 1.62a3.01 3.01 0 110 6.02 3.01 3.01 0 010-6.02zM18.428 5.485a1.05 1.05 0 100 2.1 1.05 1.05 0 000-2.1z"/></svg>
          </a>
          <a href="#" className="hover:text-emerald-400 transition-colors duration-200" aria-label="SoundCloud">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2.88 12.63c-1.196-.46-2.146-.66-2.87-.66-.99 0-1.74.5-2.02.9-.31.42-.3.94-.3 1.34s-.04.81.08 1.1c.14.33.4.58.74.74.39.19.86.29 1.41.29.98 0 1.83-.24 2.55-.71.5-.33.9-.76 1.18-1.2.3-.46.33-.92.33-1.27s.02-.79-.08-1.13c-.11-.37-.36-.66-.69-.87zM12 17c-1.18 0-2.17-.3-2.97-.84-.52-.35-.94-.8-1.21-1.32-.28-.53-.3-1.07-.3-1.57s-.04-1.03.08-1.42c.13-.42.39-.77.72-.99.38-.26.83-.4 1.35-.4.99 0 1.85.25 2.57.75.52.36.93.84 1.2 1.39.28.56.31 1.13.31 1.69s.02 1.09-.08 1.48c-.1.39-.35.7-.68.9-.38.23-.83.35-1.35.35zM12 7c-1.18 0-2.17-.3-2.97-.84-.52-.35-.94-.8-1.21-1.32-.28-.53-.3-1.07-.3-1.57s-.04-1.03.08-1.42c.13-.42.39-.77.72-.99.38-.26.83-.4 1.35-.4.99 0 1.85.25 2.57.75.52.36.93.84 1.2 1.39.28.56.31 1.13.31 1.69s.02 1.09-.08 1.48c-.1.39-.35.7-.68.9-.38.23-.83.35-1.35.35z"/></svg>
          </a>
        </div>
      </footer>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-emerald-600 transform scale-95 animate-modal-pop">
            <h4 className="text-2xl font-bold text-emerald-400 mb-4">Information</h4>
            <p className="text-gray-200 mb-6">{modalContent}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-75"
            >
              Close
            </button>
          </div>
          {/* Keyframes for modal animation */}
          <style>{`
            @keyframes modal-pop {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-modal-pop { animation: modal-pop 0.3s ease-out forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
};

// Music Card component (now displaying a pack of tracks)
const MusicCard = ({ pack, onPreview, onBuyNow, currentPlayingAudioUrl }) => {
  return (
    <div className="relative bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-700 hover:border-emerald-500">
      <img
        src={pack.cover}
        alt={`${pack.title} Album Cover`}
        className="w-full h-56 sm:h-64 object-cover rounded-t-xl transition-all duration-300 group-hover:opacity-80"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/4b5563/ffffff?text=Image+Unavailable'; }}
      />
      <div className="p-4 sm:p-6">
        <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">{pack.title}</h4>
        <p className="text-emerald-400 text-sm sm:text-md mb-1">{pack.artist}</p>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">{pack.genre} - {pack.description}</p>

        {/* Individual Track Previews */}
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h5 className="text-lg font-semibold text-gray-200 mb-3">Track Previews:</h5>
          <ul className="space-y-2">
            {pack.tracks.map(track => {
              const isTrackPlaying = currentPlayingAudioUrl === track.audioPreview;
              return (
                <li key={track.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <span className="text-gray-300 text-sm truncate mr-2">{track.title}</span>
                  <button
                    onClick={() => onPreview(track.audioPreview)}
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors duration-200
                      ${isTrackPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {/* Play/Pause Icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      {isTrackPlaying ? (
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.034A1 1 0 008 8v4a1 1 0 001.555.966l3-2a1 1 0 000-1.932l-3-2z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={() => onBuyNow(pack.title)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-5 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-75"
          >
            Buy Pack
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
