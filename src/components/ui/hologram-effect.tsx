
import React, { useEffect, useRef } from 'react';

interface HologramEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  animated?: boolean;
  pulseRate?: number;
}

const HologramEffect: React.FC<HologramEffectProps> = ({ 
  children, 
  className = '',
  intensity = 'medium',
  color = '#33C3F0',
  animated = true,
  pulseRate = 1.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !animated) return;
    
    // Create glitch effect periodically
    const glitchInterval = setInterval(() => {
      if (!containerRef.current) return;
      
      const glitch = document.createElement('div');
      glitch.className = 'hologram-glitch';
      glitch.style.top = `${Math.random() * 100}%`;
      glitch.style.width = '100%';
      glitch.style.height = `${1 + Math.random() * 3}px`;
      glitch.style.opacity = `${0.3 + Math.random() * 0.7}`;
      glitch.style.animationDuration = `${0.2 + Math.random() * 0.3}s`;
      glitch.style.backgroundColor = color;
      containerRef.current.appendChild(glitch);
      
      // Remove glitch element after animation
      setTimeout(() => {
        if (glitch.parentNode) {
          glitch.remove();
        }
      }, 500);
    }, intensity === 'high' ? 200 : intensity === 'medium' ? 500 : 1000);
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, [intensity, animated, color]);

  // Convert hex color to rgba for effects
  const getRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative hologram-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate'
      }}
    >
      {/* Holographic container with 3D perspective */}
      <div className="relative overflow-hidden rounded-lg hologram-content" style={{
        transform: 'perspective(1000px) rotateX(2deg)',
        boxShadow: intensity === 'high' 
          ? `0 0 30px ${getRgba(color, 0.7)}, 0 0 60px ${getRgba(color, 0.3)}` 
          : `0 0 20px ${getRgba(color, 0.5)}, 0 0 40px ${getRgba(color, 0.2)}`,
        animation: animated ? `hologram-pulse ${pulseRate}s infinite alternate ease-in-out` : 'none'
      }}>
        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${getRgba(color, 0.2)} 3px, transparent 3px)`,
          backgroundSize: '100% 3px',
          zIndex: 2
        }}></div>
        
        {/* Main scan line effect */}
        <div className="absolute left-0 w-full h-[3px] hud-scan" style={{
          backgroundColor: getRgba(color, 0.5),
          boxShadow: `0 0 15px ${getRgba(color, 0.7)}, 0 0 30px ${getRgba(color, 0.3)}`,
          filter: 'contrast(1.5) brightness(1.5)'
        }}></div>
        
        {/* Interference lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] w-full"
              style={{
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3,
                backgroundColor: color,
                boxShadow: `0 0 8px ${getRgba(color, 0.8)}`,
                animation: `hologram-flicker ${1 + Math.random() * 2}s infinite ${Math.random()}s`,
                zIndex: 3
              }}
            ></div>
          ))}
        </div>
        
        {/* Edge glow effect */}
        <div className="absolute inset-0 pointer-events-none border"
             style={{ 
               borderColor: getRgba(color, 0.3),
               boxShadow: `inset 0 0 10px ${getRgba(color, 0.3)}` 
             }}></div>
        
        {/* 3D depth effect overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b" style={{
          backgroundImage: `linear-gradient(to bottom, ${getRgba(color, 0.1)}, transparent, ${getRgba(color, 0.05)})`
        }}></div>
        
        {/* Content with holographic effect */}
        <div className="relative z-1 holographic-text">
          {children}
        </div>
        
        {/* Flickering effect */}
        <div className="absolute inset-0 animate-hologram-flicker pointer-events-none" 
             style={{ 
               mixBlendMode: 'overlay',
               backgroundColor: getRgba(color, 0.05)
             }}></div>
      </div>
    </div>
  );
};

export default HologramEffect;
