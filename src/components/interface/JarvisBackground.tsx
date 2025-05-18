
import React from 'react';
import ArcReactor from '@/components/background/ArcReactor';

interface JarvisBackgroundProps {
  hackerModeActive: boolean;
}

const JarvisBackground: React.FC<JarvisBackgroundProps> = ({ hackerModeActive }) => {
  return (
    <>
      {/* Apply hacker background effects if in hacker mode */}
      {hackerModeActive && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 hacker-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10"></div>
        </div>
      )}
      
      {/* Normal Jarvis background */}
      {!hackerModeActive && (
        <div className="absolute inset-0 z-0">
          {/* Dark background with subtle hex pattern */}
          <div className="absolute inset-0 bg-jarvis-bg hex-grid"></div>
          
          {/* Circular gradient in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full bg-[#33C3F0]/5 blur-[100px]"></div>
          
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(51, 195, 240, 0.05) 25%, rgba(51, 195, 240, 0.05) 26%, transparent 27%, transparent 74%, rgba(51, 195, 240, 0.05) 75%, rgba(51, 195, 240, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Moving horizontal scan line */}
          <div className="absolute inset-0">
            <div className="hud-scan"></div>
          </div>
          
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#33C3F0]/50 rounded-full"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3,
                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      <ArcReactor />
      
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${hackerModeActive ? 'from-red-900/10' : 'from-[#1eaedb]/10'} to-transparent z-0`}></div>
    </>
  );
};

export default JarvisBackground;
