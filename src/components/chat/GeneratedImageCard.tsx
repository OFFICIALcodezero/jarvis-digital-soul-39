import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image, RefreshCcw, SquarePlus } from "lucide-react";
import { GeneratedImage } from "@/services/imageGenerationService";

interface GeneratedImageCardProps {
  image: GeneratedImage;
  onRegenerate?: () => void;
  onRefine?: (refinePrompt: string) => void;
}

const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({ image, onRegenerate, onRefine }) => {
  const [refinePrompt, setRefinePrompt] = useState("");
  const [showControls, setShowControls] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      className="w-full max-w-sm bg-black/40 border border-jarvis/40 text-white shadow-xl mx-auto my-3 transition-all animate-scale-in"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
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
          AI Generated{image.resolution ? ` • ${image.resolution}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-jarvis/20 text-jarvis hover:bg-jarvis/40 border border-jarvis/30 px-2 py-1 text-xs"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              className="border border-jarvis/20 hover:bg-jarvis/10 px-2 py-1 text-xs"
              onClick={onRegenerate}
              title="Regenerate image"
            >
              <RefreshCcw className="w-3 h-3" />
            </Button>
          )}
          {onRefine && (
            <form
              className="flex items-center gap-1"
              onSubmit={e => {
                e.preventDefault();
                if (refinePrompt.trim()) {
                  onRefine(refinePrompt.trim());
                  setRefinePrompt('');
                }
              }}
            >
              <input
                className="bg-black/60 border border-jarvis/30 rounded px-2 py-1 text-xs text-white w-24"
                placeholder="Refine..."
                value={refinePrompt}
                onChange={e => setRefinePrompt(e.target.value)}
                title="Describe enhancement"
              />
              <Button size="sm" variant="ghost" className="p-1 rounded" type="submit" title="Refine image">
                <SquarePlus className="w-3 h-3" />
              </Button>
            </form>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneratedImageCard;
