
import { toast } from '@/components/ui/use-toast';

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

// Expanded mock image database with more specific object categories
const MOCK_IMAGES: Record<string, string> = {
  // Animals
  'dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
  'bird': 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f',
  'wolf': 'https://images.unsplash.com/photo-1564466809058-bf4114d55352',
  'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
  'tiger': 'https://images.unsplash.com/photo-1549366021-9f761d450615',
  'bear': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d',
  
  // People & Activities
  'person': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'astronaut': 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031',
  'scientist': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
  'athlete': 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  
  // Vehicles
  'car': 'https://images.unsplash.com/photo-1542362567-b07e54358753',
  'truck': 'https://images.unsplash.com/photo-1616711906333-23e9279b509c',
  'motorcycle': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
  'bicycle': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
  'spacecraft': 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2',
  'ship': 'https://images.unsplash.com/photo-1508953633818-212e7d14a1a4',
  
  // Nature
  'mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  'forest': 'https://images.unsplash.com/photo-1448375240586-882707db888b',
  'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  'ocean': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
  'desert': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
  'sunset': 'https://images.unsplash.com/photo-1616036740257-9449ea1f6605',
  'waterfall': 'https://images.unsplash.com/photo-1558289675-a39e416d3827',
  'lake': 'https://images.unsplash.com/photo-1500829243541-74b677fecc30',
  
  // Urban
  'city': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
  'building': 'https://images.unsplash.com/photo-1486325212027-8081e485255e',
  'street': 'https://images.unsplash.com/photo-1557531365-e8b22d93dbd0',
  'bridge': 'https://images.unsplash.com/photo-1526458170104-7e546a843a8a',
  
  // Technology
  'robot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  'computer': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
  'smartphone': 'https://images.unsplash.com/photo-1592750475507-f85ef3c41a47',
  
  // Space
  'space': 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5',
  'galaxy': 'https://images.unsplash.com/photo-1506703719100-a0b3a51e1278',
  'planet': 'https://images.unsplash.com/photo-1614314169000-4ba70ab510aa',
  'stars': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
  
  // Food
  'food': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'fruit': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
  
  // Generic categories
  'nature': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'animal': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
  'portrait': 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
  'landscape': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'abstract': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
  'default': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
};

// Breed-specific dog images
const DOG_BREEDS: Record<string, string> = {
  'golden retriever': 'https://images.unsplash.com/photo-1608096299210-db7e38487075',
  'labrador': 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab7',
  'german shepherd': 'https://images.unsplash.com/photo-1612130772748-829076694f58',
  'husky': 'https://images.unsplash.com/photo-1521717804554-86655ca00f2d',
  'poodle': 'https://images.unsplash.com/photo-1561565496-ce93e980202a',
  'bulldog': 'https://images.unsplash.com/photo-1523567353450-084a52e5fb21',
  'beagle': 'https://images.unsplash.com/photo-1529927066849-79b791a69825'
};

// Car models and types
const CAR_TYPES: Record<string, string> = {
  'sports car': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
  'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
  'sedan': 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca',
  'truck': 'https://images.unsplash.com/photo-1616711906333-23e9279b509c',
  'electric': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
  'vintage': 'https://images.unsplash.com/photo-1567626143565-a48250161a7c',
  'futuristic': 'https://images.unsplash.com/photo-1592819695396-064b9572a660'
};

