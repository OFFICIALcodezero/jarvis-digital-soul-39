
import React, { createContext, useContext, useState, useEffect } from "react";
import { parseImageRequest, checkImageMatchesPrompt } from '@/services/imagePromptParser';
import { generateImage, GeneratedImage } from '@/services/imageGenerationService';

// Define the context type
export interface JarvisChatContextType {
  activeImage: GeneratedImage | null;
  setActiveImage: React.Dispatch<React.SetStateAction<GeneratedImage | null>>;
  handleImageGenerationFromPrompt: (prompt: string, isRefine?: boolean) => Promise<void>;
  handleRefineImage: (prevPrompt: string, refinement: string) => Promise<void>;
}

// Create the context
export const JarvisChatContext = createContext<JarvisChatContextType | undefined>(undefined);

// Create a hook to use the context
export const useJarvisChat = (): JarvisChatContextType => {
  const context = useContext(JarvisChatContext);
  if (context === undefined) {
    throw new Error('useJarvisChat must be used within a JarvisChatProvider');
  }
  return context;
};

// Create the provider component
export const JarvisChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);

  const handleImageGenerationFromPrompt = async (prompt: string, isRefine = false) => {
    try {
      const params = parseImageRequest(prompt);
      const img = await generateImage(params);
      
      setActiveImage(img);
      return img;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  const handleRefineImage = async (prevPrompt: string, refinement: string) => {
    const newPrompt = `${prevPrompt}. ${refinement}`;
    return handleImageGenerationFromPrompt(newPrompt, true);
  };

  return (
    <JarvisChatContext.Provider
      value={{
        activeImage,
        setActiveImage,
        handleImageGenerationFromPrompt,
        handleRefineImage
      }}
    >
      {children}
    </JarvisChatContext.Provider>
  );
};

export default JarvisChatProvider;
