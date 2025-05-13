
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import YouTubePlayer from './YouTubePlayer';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';
import { toast } from '@/components/ui/sonner';

const JarvisModeSwitcher: React.FC = () => {
  const [mode, setMode] = useState<'jarvis' | 'codezero'>('jarvis');
  const location = useLocation();
  const navigate = useNavigate();
  const { videoId, searchAndPlay, closeVideo } = useYouTubeSearch();
  
  useEffect(() => {
    // Check the current route to determine which mode to show
    if (location.pathname.includes('code-zero') || location.pathname.includes('ghost')) {
      setMode('codezero');
    } else {
      setMode('jarvis');
    }
  }, [location.pathname]);

  const handleYouTubeSearch = async (query: string) => {
    if (query.toLowerCase().startsWith('play ')) {
      const searchQuery = query.replace(/^play\s+/i, '').trim();
      
      if (searchQuery) {
        const result = await searchAndPlay(searchQuery);
        
        if (result) {
          toast(`Playing "${result.title}"`, {
            description: "YouTube video loaded",
          });
          return true; // Indicate that we handled this command
        }
      }
    }
    return false; // Not a YouTube command
  };

  const handleModeSwitch = () => {
    const newMode = mode === 'jarvis' ? 'codezero' : 'jarvis';
    setMode(newMode);
    
    // Navigate to the appropriate route
    if (newMode === 'codezero') {
      navigate('/code-zero');
    } else {
      navigate('/jarvis');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {mode === 'jarvis' ? (
        <ChatInterface onYouTubeCommand={handleYouTubeSearch} />
      ) : (
        <div className="flex-1">
          {/* Navigate to JarvisV2Interface instead of rendering it directly */}
          {useEffect(() => { navigate('/code-zero'); }, [])}
        </div>
      )}
      
      {/* YouTube Player */}
      <YouTubePlayer 
        videoId={videoId} 
        onClose={closeVideo}
      />
      
      {/* Mode switcher button (optional) */}
      <button 
        className="fixed bottom-4 right-4 bg-black/60 text-white p-2 rounded-full z-40"
        onClick={handleModeSwitch}
      >
        Switch to {mode === 'jarvis' ? 'CODE ZERO' : 'JARVIS'}
      </button>
    </div>
  );
};

export default JarvisModeSwitcher;
