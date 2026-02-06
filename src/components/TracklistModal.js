import React, { useRef, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const TracklistModal = ({ url, onClose, title }) => {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to inject protection scripts into the iframe
    const protectContent = () => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;

        try {
            const doc = iframe.contentWindow.document;

            // 1. Inject CSS to disable selection
            const style = doc.createElement('style');
            style.innerHTML = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        body {
          cursor: default;
          background-color: transparent; 
          color: #fff; /* Ensure text is visible if they didn't style it */
        }
        /* Custom scrollbar to match site theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;
            doc.head.appendChild(style);

            // 2. Disable Context Menu (Right Click)
            doc.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });

            // 3. Disable Dragging
            doc.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });

            // 4. Disable Copy/Cut Keyboards
            doc.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    return false;
                }
                // Disable F12 / Inspect (Basic deterrent)
                if (e.key === 'F12') {
                    e.preventDefault();
                }
            });

            setIsLoading(false);

        } catch (err) {
            console.warn('Could not inject security scripts (likely due to cross-origin restriction if testing externally):', err);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative animate-scaleIn">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 z-10">
                    <h3 className="text-xl font-bold text-white truncate pr-4">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow relative bg-zinc-950">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    )}
                    <iframe
                        ref={iframeRef}
                        src={url}
                        className="w-full h-full border-0"
                        onLoad={protectContent}
                        title={`Tracklist for ${title}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TracklistModal;
