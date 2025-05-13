import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type ModeProps = {
  isFixedPosition?: boolean;
};

const JarvisModeSwitcher: React.FC<ModeProps> = ({ isFixedPosition = true }) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [showSwitcher, setShowSwitcher] = useState<boolean>(false);
  
  // Consistent hook usage - always call all hooks regardless of conditions
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);

  // Effect to handle route changes and update state accordingly
  useEffect(() => {
    const path = location.pathname;
    setCurrentRoute(path);
    
    // Check if we should show the switcher based on the route
    const shouldShowSwitcher = !['/startup', '/', '/features'].includes(path);
    setShowSwitcher(shouldShowSwitcher);
    
    // Check if we are in ghost mode
    const inGhostMode = ['/ghost', '/code-zero'].includes(path);
    setIsGhostMode(inGhostMode);
    
    // Show toast when entering ghost mode
    if (inGhostMode && !isGhostMode) {
      toast({
        title: "CODE ZERO AI Activated",
        description: "Ghost AI system operational. Enhanced stealth capabilities.",
      });
    }
  }, [location, isGhostMode]);

  // If we shouldn't show the switcher, render nothing
  if (!showSwitcher) {
    return null;
  }

  return (
    <div className={`jarvis-mode-switcher ${isFixedPosition ? 'fixed' : 'absolute'} bottom-4 right-4 z-50`}>
      {/* Mode switch buttons would go here */}
    </div>
  );
};

export default JarvisModeSwitcher;
