
import React, { useEffect, useRef } from 'react';
import ArcReactor from '@/components/background/ArcReactor';

interface JarvisBackgroundProps {
  hackerModeActive: boolean;
}

const JarvisBackground: React.FC<JarvisBackgroundProps> = ({ hackerModeActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Advanced particle system for normal mode
  useEffect(() => {
    if (hackerModeActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }[] = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 2.5,
        speed: 0.2 + Math.random() * 0.6,
        opacity: 0.1 + Math.random() * 0.4,
        color: `rgba(155, 135, 245, ${0.3 + Math.random() * 0.7})`
      });
    }
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        
        // Add glow
        ctx.shadowColor = 'rgba(155, 135, 245, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        // Reset shadow and opacity
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Move particle upward
        particle.y -= particle.speed;
        
        // Reset particle if it goes beyond screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // Draw connections between nearby particles
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.2})`;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(draw);
    };
    
    const animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hackerModeActive]);
  
  // Hacker mode matrix effect
  useEffect(() => {
    if (!hackerModeActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const characters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789";
    
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops: number[] = Array(columns).fill(1);
    
    const matrix = () => {
      // Black with opacity for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Randomly reset drop position with some chance
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const interval = setInterval(matrix, 40);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hackerModeActive]);

  return (
    <>
      {/* Background canvas for particle effects */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
    
      {/* Apply hacker background effects if in hacker mode */}
      {hackerModeActive && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 hacker-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/20"></div>
          
          {/* Scan lines */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 50, 50, 0.1) 3px, transparent 3px)',
            backgroundSize: '100% 4px'
          }}></div>
          
          {/* Red alerts */}
          <div className="absolute top-0 right-0 p-4 text-red-500 text-xs font-mono animate-pulse">
            SECURITY BREACH DETECTED
          </div>
          <div className="absolute bottom-0 left-0 p-4 text-red-500 text-xs font-mono">
            TRACING...
          </div>
        </div>
      )}
      
      {/* Modern Jarvis background */}
      {!hackerModeActive && (
        <div className="absolute inset-0 z-0">
          {/* Dark background with subtle hex pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-jarvis-deep to-jarvis-midnight hex-grid"></div>
          
          {/* Circular gradient in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full bg-jarvis-purple/5 blur-[100px]"></div>
          
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(155, 135, 245, 0.05) 25%, rgba(155, 135, 245, 0.05) 26%, transparent 27%, transparent 74%, rgba(155, 135, 245, 0.05) 75%, rgba(155, 135, 245, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Vertical lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 24%, rgba(155, 135, 245, 0.03) 25%, rgba(155, 135, 245, 0.03) 26%, transparent 27%, transparent 74%, rgba(155, 135, 245, 0.03) 75%, rgba(155, 135, 245, 0.03) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Moving horizontal scan line */}
          <div className="absolute inset-0">
            <div className="hud-scan"></div>
          </div>
          
          {/* Digital circuit patterns in corners */}
          <div className="absolute top-0 left-0 w-64 h-64 opacity-20 bg-purple-pattern"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 bg-purple-pattern"></div>
          
          {/* Add a subtle vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
          
          {/* Add some floating shapes */}
          <div className="absolute top-[30%] left-[10%] w-16 h-16 bg-jarvis-purple/5 rounded-full blur-lg animate-float"></div>
          <div className="absolute top-[60%] left-[25%] w-24 h-24 bg-jarvis-purple/5 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[20%] right-[15%] w-20 h-20 bg-jarvis-purple/5 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      )}
      
      <ArcReactor size="large" intensity={hackerModeActive ? 'low' : 'high'} />
      
      {/* Atmospheric gradient overlay */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${
        hackerModeActive ? 'from-red-900/20' : 'from-jarvis-purple/10'
      } to-transparent z-0`}></div>
    </>
  );
};

export default JarvisBackground;
