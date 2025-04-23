
import React, { useState } from 'react';
import { Sparkles, Download, Loader, Heart, PenLine, Repeat, Image as ImageIcon } from 'lucide-react';
import { generateImage, ImageGenerationParams, GeneratedImage } from '@/services/imageGenerationService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface ImageGenerationToolProps {
  onImageGenerated?: (image: GeneratedImage) => void;
}

const ImageGenerationTool: React.FC<ImageGenerationToolProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'1:1' | '16:9'>('1:1');
  const [imageError, setImageError] = useState(false);

  const styles = [
    { id: 'realistic', label: 'Realistic', icon: '📷' },
    { id: 'anime', label: 'Anime', icon: '🎨' },
    { id: '3d', label: 'Render 3D', icon: '🎮' },
    { id: 'abstract', label: 'Abstract', icon: '🎭' },
    { id: 'painting', label: 'Painting', icon: '🖌️' },
    { id: 'pixel', label: 'Pixel Art', icon: '👾' },
    { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'fantasy', label: 'Fantasy', icon: '🧙' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what image you'd like to generate",
        variant: "destructive"
      });
      return;
    }

    setGeneratingImage(true);
    setGeneratedImage(null);
    setImageError(false);

    try {
      const params: ImageGenerationParams = {
        prompt: prompt.trim(),
        style: selectedStyle as any,
        aspectRatio: selectedFormat
      };

      const image = await generateImage(params);
      setGeneratedImage(image);
      
      if (onImageGenerated) {
        onImageGenerated(image);
      }
      
      toast({
        title: "Image Generated",
        description: "Your image has been created successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = imageError ? 
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : 
      generatedImage.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image Downloaded",
      description: "Your image has been saved to your device.",
      variant: "default"
    });
  };

  const handleRegenerateImage = () => {
    handleGenerate();
  };

  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="flex flex-col gap-4 bg-black/30 border border-jarvis/20 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Sparkles className="w-5 h-5 mr-2 text-jarvis" />
        <h2 className="text-lg font-semibold text-white">JARVIS Image Generator</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        <Textarea
          placeholder="Describe the image you want to generate... (e.g., 'a futuristic city at sunset' or 'a disco-dancing fish in a neon suit')"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="bg-black/50 text-white border-jarvis/30 placeholder-gray-400 min-h-[80px]"
        />
        
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Style:</span>
            <div className="flex flex-wrap gap-1">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    selectedStyle === style.id 
                      ? 'bg-jarvis/40 text-white border border-jarvis/50' 
                      : 'bg-black/40 text-gray-300 border border-jarvis/20 hover:bg-jarvis/20'
                  }`}
                  title={style.label}
                >
                  <span>{style.icon} {style.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-300">Format:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedFormat('1:1')}
              className={`p-1 rounded transition flex items-center ${
                selectedFormat === '1:1' 
                  ? 'bg-jarvis/40 text-white' 
                  : 'bg-black/40 text-gray-300 hover:bg-jarvis/20'
              }`}
              title="Square (1:1)"
            >
              <div className="w-6 h-6 flex items-center justify-center border border-current">
                <span className="text-xs">1:1</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedFormat('16:9')}
              className={`p-1 rounded transition flex items-center ${
                selectedFormat === '16:9' 
                  ? 'bg-jarvis/40 text-white' 
                  : 'bg-black/40 text-gray-300 hover:bg-jarvis/20'
              }`}
              title="Widescreen (16:9)"
            >
              <div className="w-8 h-6 flex items-center justify-center border border-current">
                <span className="text-xs">16:9</span>
              </div>
            </button>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate}
          className="bg-jarvis/30 hover:bg-jarvis/50 text-white border border-jarvis/40"
          disabled={generatingImage || !prompt.trim()}
        >
          {generatingImage ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>

      {(generatingImage || generatedImage) && (
        <div className="mt-4">
          <div className={`relative rounded-lg overflow-hidden border border-jarvis/30 ${
            selectedFormat === '16:9' ? 'aspect-video' : 'aspect-square'
          }`}>
            {generatingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <div className="animate-pulse mb-3">
                  <Sparkles className="w-12 h-12 text-jarvis animate-spin-slow" />
                </div>
                <div className="text-jarvis text-sm">Generating your masterpiece...</div>
                <div className="mt-2 flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-jarvis/60 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-jarvis/60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-jarvis/60 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            ) : generatedImage && (
              <>
                <img 
                  src={imageError ? fallbackImage : generatedImage.url} 
                  alt={generatedImage.prompt}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={() => setImageError(true)}
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-jarvis mr-1 cursor-pointer hover:text-red-400 transition-colors" />
                      <PenLine className="w-4 h-4 text-jarvis mx-1 cursor-pointer hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-black/50 hover:bg-black/80 border-jarvis/30 text-xs px-2 py-1 h-auto"
                        onClick={handleRegenerateImage}
                      >
                        <Repeat className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-black/50 hover:bg-black/80 border-jarvis/30 text-xs px-2 py-1 h-auto"
                        onClick={handleDownload}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                {selectedStyle && (
                  <div className="absolute top-2 right-2 bg-black/70 text-jarvis text-xs px-2 py-1 rounded-full">
                    {styles.find(s => s.id === selectedStyle)?.label || 'Custom'}
                  </div>
                )}
              </>
            )}
          </div>
          {generatedImage && (
            <div className="mt-2 text-xs text-gray-400 italic">
              "{generatedImage.prompt}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerationTool;
