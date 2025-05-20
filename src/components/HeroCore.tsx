
import React, { useEffect, useRef } from 'react';
import JarvisCore from '@/components/core/JarvisCore';
import { cn } from '@/lib/utils';

interface HeroCoreProps {
  size?: 'small' | 'medium' | 'large';
  isAnimating?: boolean;
  className?: string;
}

const HeroCore: React.FC<HeroCoreProps> = ({ 
  size = 'large', 
  isAnimating = true, 
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Size map
  const sizeMap = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48 md:w-64 md:h-64',
    large: 'w-64 h-64 md:w-80 md:h-80'
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    // Particle properties
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      color: string;
      opacity: number;
    }[] = [];
    
    // Create particles
    const createParticles = () => {
      const particleCount = isAnimating ? 100 : 30;
      particles.length = 0;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 60;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        particles.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          size: 1 + Math.random() * 2,
          speed: 0.2 + Math.random() * 0.5,
          angle,
          color: isAnimating ? 'rgba(51, 195, 240, 0.8)' : 'rgba(51, 195, 240, 0.5)',
          opacity: 0.3 + Math.random() * 0.7
        });
      }
    };
    
    createParticles();
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        // Animate particles
        if (isAnimating) {
          particle.angle += particle.speed * 0.01;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 20 + Math.sin(Date.now() * 0.001 + particle.angle) * 60;
          
          particle.x = centerX + Math.cos(particle.angle) * radius;
          particle.y = centerY + Math.sin(particle.angle) * radius;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.8', particle.opacity.toString());
        ctx.fill();
        
        // Draw connection line to center
        if (Math.random() > 0.98) {
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height / 2);
          ctx.lineTo(particle.x, particle.y);
          ctx.strokeStyle = `rgba(51, 195, 240, ${particle.opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      
      // Add central glow
      const glow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2
      );
      glow.addColorStop(0, 'rgba(51, 195, 240, 0.2)');
      glow.addColorStop(1, 'rgba(51, 195, 240, 0)');
      
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isAnimating]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center",
        sizeMap[size],
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="relative z-10">
        <JarvisCore 
          isSpeaking={isAnimating} 
          isListening={false} 
          isProcessing={false}
        />
      </div>
    </div>
  );
};

export default HeroCore;
