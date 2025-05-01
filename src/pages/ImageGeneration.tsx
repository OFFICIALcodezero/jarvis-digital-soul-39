
import React, { useState } from 'react';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import ImageGenerationTool from '@/components/ImageGenerationTool';
import { GeneratedImage } from '@/services/imageGenerationService';
import { StabilityGeneratedImage } from '@/services/stabilityAIService';
import { Image, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImageGeneration: React.FC = () => {
  const { activeImage, setActiveImage, handleImageGenerationFromPrompt } = useJarvisChat();
  const [generatedImages, setGeneratedImages] = useState<Array<GeneratedImage | StabilityGeneratedImage>>([]);

  const handleImageGenerated = (image: GeneratedImage | StabilityGeneratedImage) => {
    setGeneratedImages(prev => [image, ...prev]);
  };

  return (
    <div className="min-h-screen bg-jarvis-bg text-white">
      {/* Upper background gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent z-0"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold neon-purple-text flex items-center">
            <Sparkles className="mr-2 h-6 w-6" />
            JARVIS Image Generation Studio
          </h1>
          <Link to="/interface" className="neon-purple-text hover:text-purple-400 transition-colors">
            Back to Interface
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ImageGenerationTool 
              onImageGenerated={handleImageGenerated}
              stabilityApiEnabled={true}  
            />
          </div>
          
          <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
            <h2 className="text-lg font-semibold neon-purple-text mb-4 flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Recent Generations
            </h2>
            
            {generatedImages.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Your generated images will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {generatedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative rounded-md overflow-hidden border border-[#8B5CF6]/20 cursor-pointer hover:border-[#8B5CF6]/60 transition-all"
                    onClick={() => setActiveImage(img as any)}
                  >
                    <img 
                      src={img.url} 
                      alt={img.prompt}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-xs text-white truncate">{img.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Lower background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#8B5CF6]/10 to-transparent z-0"></div>
    </div>
  );
};

export default ImageGeneration;
