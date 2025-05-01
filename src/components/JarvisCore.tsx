
import { useEffect } from 'react';
import { getApiKey } from '../utils/apiKeyManager';

// Define and export the JarvisMode type
export type JarvisMode = 'normal' | 'voice' | 'face' | 'hacker';

const JarvisCore = () => {
  useEffect(() => {
    // Initialize the core systems with the API keys
    initializeJarvisCore();
  }, []);

  const initializeJarvisCore = () => {
    try {
      // Get all necessary API keys
      const groqKey = getApiKey('groq');
      const elevenlabsKey = getApiKey('elevenlabs');
      
      console.log("JARVIS Core initialized with API keys");
      
      // Additional initialization code would go here
      
    } catch (error) {
      console.error("Failed to initialize JARVIS Core:", error);
    }
  };

  // This is a UI-less component that handles core functionality
  return null;
};

export default JarvisCore;
