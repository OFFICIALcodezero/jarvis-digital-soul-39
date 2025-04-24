
import React from 'react';
import JarvisCore from './core/JarvisCore';
import JarvisAvatar from './JarvisAvatar';
import { useJarvisChat } from '../contexts/JarvisChatProvider';

interface JarvisCentralCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: 'normal' | 'voice' | 'face' | 'hacker';
}

const JarvisCentralCore: React.FC<JarvisCentralCoreProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
  activeMode
}) => {
  const jarvisChat = useJarvisChat();
  
  // Since 'messages' may not exist in the context, let's provide a fallback
  const isGeneratingImage = false; // Simplified fallback
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <div 
        className={`jarvis-core-container 
          ${isSpeaking ? 'animate-pulse' : ''} 
          ${isProcessing ? 'animate-spin-slow' : ''}
          ${isGeneratingImage ? 'animate-glow-strong' : ''}
        `}
      >
        <JarvisCore 
          isSpeaking={isSpeaking} 
          isListening={isListening} 
          isProcessing={isProcessing || isGeneratingImage}
        />
      </div>
      
      {activeMode === 'face' && (
        <div className="mt-4 mb-2">
          <JarvisAvatar 
            activeMode={activeMode}
            isSpeaking={isSpeaking} 
            isListening={isListening}
          />
        </div>
      )}
      
      {/* Removed SystemData component */}
      
      {isSpeaking && (
        <div className="absolute top-2 right-2 bg-jarvis/20 text-jarvis px-2 py-1 rounded-md text-xs border border-jarvis/30 animate-pulse">
          Speaking
        </div>
      )}
      
      {isListening && !isSpeaking && (
        <div className="absolute top-2 right-2 bg-jarvis/20 text-jarvis px-2 py-1 rounded-md text-xs border border-jarvis/30 animate-pulse">
          Listening
        </div>
      )}
      
      {isGeneratingImage && !isSpeaking && !isListening && (
        <div className="absolute top-2 right-2 bg-jarvis/20 text-jarvis px-2 py-1 rounded-md text-xs border border-jarvis/30 animate-pulse">
          Generating Image
        </div>
      )}
    </div>
  );
};

export default JarvisCentralCore;
