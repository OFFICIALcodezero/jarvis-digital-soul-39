
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { GeneratedImage, checkImageMatchesPrompt } from "@/services/imageGenerationService";

interface ImageOverlayProps {
  image: GeneratedImage;
  onClose: () => void;
  onRefine: (newPrompt: string) => void;
  onRegenerate: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ image, onClose, onRefine, onRegenerate }) => {
  const [refinePrompt, setRefinePrompt] = useState('');
  const matchesPrompt = checkImageMatchesPrompt(image);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in transition-all">
      <div className="bg-black/90 rounded-xl shadow-2xl border-2 border-jarvis/40 overflow-hidden p-6 w-[90vw] max-w-2xl">
        <div className="flex flex-col items-center">
          <img
            src={image.url}
            alt={image.prompt}
            className="max-h-[60vh] rounded-lg mb-4 shadow-lg animate-scale-in"
            style={{ objectFit: 'cover' }}
          />
          <div className="text-center mb-3 text-lg text-jarvis font-bold animate-fade-in">
            "{image.prompt}"
          </div>
          {!matchesPrompt && (
            <div className="text-yellow-400 text-sm mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              This might not match your request exactly.
            </div>
          )}
          <div className="flex flex-row gap-2 justify-center">
            <button onClick={onRegenerate} className="bg-jarvis/20 px-4 py-2 rounded text-jarvis font-bold hover:bg-jarvis/30 transition animate-fade-in flex items-center">
              Regenerate
            </button>
            <form
              className="flex gap-2 items-center"
              onSubmit={e => {
                e.preventDefault();
                if (refinePrompt.trim()) {
                  onRefine(refinePrompt.trim());
                }
              }}
            >
              <input
                className="bg-black/60 border border-jarvis/30 rounded px-3 py-1 text-white outline-none"
                type="text"
                value={refinePrompt}
                placeholder="Refine (e.g. add neon lights)"
                onChange={e => setRefinePrompt(e.target.value)}
              />
              <button type="submit" className="bg-jarvis/20 px-3 py-1 rounded text-jarvis font-semibold hover:bg-jarvis/40 transition">
                Refine
              </button>
            </form>
            <button onClick={onClose} className="ml-2 px-2 text-gray-200 hover:text-jarvis">
              Close
            </button>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href={image.url}
              download={`jarvis-image-${Date.now()}.jpg`}
              className="text-sm text-jarvis underline hover:text-jarvis/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
