import React from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const MusicCard = ({ pack, onPreview, currentPlayingAudioUrl, currentTrackProgress, currentTrackDuration, onSeek }) => {
  const isPlaying = (audioUrl) => currentPlayingAudioUrl === audioUrl;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const percentage = (clickPosition / progressBar.offsetWidth) * 100;
    onSeek(percentage);
  };

  const handleGetCrateClick = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: pack.title,
        content_ids: [pack.id],
        content_type: 'product',
        value: pack.discountedPrice,
        currency: 'USD'
      });
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg p-4 flex flex-col justify-between h-full group">
      <div>
        <div className="relative">
          <img src={pack.cover} alt={pack.title} className="w-full aspect-square object-cover rounded-md mb-4" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-text">{pack.title}</h3>
        <p className="text-gray-400 mb-4 text-sm">{pack.description}</p>
      </div>

      {pack.tracks && pack.tracks.length > 0 && (
        <div className="flex-grow">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Tracks:</h4>
          <div className="space-y-2">
            {pack.tracks.map((track) => (
              <div key={track.audioPreview}> {/* CORRECTED THIS LINE */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreview(track.audioPreview)} // CORRECTED THIS LINE
                      className="text-primary hover:text-gold transition-colors duration-200"
                    >
                      {isPlaying(track.audioPreview) ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                    <span className="text-xs text-gray-300">{track.title}</span>
                  </div>
                </div>
                {isPlaying(track.audioPreview) && ( // CORRECTED THIS LINE
                    <div className="mt-1">
                      <div
                        className="bg-gray-700 rounded-full h-1 cursor-pointer"
                        onClick={handleProgressBarClick}
                      >
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${currentTrackProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(currentTrackDuration * (currentTrackProgress / 100))} / {formatTime(currentTrackDuration)}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mt-6">
        {pack.originalPrice && pack.discountedPrice && (
          <div className="flex items-baseline gap-2">
            <span className="text-md text-gray-500 line-through">
              ${pack.originalPrice.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-gold">
              ${pack.discountedPrice.toFixed(2)}
            </span>
          </div>
        )}

        <a
          href={pack.gumroadLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGetCrateClick}
          className="bg-primary text-background font-bold py-2 px-4 rounded-md text-center hover:opacity-90 transition-opacity duration-200"
        >
          Get Crate
        </a>
      </div>
      
      {pack.demoLink && (
        <a
          href={pack.demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 bg-zinc-800 text-text font-bold py-2 px-4 rounded-md text-center hover:bg-zinc-700 transition-colors duration-200"
        >
          Free Demo
        </a>
      )}
    </div>
  );
};

export default MusicCard;