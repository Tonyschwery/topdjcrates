import React from 'react';

// This is the component for the promotional pop-up
const PromoPopup = ({ onClose, title, subtitle, image, purchaseLink, buttonText }) => {
  return (
    // This div creates the fixed position at the bottom right of the screen
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up max-w-sm w-full px-4 sm:px-0">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-gold/40 shadow-[0_10px_50px_rgba(0,0,0,0.8)] rounded-xl p-5 flex items-center gap-4 relative">
        
        {/* Pulsing Crate Badge */}
        <span className="bg-gold text-background font-black text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-full absolute -top-2 left-6 shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-pulse">
          🔥 Best Seller
        </span>

        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute -top-2.5 -right-2.5 bg-zinc-800 hover:bg-gold hover:text-background border border-gold/40 text-gold rounded-full h-7 w-7 flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-300"
          aria-label="Close promotion"
        >
          &times;
        </button>

        {/* Image of the bundle */}
        <a href={purchaseLink} target="_blank" rel="noopener noreferrer" className="shrink-0 group">
          <div className="relative overflow-hidden rounded-lg border border-zinc-700/50 shadow-md transition-all duration-300 group-hover:border-gold/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <img 
              src={image || "https://i.imgur.com/b28OpXj.png"} 
              alt={title || "Promo Crate"} 
              className="w-24 h-24 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
        </a>
        
        {/* Text content and button */}
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="font-black text-primary text-md leading-tight truncate uppercase tracking-wide">
            {title || "The Ultimate DJ Bundle"}
          </h4>
          <p className="text-xs text-gold/90 font-extrabold mb-3 leading-snug mt-1">
            {subtitle || "Save over $200!"}
          </p>
          <a
            href={purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-white text-zinc-950 font-black text-xs py-2.5 px-4 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 text-center uppercase tracking-wider"
          >
            {buttonText || "Get Them All"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;