
import { GeneratedImage } from "./imageGenerationService";
import { STYLE_IMAGES, MOCK_IMAGES } from "./imageMockData";

export { GeneratedImage };

export const checkImageMatchesPrompt = (image: GeneratedImage): boolean => {
  // In a real implementation, this would use AI to check if the image matches the prompt
  // For this mock implementation, we'll simulate checking based on the URL
  
  // If the image URL is from the abstract collection, assume it didn't match well
  const isAbstractImage = STYLE_IMAGES['abstract'].some(url => image.url === url);
  const isRandomDefault = image.url === MOCK_IMAGES.default;
  
  return !isAbstractImage && !isRandomDefault;
};
