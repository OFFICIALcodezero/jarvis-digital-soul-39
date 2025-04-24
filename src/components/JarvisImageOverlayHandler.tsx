
import React from "react";
import ImageOverlay from "./chat/ImageOverlay";
import { useJarvisChat } from "../contexts/JarvisChatProvider";

const JarvisImageOverlayHandler: React.FC = () => {
  const { activeImage, setActiveImage } = useJarvisChat();

  if (!activeImage) return null;

  const handleRefineImage = (refinement: string) => {
    // Simplified for now
    setActiveImage(null);
  };

  const handleRegenerate = () => {
    // Simplified for now
    setActiveImage(null);
  };

  return (
    <ImageOverlay
      image={activeImage}
      onClose={() => setActiveImage(null)}
      onRefine={handleRefineImage}
      onRegenerate={handleRegenerate}
    />
  );
};

export default JarvisImageOverlayHandler;
