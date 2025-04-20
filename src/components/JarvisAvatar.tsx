
import React, { useEffect, useRef, useState } from 'react';
import { JarvisMode } from './JarvisCore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface JarvisAvatarProps {
  activeMode: JarvisMode;
  isSpeaking: boolean;
}

const JarvisAvatar: React.FC<JarvisAvatarProps> = ({ activeMode, isSpeaking }) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const lipRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
  
  // Generate random particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Add dynamic animation effects when speaking
    if (avatarRef.current) {
      if (isSpeaking) {
        avatarRef.current.classList.add('animate-breathe');
      } else {
        avatarRef.current.classList.remove('animate-breathe');
      }
    }

    // Animate outer circle when speaking
    if (circleRef.current) {
      if (isSpeaking) {
        circleRef.current.classList.add('scale-110');
        circleRef.current.classList.add('bg-jarvis/15');
      } else {
        circleRef.current.classList.remove('scale-110');
        circleRef.current.classList.remove('bg-jarvis/15');
      }
    }

    // Enhanced lips animation when speaking
    if (lipRef.current) {
      if (isSpeaking) {
        lipRef.current.classList.add('animate-talk');
        // Add random width variations for more natural speech
        const lipAnimInterval = setInterval(() => {
          if (lipRef.current) {
            const randomWidth = Math.floor(Math.random() * 20) + 10;
            lipRef.current.style.width = `${randomWidth}px`;
          }
        }, 100);
        
        return () => clearInterval(lipAnimInterval);
      } else {
        lipRef.current.classList.remove('animate-talk');
        if (lipRef.current) lipRef.current.style.width = '16px';
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

  // Logo element
  const renderJarvisLogo = () => (
    <div className="absolute top-4 left-4 flex items-center">
      <div className="w-6 h-6 rounded-full bg-jarvis/80 flex items-center justify-center mr-2">
        <span className="text-black font-bold text-xs">J</span>
      </div>
      <div className="jarvis-logo text-sm">J.A.R.V.I.S</div>
    </div>
  );

  return (
    <div className="jarvis-panel relative h-[350px] flex items-center justify-center group">
      {/* Tech background */}
      <div className="tech-grid"></div>
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="absolute rounded-full bg-jarvis/60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${3 + particle.id % 3}s ease-in-out infinite`,
            animationDelay: `${particle.id * 0.2}s`
          }}
        />
      ))}
      
      {/* Jarvis Logo */}
      {renderJarvisLogo()}
      
      {/* Avatar Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div 
          ref={circleRef}
          className="w-64 h-64 rounded-full bg-jarvis/5 absolute transition-all duration-700"
        ></div>
        <div className="w-48 h-48 rounded-full bg-jarvis/10 absolute animate-pulse-slow"></div>
        <div className="w-56 h-56 rounded-full border border-jarvis/30 absolute"></div>
      </div>
      
      {/* Animated circles */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-jarvis/20 animate-pulse-slow"></div>
      <div className="absolute w-[320px] h-[320px] rounded-full border border-jarvis/10 animate-pulse-slow" style={{ animationDelay: '0.7s' }}></div>
      
      {/* Avatar Face */}
      <div 
        ref={avatarRef}
        className="relative z-[1] w-[200px] transform transition-all duration-500"
      >
        <img 
          src="/lovable-uploads/00ddfeb8-acf7-4356-9166-884c0b47bcaf.png" 
          alt="JARVIS Avatar" 
          className="w-full"
        />
        
        {/* Animated Lips */}
        <div 
          ref={lipRef}
          className="absolute left-1/2 bottom-[35%] -translate-x-1/2 w-16 h-1 bg-jarvis rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)] transition-all duration-100"
        ></div>
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
      
      {/* Glowing effect on hover */}
      <div className="absolute inset-0 border border-transparent rounded-md transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:border-jarvis/40 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]"></div>
    </div>
  );
};

export default JarvisAvatar;
