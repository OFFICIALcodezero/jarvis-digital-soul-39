
// Mock YouTube service for development purposes
// In a production environment, this would use the YouTube API

interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
}

const MOCK_VIDEOS: Record<string, YouTubeSearchResult> = {
  'believer': { 
    id: '7wtfhZwyrcc', 
    title: 'Imagine Dragons - Believer', 
    thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg' 
  },
  'despacito': { 
    id: 'kJQP7kiw5Fk', 
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee', 
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg' 
  },
  'uptown funk': { 
    id: 'OPf0YbXqDm0', 
    title: 'Mark Ronson - Uptown Funk ft. Bruno Mars', 
    thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg' 
  },
  'shape of you': { 
    id: 'JGwWNGJdvx8', 
    title: 'Ed Sheeran - Shape of You', 
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg' 
  },
  'perfect': { 
    id: '2Vv-BfVoq4g', 
    title: 'Ed Sheeran - Perfect', 
    thumbnail: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg' 
  }
};

export const searchYouTube = async (query: string): Promise<YouTubeSearchResult | null> => {
  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact matches in our mock data
  for (const [key, video] of Object.entries(MOCK_VIDEOS)) {
    if (normalizedQuery.includes(key)) {
      return video;
    }
  }
  
  // If no exact match, return a default video based on the first word
  const words = normalizedQuery.split(' ');
  const mockVideos = Object.values(MOCK_VIDEOS);
  
  if (words.length > 0 && mockVideos.length > 0) {
    // Use a hash of the first word to get a consistent but seemingly random video
    const hash = words[0].split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return mockVideos[hash % mockVideos.length];
  }
  
  return null;
};

export const getVideoDetails = async (videoId: string): Promise<YouTubeSearchResult | null> => {
  // In a real implementation, this would fetch video details from the YouTube API
  const foundVideo = Object.values(MOCK_VIDEOS).find(video => video.id === videoId);
  return foundVideo || null;
};
