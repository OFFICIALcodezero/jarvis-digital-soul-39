
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Image, Loader2 } from 'lucide-react';
import { GeneratedImage, ImageGenerationParams, generateImage } from '@/services/imageGenerationService';

interface ImageGenerationWidgetProps {
  initialPrompt?: string;
  onGenerate?: (image: GeneratedImage) => void;
  onClose?: () => void;
  showControls?: boolean;
}

const ImageGenerationWidget: React.FC<ImageGenerationWidgetProps> = ({
  initialPrompt = '',
  onGenerate,
  onClose,
  showControls = true
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<'realistic' | 'anime' | '3d' | 'abstract' | 'painting'>('realistic');
  const [resolution, setResolution] = useState<'512x512' | '768x768' | '1024x1024'>('512x512');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9'>('1:1');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const params: ImageGenerationParams = {
        prompt: prompt.trim(),
        style,
        resolution,
        aspectRatio
      };
      
      const image = await generateImage(params);
      setGeneratedImage(image);
      
      if (onGenerate) {
        onGenerate(image);
      }
    } catch (error) {
      console.error('Error in image generation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-black/30 border border-jarvis/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-jarvis">
          <Image className="w-5 h-5 mr-2 text-jarvis" />
          JARVIS Image Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generatedImage ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-md mb-4">
              <img 
                src={generatedImage.url} 
                alt={generatedImage.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-300 italic mb-4">"{generatedImage.prompt}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/50 border-jarvis/30 text-white h-24"
            />
            
            {showControls && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-jarvis/70 block mb-1">Style</label>
                  <Select value={style} onValueChange={(value) => setStyle(value as any)}>
                    <SelectTrigger className="bg-black/50 border-jarvis/30 text-white">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-jarvis/30 text-white">
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="anime">Anime/Cartoon</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-jarvis/70 block mb-1">Resolution</label>
                  <Select value={resolution} onValueChange={(value) => setResolution(value as any)}>
                    <SelectTrigger className="bg-black/50 border-jarvis/30 text-white">
                      <SelectValue placeholder="Resolution" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-jarvis/30 text-white">
                      <SelectItem value="512x512">512 x 512</SelectItem>
                      <SelectItem value="768x768">768 x 768</SelectItem>
                      <SelectItem value="1024x1024">1024 x 1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-jarvis/70 block mb-1">Aspect Ratio</label>
                  <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as any)}>
                    <SelectTrigger className="bg-black/50 border-jarvis/30 text-white">
                      <SelectValue placeholder="Aspect Ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-jarvis/30 text-white">
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="4:3">Standard (4:3)</SelectItem>
                      <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {generatedImage ? (
          <>
            <Button 
              variant="outline" 
              className="border-jarvis/30 text-jarvis hover:bg-jarvis/10"
              onClick={() => setGeneratedImage(null)}
            >
              Create New
            </Button>
            <Button 
              className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageGenerationWidget;
