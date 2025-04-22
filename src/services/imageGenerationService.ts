
import { toast } from '@/components/ui/use-toast';

export interface ImageGenerationParams {
  prompt: string;
  style?: 'realistic' | 'anime' | '3d' | 'abstract' | 'painting';
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

const MOCK_IMAGES: Record<string, string> = {
  'city': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
  'mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  'robot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  'space': 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5',
  'nature': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'sunset': 'https://images.unsplash.com/photo-1616036740257-9449ea1f6605',
  'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  'animal': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
  'portrait': 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
  'food': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'default': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
};

// Helper function to get the best image match from mock data
const getMockImageUrl = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [keyword, url] of Object.entries(MOCK_IMAGES)) {
    if (lowerPrompt.includes(keyword)) {
      return url;
    }
  }
  
  return MOCK_IMAGES.default;
};

/**
 * Function to generate an image based on a text prompt
 * 
 * Note: This version uses mock data. In a real implementation,
 * this would call an AI image generation API like OpenAI's DALL-E,
 * Stability AI's Stable Diffusion, or Midjourney API.
 */
export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  try {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would make an API call to an image generation service
    const imageUrl = getMockImageUrl(params.prompt);
    
    // Return the generated image data
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

/**
 * Parse the user's input to extract image generation parameters
 */
export const parseImageRequest = (input: string): ImageGenerationParams => {
  const prompt = input.replace(/^(create|generate|make|draw)(\s+an|\s+a)?\s+image\s+(of|about|showing)?\s+/i, '');
  
  const params: ImageGenerationParams = {
    prompt
  };
  
  // Check for style keywords
  if (/realistic|photo|photograph/i.test(input)) {
    params.style = 'realistic';
  } else if (/anime|cartoon|animated/i.test(input)) {
    params.style = 'anime';
  } else if (/3d|three.dimensional|render/i.test(input)) {
    params.style = '3d';
  } else if (/abstract|artistic/i.test(input)) {
    params.style = 'abstract';
  } else if (/painting|painted|oil/i.test(input)) {
    params.style = 'painting';
  }
  
  // Check for resolution keywords
  if (/high(\s+)?(resolution|quality)/i.test(input)) {
    params.resolution = '1024x1024';
  }
  
  // Check for aspect ratio keywords
  if (/wide|landscape|panorama/i.test(input)) {
    params.aspectRatio = '16:9';
  } else if (/square/i.test(input)) {
    params.aspectRatio = '1:1';
  }
  
  return params;
};
