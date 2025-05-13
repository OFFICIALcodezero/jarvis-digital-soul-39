
import { useState } from 'react';
import { searchYouTube } from '@/services/youtubeService';
import { toast } from '@/components/ui/sonner';

export const useYouTubeSearch = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchAndPlay = async (query: string) => {
    if (!query) return null;
    
    setIsSearching(true);
    
    try {
      const result = await searchYouTube(query);
      
      if (result) {
        setVideoId(result.id);
        return result;
      } else {
        toast("No video found", {
          description: `Couldn't find a video for "${query}"`,
        });
        return null;
      }
    } catch (error) {
      console.error("Error searching YouTube:", error);
      toast("Search error", {
        description: "There was a problem searching for videos",
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const closeVideo = () => {
    setVideoId(null);
  };

  return {
    videoId,
    setVideoId,
    isSearching,
    searchAndPlay,
    closeVideo
  };
};
