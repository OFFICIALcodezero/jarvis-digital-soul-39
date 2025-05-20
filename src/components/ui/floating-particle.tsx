
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FloatingParticleProps {
  className?: string;
  density?: 'low' | 'medium' | 'high';
  color?: string;
  speed?: 'slow' | 'medium' | 'fast';
  interactive?: boolean;
  glow?: boolean;
}

export const FloatingParticles: React.FC<FloatingParticleProps> = ({ 
  className,
  density = 'medium',
  color = '#9b87f5',
  speed = 'medium',
  interactive = false,
  glow = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set the canvas dimensions to match the container
    const resizeCanvas = () => {
      if (!container || !canvas) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Determine number of particles based on density
    const densityMap = {
      low: 30,
      medium: 60,
      high: 100
    };
    
    const speedMap = {
      slow: 0.5,
      medium: 1,
      fast: 2
    };
    
    const particleCount = densityMap[density];
    const baseSpeed = speedMap[speed];
    
    // Create particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }
    
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = 1 + Math.random() * 3;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * baseSpeed,
        speedY: (Math.random() - 0.5) * baseSpeed,
        opacity: 0.1 + Math.random() * 0.5,
        hue: Math.random() * 20 - 10 // Slight variation in hue
      });
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 100;
    let isMouseOver = false;
    
    if (interactive) {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseOver = true;
      });
      
      container.addEventListener('mouseout', () => {
        isMouseOver = false;
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Apply mouse interaction if enabled
        if (interactive && isMouseOver) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            particle.speedX -= Math.cos(angle) * force * 0.2;
            particle.speedY -= Math.sin(angle) * force * 0.2;
          }
        }
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary checks with bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw the particle
        const colorValue = color.startsWith('#') 
          ? hexToRgb(color)
          : { r: 155, g: 135, b: 245 }; // Default to purple
        
        if (colorValue) {
          const { r, g, b } = colorValue;
          
          // Adjust for hue variation
          const adjustedR = Math.min(255, Math.max(0, r + particle.hue));
          const adjustedG = Math.min(255, Math.max(0, g + particle.hue));
          const adjustedB = Math.min(255, Math.max(0, b + particle.hue));
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${particle.opacity})`;
          
          // Add glow effect
          if (glow) {
            ctx.shadowBlur = particle.size * 2;
            ctx.shadowColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 0.5)`;
          }
          
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const opacity = 0.15 * (1 - distance / 100);
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [className, density, color, speed, interactive, glow]);
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export const StarfieldBackground: React.FC<{
  className?: string;
  starCount?: number;
  speed?: number;
}> = ({
  className,
  starCount = 300,
  speed = 0.2
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      if (!container || !canvas) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
    }
    
    const stars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        size: 0.5 + Math.random() * 1.5,
        color: i % 50 === 0 
          ? `rgb(${150 + Math.random() * 100}, ${100 + Math.random() * 155}, 255)`
          : `rgb(255, 255, ${200 + Math.random() * 55})`
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.fillStyle = 'rgba(9, 12, 16, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Update and draw stars
      stars.forEach(star => {
        // Update z position (depth)
        star.z -= speed;
        
        // Reset star if it goes out of view
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
        }
        
        // Project 3D position to 2D screen
        const screenX = centerX + star.x / (star.z * 0.001);
        const screenY = centerY + star.y / (star.z * 0.001);
        
        // Calculate star size based on depth
        const scale = 1000 / star.z;
        const starSize = star.size * scale * 0.1;
        
        // Only draw stars within canvas bounds
        if (screenX > 0 && screenX < canvas.width && 
            screenY > 0 && screenY < canvas.height) {
          const intensity = 1 - star.z / 1000;
          ctx.globalAlpha = intensity;
          ctx.fillStyle = star.color;
          
          // Make some stars twinkle
          if (Math.random() > 0.99) {
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
          }
          
          ctx.beginPath();
          ctx.arc(screenX, screenY, starSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [starCount, speed]);
  
  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
