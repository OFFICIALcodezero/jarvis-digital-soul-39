
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { GeneratedImage } from "@/services/imageGenerationService";

interface GeneratedImageCardProps {
  image: GeneratedImage;
}

const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({ image }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-sm bg-black/40 border border-jarvis/40 text-white shadow-xl mx-auto my-3">
      <CardContent className="flex flex-col items-center pt-5">
        <div className="relative w-full h-56 overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-full object-cover rounded-lg border border-jarvis/20"
            loading="lazy"
          />
        </div>
        <p className="text-xs text-jarvis/80 italic mt-4 mb-2 px-2 text-center">
          "{image.prompt}"
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <span className="text-[11px] text-jarvis/60">
          AI Generated • {image.resolution}
        </span>
        <Button
          size="sm"
          className="bg-jarvis/20 text-jarvis hover:bg-jarvis/40 border border-jarvis/30 px-2 py-1 text-xs"
          onClick={handleDownload}
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneratedImageCard;
