import React from 'react';

// This is the component for the social proof pop-up
const SocialProofPopup = ({ notification, onClose }) => {
  if (!notification) return null;

  const { name, location, crate } = notification;

  return (
    // Fixed position at the bottom-left of the screen
    <div className="fixed bottom-5 left-5 z-50 animate-fade-in-up">
      <div className="bg-zinc-800 border border-zinc-700 shadow-2xl rounded-lg p-4 max-w-sm mx-auto flex items-center gap-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute -top-2 -right-2 bg-zinc-600 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs"
          aria-label="Close notification"
        >
          &times;
        </button>

        {/* Crate Image */}
        <img src={crate.cover} alt={crate.title} className="w-16 h-16 rounded-md shadow-md" />
        
        {/* Text content */}
        <div>
          <p className="font-bold text-primary text-sm">{name} in {location}</p>
          <p className="text-xs text-gray-300">just purchased</p>
          <p className="text-sm text-gold font-semibold truncate">{crate.title}</p>
        </div>
      </div>
    </div>
  );
};

export default SocialProofPopup;