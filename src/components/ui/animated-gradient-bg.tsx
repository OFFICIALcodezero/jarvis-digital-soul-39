
import React, { useEffect, useRef } from 'react';

interface AnimatedGradientBgProps {
  children: React.ReactNode;
}

export const AnimatedGradientBg: React.FC<AnimatedGradientBgProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Initialize canvas dimensions
    canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    
    // Create gradient points
    const points = [
      { x: canvas.width * 0.1, y: canvas.height * 0.1, color: 'rgba(51, 195, 240, 0.3)' },
      { x: canvas.width * 0.9, y: canvas.height * 0.2, color: 'rgba(139, 92, 246, 0.3)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, color: 'rgba(192, 132, 252, 0.2)' },
    ];
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move points
      points.forEach(point => {
        point.x += Math.sin(Date.now() * 0.001) * 0.5;
        point.y += Math.cos(Date.now() * 0.002) * 0.5;
      });
      
      // Draw gradients
      points.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, canvas.width * 0.4
        );
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
