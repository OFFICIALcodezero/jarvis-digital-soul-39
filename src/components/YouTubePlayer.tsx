
import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string | null;
  onClose: () => void;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  onClose,
  className
}) => {
  if (!videoId) return null;

  return (
    <div className={cn("fixed inset-0 bg-black/80 flex items-center justify-center z-50", className)}>
      <div className="relative max-w-3xl w-full p-2">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-2 text-white hover:text-red-500 z-10 p-2 rounded-full bg-black/40"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <YouTube 
            videoId={videoId} 
            className="w-full h-full"
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