const getMockImageUrl = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  // First check for specific dog breeds
  for (const [breed, url] of Object.entries(DOG_BREEDS)) {
    if (lowerPrompt.includes(breed)) {
      return url;
    }
  }
  
  // Then check for specific car types
  for (const [carType, url] of Object.entries(CAR_TYPES)) {
    if (lowerPrompt.includes(carType)) {
      return url;
    }
  }
  
  // Style-specific checks
  if (lowerPrompt.includes('pixel') || lowerPrompt.includes('pixel art')) 
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
  if (lowerPrompt.includes('sci-fi') || lowerPrompt.includes('science fiction')) 
    return 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564';
  if (lowerPrompt.includes('fantasy') || lowerPrompt.includes('magical')) 
    return 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e';
  if (lowerPrompt.includes('anime') || lowerPrompt.includes('cartoon')) 
    return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f';
  if (lowerPrompt.includes('painting') || lowerPrompt.includes('oil painting')) 
    return 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5';
  if (lowerPrompt.includes('3d') || lowerPrompt.includes('render')) 
    return 'https://images.unsplash.com/photo-1622737133809-d95047b9e673';
    
  // Attempt to find content-specific images
  // First split the prompt into words and check each significant word
  const words = lowerPrompt.split(/\s+/);
  
  // Check for direct object matches first (prioritize specific objects)
  for (const word of words) {
    // Skip common words, articles, prepositions
    if (['a', 'an', 'the', 'of', 'in', 'on', 'with', 'and', 'or', 'generate', 'create', 'make', 'image', 'picture'].includes(word)) {
      continue;
    }
    
    if (MOCK_IMAGES[word]) {
      return MOCK_IMAGES[word];
    }
  }
  
  // Then check for partial matches in the complete prompt
  for (const [keyword, url] of Object.entries(MOCK_IMAGES)) {
    if (lowerPrompt.includes(keyword)) {
      return url;
    }
  }
  
  // If we reach here, no specific match was found
  console.log('No specific match found for prompt: ', prompt);
  return MOCK_IMAGES.default;
};

export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  try {
    // Simulated loading time
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const imageUrl = getMockImageUrl(params.prompt);
    
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

export const parseImageRequest = (input: string): ImageGenerationParams => {
  const promptRegex = /^(?:create|generate|make|draw|show|paint|illustrate)(?:\s+an|\s+a)?(?:\s+image|picture)?(?:\s+of|about|showing)?\s+(.+)$/i;
  const match = input.match(promptRegex);
  
  // Extract the core prompt, removing command words
  const prompt = match ? match[1] : input.replace(/^(create|generate|make|draw|show|paint|illustrate)(\s+an|\s+a)?\s*(image|picture)?\s*(of|about|showing)?\s*/i, '');
  
  const params: ImageGenerationParams = {
    prompt
  };
  
  // Enhanced style detection
  if (/realistic|photo|photograph|real/i.test(input)) params.style = 'realistic';
  else if (/anime|cartoon|animated|manga/i.test(input)) params.style = 'anime';
  else if (/3d|three.dimensional|render|blender/i.test(input)) params.style = '3d';
  else if (/abstract|artistic|modern art/i.test(input)) params.style = 'abstract';
  else if (/painting|painted|oil|acrylic|watercolor/i.test(input)) params.style = 'painting';
  else if (/pixel|pixel art|pixelated|retro game/i.test(input)) params.style = 'pixel';
  else if (/sci[\s\-]?fi|science fiction|futuristic/i.test(input)) params.style = 'sci-fi';
  else if (/fantasy|mythical|magical|dragon|elf|wizard/i.test(input)) params.style = 'fantasy';

  // Check for resolution keywords
  if (/high(\s+)?(resolution|quality)|detailed|crisp/i.test(input)) params.resolution = '1024x1024';
  else if (/medium(\s+)?(resolution|quality)/i.test(input)) params.resolution = '768x768';
  else if (/low(\s+)?(resolution|quality)|small/i.test(input)) params.resolution = '512x512';

  // Check for aspect ratio keywords
  if (/wide|landscape|panorama|cinematic/i.test(input)) params.aspectRatio = '16:9';
  else if (/square/i.test(input)) params.aspectRatio = '1:1';
  else if (/portrait|vertical|tall/i.test(input)) params.aspectRatio = '4:3';

  console.log("Parsed image parameters:", params);
  return params;
};

// Add a function to check if an image generation failed to match the prompt
export const checkImageMatchesPrompt = (image: GeneratedImage): boolean => {
  // In a real implementation, this would use AI to check if the image matches the prompt
  // For this mock implementation, we'll simulate checking based on the URL
  
  // If the image URL is the default/abstract one, assume it didn't match well
  return image.url !== MOCK_IMAGES.default && image.url !== MOCK_IMAGES.abstract;
};

