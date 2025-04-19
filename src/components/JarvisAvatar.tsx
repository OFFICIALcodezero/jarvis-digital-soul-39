
import React, { useEffect, useRef } from 'react';
import { JarvisMode } from './JarvisCore';

interface JarvisAvatarProps {
  activeMode: JarvisMode;
  isSpeaking: boolean;
}

const JarvisAvatar: React.FC<JarvisAvatarProps> = ({ activeMode, isSpeaking }) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animation effects when speaking
    if (avatarRef.current) {
      if (isSpeaking) {
        avatarRef.current.classList.add('animate-breathe');
      } else {
        avatarRef.current.classList.remove('animate-breathe');
      }
    }
  }, [isSpeaking]);

  const renderHackerModeOverlay = () => {
    if (activeMode === 'hacker') {
      return (
        <div className="absolute inset-0 bg-black/30 z-10 overflow-hidden">
          <div className="terminal-text text-xs leading-tight text-jarvis/80 overflow-hidden whitespace-nowrap animate-typing">
            {Array(20).fill(0).map((_, i) => (
              <div key={i} className="opacity-70">
                {i % 2 === 0 ? 
                  '> executing_scan... sys.override(true)' : 
                  '> accessing_network... encryption.bypass()'}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="jarvis-panel relative h-[350px] flex items-center justify-center">
      {/* Avatar Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-48 h-48 rounded-full bg-jarvis/10 absolute animate-pulse-slow"></div>
        <div className="w-64 h-64 rounded-full bg-jarvis/5 absolute animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Avatar Face */}
      <div 
        ref={avatarRef}
        className="relative z-[1] w-[200px] transform transition-transform duration-200"
      >
        <img 
          src="/lovable-uploads/00ddfeb8-acf7-4356-9166-884c0b47bcaf.png" 
          alt="JARVIS Avatar" 
          className="w-full"
        />
      </div>
      
      {/* Hacker mode overlay */}
      {renderHackerModeOverlay()}
      
      {/* Status Indicator */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs ${
        isSpeaking ? 'bg-jarvis/20 text-jarvis animate-flicker' : 'bg-gray-800/50 text-gray-400'
      }`}>
        {isSpeaking ? 'SPEAKING' : 'IDLE'}
      </div>
      
      {/* Mode Badge */}
      <div className="absolute top-4 right-4 bg-jarvis/20 text-jarvis px-3 py-1 rounded-full text-xs uppercase font-bold">
        {activeMode} mode
      </div>
    </div>
  );
};

export default JarvisAvatar;
