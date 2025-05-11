import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import HackerModeWrapper from './chat/HackerModeWrapper';

// This component will detect the current mode and apply our enhanced effects
const JarvisModeSwitcher = () => {
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [effectsContainer, setEffectsContainer] = useState<HTMLElement | null>(null);
  
  // Create a container for our effects
  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'jarvis-effects-container';
    document.body.appendChild(container);
    setEffectsContainer(container);
    
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  // Detect hacker mode by observing DOM changes
  useEffect(() => {
    // Function to check if hacker mode is active
    const checkHackerMode = () => {
      // Look for elements that suggest hacker mode is active
      const hackerModeElements = document.querySelectorAll('.hacker-mode-active, [data-hacker-mode="true"]');
      const terminalElements = document.querySelectorAll('[class*="terminal"], [class*="console"]');
      
      // Check if body has a class indicating hacker mode
      const bodyHasHackerClass = document.body.classList.contains('hacker-mode');
      
      setIsHackerMode(hackerModeElements.length > 0 || terminalElements.length > 0 || bodyHasHackerClass);
    };
    
    // Initial check
    checkHackerMode();
    
    // Set up a mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      checkHackerMode();
    });
    
    // Observe document for changes in class attributes and child list
    observer.observe(document.body, { 
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class']
    });
    
    // Also check periodically
    const interval = setInterval(checkHackerMode, 1000);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
  
  // If effects container is not ready, don't render anything
  if (!effectsContainer) return null;
  
  // Use portal to render our effects overlay
  return createPortal(
    <HackerModeWrapper isHackerMode={isHackerMode} />,
    effectsContainer
  );
};

export default JarvisModeSwitcher;
