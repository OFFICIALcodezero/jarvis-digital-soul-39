
import React, { createContext, useContext, useState, useEffect } from "react";
import { parseImageRequest } from '@/services/imagePromptParser';
import { generateImage, GeneratedImage } from '@/services/imageGenerationService';
import { parseImagePrompt, generateStabilityImage, StabilityImageParams, StabilityGeneratedImage } from '@/services/stabilityAIService';
import { Progress } from "@/components/ui/progress";

// Define the context type
export interface JarvisChatContextType {
  activeImage: GeneratedImage | StabilityGeneratedImage | null;
  setActiveImage: React.Dispatch<React.SetStateAction<GeneratedImage | StabilityGeneratedImage | null>>;
  handleImageGenerationFromPrompt: (prompt: string, isRefine?: boolean) => Promise<GeneratedImage | StabilityGeneratedImage>;
  handleRefineImage: (prevPrompt: string, refinement: string) => Promise<GeneratedImage | StabilityGeneratedImage>;
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
  const [activeImage, setActiveImage] = useState<GeneratedImage | StabilityGeneratedImage | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [preferStabilityAI, setPreferStabilityAI] = useState(true);

  const handleImageGenerationFromPrompt = async (prompt: string, isRefine = false): Promise<GeneratedImage | StabilityGeneratedImage> => {
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

      let generatedImage;
      
      if (preferStabilityAI) {
        // Use Stability AI for higher quality
        const imageParams = parseImagePrompt(prompt);
        generatedImage = await generateStabilityImage(imageParams);
      } else {
        // Fallback to original image generator
        const params = parseImageRequest(prompt);
        generatedImage = await generateImage(params);
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setActiveImage(generatedImage);
      setIsGeneratingImage(false);

      return generatedImage;
    } catch (error) {
      console.error('Error generating image:', error);
      
      // If Stability AI fails, try the fallback
      if (preferStabilityAI) {
        console.log('Stability AI failed, trying fallback image generator');
        setPreferStabilityAI(false);
        return handleImageGenerationFromPrompt(prompt, isRefine);
      }
      
      setIsGeneratingImage(false);
      throw error;
    }
  };

  const handleRefineImage = async (prevPrompt: string, refinement: string): Promise<GeneratedImage | StabilityGeneratedImage> => {
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
