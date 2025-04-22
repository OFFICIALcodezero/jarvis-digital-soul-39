
import React from 'react';
import JarvisCore from './JarvisCore';
import JarvisAvatar from './JarvisAvatar';
import SystemData from './SystemData';

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
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <div 
        className={`jarvis-core-container ${isSpeaking ? 'animate-pulse' : ''} ${isProcessing ? 'animate-spin-slow' : ''}`}
      >
        <JarvisCore 
          isSpeaking={isSpeaking} 
          isListening={isListening} 
          isProcessing={isProcessing}
          pulseIntensity={isSpeaking ? 0.7 : isListening ? 0.3 : 0}
        />
      </div>
      
      {activeMode === 'face' && (
        <div className="mt-4 mb-2">
          <JarvisAvatar 
            isSpeaking={isSpeaking} 
            isListening={isListening}
          />
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0">
        <SystemData />
      </div>
      
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
    </div>
  );
};

export default JarvisCentralCore;
