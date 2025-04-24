
import React, { createContext, useContext, useState, useEffect } from "react";
import { parseImageRequest } from '@/services/imagePromptParser';
import { generateImage, GeneratedImage } from '@/services/imageGenerationService';
import { Progress } from "@/components/ui/progress";

// Define the context type
export interface JarvisChatContextType {
  activeImage: GeneratedImage | null;
  setActiveImage: React.Dispatch<React.SetStateAction<GeneratedImage | null>>;
  handleImageGenerationFromPrompt: (prompt: string, isRefine?: boolean) => Promise<GeneratedImage>;
  handleRefineImage: (prevPrompt: string, refinement: string) => Promise<GeneratedImage>;
  messages?: any[];
  isGeneratingImage: boolean;
  generationProgress: number;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleImageGenerationFromPrompt = async (prompt: string, isRefine = false): Promise<GeneratedImage> => {
    try {
      setIsGeneratingImage(true);
      setGenerationProgress(0);

      // Simulate progress steps
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 500);

      const params = parseImageRequest(prompt);
      const img = await generateImage(params);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setActiveImage(img);
      setIsGeneratingImage(false);

      return img;
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGeneratingImage(false);
      throw error;
    }
  };

  const handleRefineImage = async (prevPrompt: string, refinement: string): Promise<GeneratedImage> => {
    const newPrompt = `${prevPrompt}. ${refinement}`;
    return await handleImageGenerationFromPrompt(newPrompt, true);
  };

  return (
    <JarvisChatContext.Provider
      value={{
        activeImage,
        setActiveImage,
        handleImageGenerationFromPrompt,
        handleRefineImage,
        isGeneratingImage,
        generationProgress
      }}
    >
      {children}
    </JarvisChatContext.Provider>
  );
};

export default JarvisChatProvider;
