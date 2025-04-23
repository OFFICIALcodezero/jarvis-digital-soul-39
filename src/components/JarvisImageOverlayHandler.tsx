
import React from "react";
import ImageOverlay from "./chat/ImageOverlay";
import { useJarvisChatContext } from "./JarvisChatContext";

const JarvisImageOverlayHandler: React.FC = () => {
  const { activeImage, setActiveImage, handleRefineImage, handleImageGenerationFromPrompt } = useJarvisChatContext();

  if (!activeImage) return null;

  return (
    <ImageOverlay
      image={activeImage}
      onClose={() => setActiveImage(null)}
      onRefine={refinement => {
        handleRefineImage(activeImage.prompt, refinement);
        setActiveImage(null);
      }}
      onRegenerate={() => {
        handleImageGenerationFromPrompt(activeImage.prompt, true);
        setActiveImage(null);
      }}
    />
  );
};

export default JarvisImageOverlayHandler;
