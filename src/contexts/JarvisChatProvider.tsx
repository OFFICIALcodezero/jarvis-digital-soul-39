
import React, { createContext, useContext, useState, useEffect } from "react";
import { parseImageRequest } from '@/services/imagePromptParser';
import { generateImage, GeneratedImage } from '@/services/imageGenerationService';
import { parseImagePrompt, generateStabilityImage, StabilityImageParams, StabilityGeneratedImage } from '@/services/stabilityAIService';
import { toast } from '@/components/ui/use-toast';
import { Message, MessageSuggestion } from '@/types/chat';

// Define the context type
export interface JarvisChatContextType {
  activeImage: GeneratedImage | StabilityGeneratedImage | null;
  setActiveImage: React.Dispatch<React.SetStateAction<GeneratedImage | StabilityGeneratedImage | null>>;
  handleImageGenerationFromPrompt: (prompt: string, isRefine?: boolean) => Promise<GeneratedImage | StabilityGeneratedImage>;
  handleRefineImage: (prevPrompt: string, refinement: string) => Promise<GeneratedImage | StabilityGeneratedImage>;
  messages?: Message[];
  sendMessage?: (content: string, suggestions?: MessageSuggestion[]) => Promise<void>;
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
  const [stabilityAIFailed, setStabilityAIFailed] = useState(false);

  useEffect(() => {
    // Reset stability failed state when component mounts or when switching preferences
    setStabilityAIFailed(false);
  }, [preferStabilityAI]);

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
      
      if (preferStabilityAI && !stabilityAIFailed) {
        try {
          // Use Stability AI for higher quality
          const imageParams = parseImagePrompt(prompt);
          generatedImage = await generateStabilityImage(imageParams);
          
          // Check if we got a fallback image (indicates Stability AI failed)
          if (generatedImage.style === "fallback") {
            setStabilityAIFailed(true);
            throw new Error("Stability AI returned a fallback image, trying alternative generator");
          }
        } catch (error) {
          console.error('Stability AI generation error:', error);
          setStabilityAIFailed(true);
          throw error; // Re-throw to trigger fallback
        }
      } else {
        // Use original image generator (either by preference or as fallback)
        const params = parseImageRequest(prompt);
        generatedImage = await generateImage(params);
        
        if (stabilityAIFailed && !isRefine) {
          // Show notification about fallback only on first attempt, not on refinements
          toast({
            title: "Using Fallback Image Generator",
            description: "Stability AI service is unavailable. Using alternative image generation.",
            variant: "default"
          });
        }
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setActiveImage(generatedImage);
      setIsGeneratingImage(false);

      return generatedImage;
    } catch (error) {
      console.error('Error generating image:', error);
      
      // If Stability AI fails, try the fallback
      if (preferStabilityAI && !stabilityAIFailed) {
        console.log('Stability AI failed, trying fallback image generator');
        setStabilityAIFailed(true);
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
