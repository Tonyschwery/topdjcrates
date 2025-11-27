import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/solid';

const FeaturedIntro = ({ pack }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically hide the intro after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!pack) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {/* Main Card Container */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8 
            }}
            className="relative bg-gradient-to-br from-zinc-900 to-black border-2 border-gold rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.3)] max-w-md w-full overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center p-8">
              
              {/* Animated Glow Effect behind image */}
              <div className="relative mb-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-yellow-500 to-gold opacity-30 blur-xl scale-110"
                />
                <motion.img 
                  src={pack.cover} 
                  alt={pack.title}
                  className="relative w-48 h-48 rounded-lg shadow-2xl object-cover border border-zinc-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-2"
              >
                {pack.title}
              </motion.h2>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-6 text-sm"
              >
                The countdown begins now. Get ready for 2026.
              </motion.p>

              <Link href={`/music?crate=${pack.id}`} legacyBehavior>
                <motion.a 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg cursor-pointer transform transition-all"
                  onClick={() => setIsVisible(false)}
                >
                  Get Access Now
                </motion.a>
              </Link>
            </div>
            
            {/* Progress Bar for Timer */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-gold absolute bottom-0 left-0"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeaturedIntro;