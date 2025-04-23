
import { ImageGenerationParams } from "./imageGenerationService";

// Enhanced style & image parameter parsing from prompt/user input.
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
  else if (/sunset|evening|dusk/i.test(input) && /mountain|hill|peak/i.test(input)) {
    // Special handling for sunset over mountains
    params.style = 'realistic';
  }

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
