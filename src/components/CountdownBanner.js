import React, { useState, useEffect } from 'react';

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user dismissed the banner in this session
    const isDismissed = sessionStorage.getItem('promo_banner_dismissed');
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    // Initialize target time in localStorage (persists across refreshes)
    let targetTime = localStorage.getItem('promo_countdown_target_48h');
    const now = Date.now();

    if (!targetTime || parseInt(targetTime) < now) {
      // Set to 48 hours from now
      targetTime = (now + 48 * 60 * 60 * 1000).toString();
      localStorage.setItem('promo_countdown_target_48h', targetTime);
    }

    setIsVisible(true);

    const updateTimer = () => {
      const currentTime = Date.now();
      const difference = parseInt(targetTime) - currentTime;

      if (difference <= 0) {
        // Reset countdown to a new 48h cycle to keep perpetual excitement
        const newTarget = (Date.now() + 48 * 60 * 60 * 1000).toString();
        localStorage.setItem('promo_countdown_target_48h', newTarget);
        setTimeLeft({ hours: 48, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer(); // run once immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('promo_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-zinc-950 text-white border-b border-gold/30 py-2 px-4 text-center text-xs md:text-sm relative z-50 flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in-up">
      {/* Sale Highlight Tag */}
      <span className="bg-gold text-zinc-950 font-black text-[9px] md:text-[10px] tracking-widest uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(212,175,55,0.4)]">
        🏷️ Coupon Active
      </span>

      {/* Main Promo Text */}
      <span className="font-extrabold tracking-wide text-gray-200 flex items-center gap-1.5 flex-wrap justify-center">
        USE COUPON CODE <span className="font-mono bg-zinc-900 border border-zinc-800 text-gold px-2.5 py-0.5 rounded font-black tracking-widest text-xs md:text-sm animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.2)]">LMS26</span> AT CHECKOUT FOR <span className="text-gold font-black underline decoration-double">40% OFF</span> ALL ITEMS!
      </span>

      {/* Countdown Timer Wrapper */}
      <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm bg-zinc-900 border border-zinc-800 rounded px-2.5 py-0.5 text-gold shadow-inner">
        <span className="text-gray-400 font-sans text-[10px] uppercase tracking-wider mr-1">Ends In:</span>
        <span className="font-black tracking-widest drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">
          {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>

      {/* Close button */}
      <button 
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
        aria-label="Dismiss banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CountdownBanner;
