
import type { GeneratedImage } from "./imageGenerationService";

// We're not re-exporting GeneratedImage anymore to avoid circular dependencies
// export type { GeneratedImage };

export const checkImageMatchesPrompt = (image: GeneratedImage): boolean => {
  // In a real implementation, this would use AI to check if the image matches the prompt
  // For this mock implementation, we'll simulate checking based on the URL
  
  // If the image URL is from the abstract collection, assume it didn't match well
  const STYLE_IMAGES = {
    'abstract': [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1',
      'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43'
    ]
  };
  
  const MOCK_IMAGES = {
    'default': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
  };
  
  const isAbstractImage = STYLE_IMAGES['abstract'].some(url => image.url === url);
  const isRandomDefault = image.url === MOCK_IMAGES.default;
  
  return !isAbstractImage && !isRandomDefault;
};
