
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PulseCircleProps {
  className?: string;
  color?: string;
}

export const PulseCircle: React.FC<PulseCircleProps> = ({ className, color = 'rgba(51, 195, 240, 0.5)' }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ backgroundColor: color, opacity: 0.3 }} />
      <div className="relative rounded-full" style={{ backgroundColor: color, width: '100%', height: '100%' }} />
    </div>
  );
};

interface SoundWaveProps {
  isActive?: boolean;
  className?: string;
}

export const SoundWave: React.FC<SoundWaveProps> = ({ isActive = true, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Create bars
    const barCount = 12;
    container.innerHTML = '';
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'bg-jarvis';
      bar.style.width = '3px';
      bar.style.height = '15px';
      bar.style.margin = '0 1px';
      bar.style.borderRadius = '2px';
      bar.style.animation = isActive 
        ? `soundWave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`
        : 'none';
      bar.style.animationDelay = `${i * 0.05}s`;
      bar.style.opacity = isActive ? '1' : '0.3';
      
      container.appendChild(bar);
    }
    
    // Create keyframes if they don't exist
    if (!document.getElementById('sound-wave-keyframes')) {
      const style = document.createElement('style');
      style.id = 'sound-wave-keyframes';
      style.textContent = `
        @keyframes soundWave {
          0% { height: 5px; }
          100% { height: 25px; }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, [isActive]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex items-center h-10 transition-opacity duration-300",
        className
      )}
    />
  );
};

interface NetworkNodesProps {
  className?: string;
  nodeCount?: number;
}

export const NetworkNodes: React.FC<NetworkNodesProps> = ({ className, nodeCount = 6 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create nodes
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 3 + Math.random() * 3
      });
    }
    
    const drawNodes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51, 195, 240, 0.7)';
        ctx.fill();
      });
      
      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(51, 195, 240, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(drawNodes);
    };
    
    const animationId = requestAnimationFrame(drawNodes);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodeCount]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={cn("w-full h-full", className)}
    />
  );
};
