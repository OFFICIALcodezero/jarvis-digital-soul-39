import React from 'react';
import { useLocation } from 'react-router-dom';
import JarvisChatMainEnhanced from './JarvisChatMainEnhanced';
import { JarvisChatProvider } from '../contexts/JarvisChatProvider';

// This component is responsible for enhancing the Jarvis interface
// by replacing the standard chat with our enhanced version that includes
// additional hacker tools
const JarvisModeEnhancer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Check if we're on the main Jarvis interface
  const isJarvisInterface = location.pathname === '/jarvis';

  // If we're on the Jarvis interface, return our enhanced version
  if (isJarvisInterface) {
    return (
      <JarvisChatProvider
        activeMode="normal"
        setIsSpeaking={() => {}}
        isListening={false}
        activeAssistant="jarvis"
        setActiveAssistant={() => {}}
        inputMode="text"
        setInputMode={() => {}}
      >
        <div className="flex flex-col h-full">
          <JarvisChatMainEnhanced />
        </div>
      </JarvisChatProvider>
    );
  }

  // Otherwise, return the children as is
  return <>{children}</>;
};

export default JarvisModeEnhancer;
