import React from 'react';

// This is the component for the promotional pop-up
const PromoPopup = ({ onClose, purchaseLink }) => {
  return (
    // This div creates the fixed position at the bottom right of the screen
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
      <div className="bg-zinc-800 border-2 border-gold shadow-2xl rounded-lg p-5 max-w-sm mx-auto flex items-center gap-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 bg-gold text-background rounded-full h-7 w-7 flex items-center justify-center font-bold text-lg"
          aria-label="Close promotion"
        >
          &times;
        </button>

        {/* Image of the bundle */}
        <a href={purchaseLink} target="_blank" rel="noopener noreferrer">
            <img src="https://i.imgur.com/b28OpXj.png" alt="Bundle Crate" className="w-24 h-24 rounded-md shadow-lg" />
        </a>
        
        {/* Text content and button */}
        <div className="flex flex-col">
          <h4 className="font-extrabold text-primary text-lg">The Ultimate DJ Bundle</h4>
          <p className="text-md text-gold font-bold mb-2">Save over $200!</p>
          <a
            href={purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-background font-bold text-sm py-2 px-4 rounded-md hover:opacity-90 transition-opacity text-center"
          >
            Get Them All
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;