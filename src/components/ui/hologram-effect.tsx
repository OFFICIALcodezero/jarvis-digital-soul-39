
import React from 'react';

interface HologramEffectProps {
  children: React.ReactNode;
  className?: string;
}

const HologramEffect: React.FC<HologramEffectProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Hologram container */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Scan line effect */}
        <div className="absolute left-0 w-full h-1 bg-[#33C3F0]/30 hud-scan"></div>
        
        {/* Glitching effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10 mix-blend-screen">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-[1px] w-full bg-[#33C3F0]"
                style={{
                  top: `${Math.random() * 100}%`,
                  animation: `hologram-flicker ${1 + Math.random() * 2}s infinite ${Math.random()}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="holographic-text">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HologramEffect;
