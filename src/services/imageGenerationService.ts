
// Types
import { toast } from '@/components/ui/use-toast';
import {
  MOCK_IMAGES,
  CREATIVE_COMBOS,
  STYLE_IMAGES,
  getRandomImage,
  getMockImageUrl
} from './imageMockData';

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

export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  try {
    // Simulated loading time
    await new Promise(resolve => setTimeout(resolve, 1400));
    const imageUrl = getMockImageUrl(params.prompt, params.style);

    // Log for debugging
    console.log(`Generating image for prompt: "${params.prompt}" with style: ${params.style || 'default'}`);
    console.log(`Selected image URL: ${imageUrl}`);

    return {
      url: imageUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      style: params.style,
      resolution: params.resolution
    };
  } catch (error) {
    console.error('Error generating image:', error);
    toast({
      title: "Image Generation Failed",
      description: "There was an error generating your image. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
