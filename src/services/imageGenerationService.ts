
// Types
import { toast } from '@/components/ui/use-toast';
import {
  MOCK_IMAGES,
  CREATIVE_COMBOS,
  STYLE_IMAGES,
  getRandomImage,
  getMockImageUrl
} from './imageMockData';
import { parseImageRequest } from './imagePromptParser';
import { checkImageMatchesPrompt } from './imagePromptChecker';

export interface ImageGenerationParams {
  prompt: string;
  style?: 'realistic' | 'anime' | '3d' | 'abstract' | 'painting' | 'pixel' | 'sci-fi' | 'fantasy';
  resolution?: '512x512' | '768x768' | '1024x1024';
  aspectRatio?: '1:1' | '4:3' | '16:9';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  style?: string;
  resolution?: string;
}

// Re-export necessary functions for backward compatibility
export { parseImageRequest, checkImageMatchesPrompt };

export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  try {
    // Simulated loading time
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    // Get mock image URL
    const imageUrl = getMockImageUrl(params.prompt, params.style);

    // Log for debugging
    console.log(`Generating image for prompt: "${params.prompt}" with style: ${params.style || 'default'}`);
    console.log(`Selected image URL: ${imageUrl}`);

    // Preload the image to ensure it works
    await preloadImage(imageUrl);

    return {
      url: imageUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      style: params.style,
      resolution: params.resolution
    };
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Fallback to a reliable default image on error
    const fallbackUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    
    toast({
      title: "Image Generation Notice",
      description: "Using fallback image. Original request may have had issues.",
      variant: "default"
    });
    
    return {
      url: fallbackUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      style: params.style,
      resolution: params.resolution
    };
  }
};

// Helper function to preload images and ensure they are valid
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      reject(new Error(`Failed to load image: ${url}`));
    };
  });
};
