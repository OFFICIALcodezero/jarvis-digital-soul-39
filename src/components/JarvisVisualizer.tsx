
import React, { useEffect, useRef, useState } from 'react';

interface JarvisVisualizerProps {
  isActive?: boolean;
  amplitude?: number;
  className?: string;
}

const JarvisVisualizer: React.FC<JarvisVisualizerProps> = ({ 
  isActive = true, 
  amplitude = 35,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 80 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const updateDimensions = () => {
      if (canvas.parentElement) {
        const { width } = canvas.parentElement.getBoundingClientRect();
        canvas.width = width;
        canvas.height = 80;
        setDimensions({ width, height: 80 });
      }
    };
    
    // Initial setup
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    let animationId: number;
    let phase = 0;
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waveform
      const centerY = canvas.height / 2;
      const segmentWidth = 2;
      const segments = Math.floor(canvas.width / segmentWidth);
      
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      
      for (let i = 0; i < segments; i++) {
        const x = i * segmentWidth;
        const waveAmplitude = isActive ? amplitude : 5;
        const frequency = isActive ? 0.03 : 0.01;
        const noise = isActive ? Math.random() * 5 : 0;
        
        const y = centerY + 
          Math.sin(i * frequency + phase) * waveAmplitude + 
          Math.sin(i * 0.02 - phase * 2) * (waveAmplitude / 3) +
          noise;
        
        ctx.lineTo(x, y);
      }
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(51, 195, 240, 0.5)');
      gradient.addColorStop(0.5, 'rgba(51, 195, 240, 0.8)');
      gradient.addColorStop(1, 'rgba(51, 195, 240, 0.5)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = 'rgba(51, 195, 240, 0.8)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      
      // Update phase for animation
      phase += isActive ? 0.05 : 0.02;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, amplitude]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ display: 'block' }} 
        width={dimensions.width} 
        height={dimensions.height}
      />
    </div>
  );
};

export default JarvisVisualizer;
