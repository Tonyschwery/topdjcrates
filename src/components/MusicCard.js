import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid';

const MusicCard = ({ pack, onPreview, currentPlayingAudioUrl, currentTrackProgress, currentTrackDuration, onSeek }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);
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

  // Generate shareable URL
  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/music?crate=${pack.id}`;
  };

  // Generate share text
  const getShareText = () => {
    return `Check out ${pack.title} - ${pack.description}`;
  };

  // Handle share with Web Share API or fallback
  const handleShare = async (platform = null) => {
    const shareUrl = getShareUrl();
    const shareText = getShareText();
    const shareTitle = pack.title;

    // If specific platform is requested, use that
    if (platform) {
      shareToPlatform(platform, shareUrl, shareText, shareTitle);
      setShowShareMenu(false);
      return;
    }

    // Try Web Share API first (mobile)
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        // Track share event
        if (window.fbq) {
          window.fbq('track', 'Share', {
            content_name: pack.title,
            content_ids: [pack.id],
            content_type: 'product',
          });
        }
        setShowShareMenu(false);
        return;
      } catch (error) {
        // User cancelled or error occurred, fall through to menu
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }

    // Fallback: show share menu
    setShowShareMenu(true);
  };

  // Share to specific platform
  const shareToPlatform = (platform, url, text, title) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(title);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            // Show feedback (you could add a toast notification here)
            alert('Link copied to clipboard!');
          });
          return;
        }
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Track share event
      if (window.fbq) {
        window.fbq('track', 'Share', {
          content_name: pack.title,
          content_ids: [pack.id],
          content_type: 'product',
          method: platform,
        });
      }
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg p-4 flex flex-col justify-between h-full group relative">
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

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => handleShare()}
              className="bg-zinc-800 text-text font-bold py-2 px-3 rounded-md hover:bg-zinc-700 transition-colors duration-200 flex items-center gap-2"
              aria-label="Share this crate"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Share Menu Dropdown */}
            {showShareMenu && (
              <div 
                ref={shareMenuRef}
                className="absolute bottom-full left-0 mb-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50"
              >
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2 px-2 py-1">
                    <span className="text-sm font-semibold text-text">Share to</span>
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Close share menu"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      📘 Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      🐦 Twitter/X
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      💬 WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      💼 LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      ✉️ Email
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      📋 Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href={pack.gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGetCrateClick}
            className="bg-primary text-background font-bold py-2 px-4 rounded-md text-center hover:opacity-90 transition-opacity duration-200"
          >
            {pack.buttonText || 'Get Crate'}
          </a>
        </div>
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