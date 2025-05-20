
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FloatingParticleProps {
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticleProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Create particles
    const particleCount = Math.min(50, Math.floor((containerWidth * containerHeight) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random size between 2-6px
      const size = 2 + Math.random() * 4;
      
      // Styling
      particle.className = 'absolute rounded-full bg-jarvis/30';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${0.3 + Math.random() * 0.4}`;
      particle.style.filter = `blur(${Math.random()}px)`;
      
      // Animation
      particle.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    }
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} />
  );
};
