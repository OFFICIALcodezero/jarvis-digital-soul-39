
import React from 'react';
import JarvisCore from './core/JarvisCore';
import JarvisAvatar from './JarvisAvatar';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import { Progress } from '@/components/ui/progress';

interface JarvisCentralCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite';
}

const JarvisCentralCore: React.FC<JarvisCentralCoreProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
  activeMode
}) => {
  const { isGeneratingImage, generationProgress } = useJarvisChat();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <div 
        className={`jarvis-core-container 
          ${isSpeaking ? 'animate-pulse' : ''} 
          ${isProcessing ? 'animate-spin-slow' : ''}
          ${isGeneratingImage ? 'animate-glow-strong' : ''}
        `}
      >
        {activeMode !== 'face' && activeMode !== 'satellite' && (
          <JarvisCore 
            isSpeaking={isSpeaking} 
            isListening={isListening} 
            isProcessing={isProcessing || isGeneratingImage}
          />
        )}
        
        {(activeMode === 'face' || activeMode === 'satellite') && (
          <JarvisAvatar 
            activeMode={activeMode}
            isSpeaking={isSpeaking} 
            isListening={isListening}
            isProcessing={isProcessing}
          />
        )}
      </div>
      
      {isGeneratingImage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40">
          <Progress value={generationProgress} className="h-2 bg-black/40" />
          <p className="text-xs text-jarvis mt-1 text-center">Generating Image: {Math.round(generationProgress)}%</p>
        </div>
      )}
      
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
