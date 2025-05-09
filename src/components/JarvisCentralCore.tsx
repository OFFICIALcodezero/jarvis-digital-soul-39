
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
        className={`jarvis-core-container w-72 h-72 flex items-center justify-center
          ${isSpeaking ? 'animate-pulse' : ''} 
          ${isProcessing ? 'animate-spin-slow' : ''}
          ${isGeneratingImage ? 'animate-glow-strong' : ''}
        `}
      >
        {activeMode !== 'face' && activeMode !== 'satellite' && (
          <div className="scale-125 transform transition-all duration-300">
            <JarvisCore 
              isSpeaking={isSpeaking} 
              isListening={isListening} 
              isProcessing={isProcessing || isGeneratingImage}
            />
          </div>
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
      
      {/* Add pulsating rings around the core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full border border-jarvis/20 animate-ping-slow opacity-30"></div>
        <div className="w-80 h-80 rounded-full border border-jarvis/30 animate-ping-slow opacity-30" style={{animationDelay: '0.5s'}}></div>
        <div className="w-64 h-64 rounded-full border border-jarvis/40 animate-ping-slow opacity-30" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default JarvisCentralCore;
