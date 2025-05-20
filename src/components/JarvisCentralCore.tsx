
import React, { useEffect, useRef } from 'react';
import JarvisCore from './core/JarvisCore';
import JarvisAvatar from './JarvisAvatar';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import { Progress } from '@/components/ui/progress';
import HologramEffect from './ui/hologram-effect';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';

interface JarvisCentralCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite';
}

const JarvisCentralCore: React.FC<JarvisCentralCoreProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
  activeMode
}) => {
  const { isGeneratingImage, generationProgress } = useJarvisChat();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create reflection effect with canvas
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Configure canvas for reflection effect
    canvas.width = container.offsetWidth;
    canvas.height = 50;
    canvas.style.position = 'absolute';
    canvas.style.bottom = '10px';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '50px';
    canvas.style.transform = 'scaleY(-0.3) scaleX(0.8)';
    canvas.style.opacity = '0.4';
    canvas.style.filter = 'blur(1px)';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    // Reflection animation loop
    const drawReflection = () => {
      if (!container || !canvas || !ctx) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the reflection (we'll just simulate it with a gradient)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(155, 135, 245, 0.3)');
      gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some "ripples"
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.3;
        const radius = 1 + Math.random() * 3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
      
      requestAnimationFrame(drawReflection);
    };
    
    const animationId = requestAnimationFrame(drawReflection);
    
    return () => {
      cancelAnimationFrame(animationId);
      if (canvas && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center relative">
      {/* Ambient circular glow */}
      <div className="absolute w-96 h-96 rounded-full bg-jarvis-purple/10 blur-[100px] pointer-events-none"></div>
      
      {/* Grid lines for tech feel */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(155, 135, 245, 0.05) 25%, rgba(155, 135, 245, 0.05) 26%, transparent 27%, transparent 74%, rgba(155, 135, 245, 0.05) 75%, rgba(155, 135, 245, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(155, 135, 245, 0.05) 25%, rgba(155, 135, 245, 0.05) 26%, transparent 27%, transparent 74%, rgba(155, 135, 245, 0.05) 75%, rgba(155, 135, 245, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      <div 
        className={`jarvis-core-container relative w-72 h-72 flex items-center justify-center perspective-container
          ${isSpeaking ? 'animate-pulse' : ''} 
          ${isProcessing ? 'animate-spin-slow' : ''}
          ${isGeneratingImage ? 'animate-glow-strong' : ''}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated pulse rings */}
          <div className={`absolute w-64 h-64 rounded-full border border-jarvis-purple/30 opacity-80 ${(isSpeaking || isListening) ? 'animate-ping-slow' : ''}`}></div>
          <div className={`absolute w-56 h-56 rounded-full border border-jarvis-purple/20 opacity-60 ${(isSpeaking || isListening) ? 'animate-ping-slow' : ''}`} style={{animationDelay: '0.5s'}}></div>
          <div className={`absolute w-48 h-48 rounded-full border border-jarvis-purple/10 opacity-40 ${(isSpeaking || isListening) ? 'animate-ping-slow' : ''}`} style={{animationDelay: '1s'}}></div>
        </div>
        
        {activeMode !== 'face' && activeMode !== 'satellite' ? (
          <HologramEffect intensity={activeMode === 'hacker' ? 'high' : 'medium'} className="scale-125 transform transition-all duration-300">
            <JarvisCore 
              isSpeaking={isSpeaking} 
              isListening={isListening} 
              isProcessing={isProcessing || isGeneratingImage}
            />
          </HologramEffect>
        ) : (
          <div className="scale-125 transform transition-all duration-300">
            <JarvisAvatar 
              activeMode={activeMode}
              isSpeaking={isSpeaking} 
              isListening={isListening}
              isProcessing={isProcessing}
            />
          </div>
        )}
        
        {/* Tech decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-jarvis-purple/40"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-jarvis-purple/40"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-jarvis-purple/40"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-jarvis-purple/40"></div>
        </div>
      </div>
      
      {isGeneratingImage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 z-10">
          <Progress value={generationProgress} className="h-2 bg-black/40" />
          <p className="text-xs text-jarvis-purple mt-1 text-center">Generating Image: {Math.round(generationProgress)}%</p>
        </div>
      )}
      
      {/* Status indicators */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        {isSpeaking && (
          <Badge variant="purple" className="flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Speaking
          </Badge>
        )}
        
        {isListening && !isSpeaking && (
          <Badge variant="purple" className="flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Listening
          </Badge>
        )}
        
        {isProcessing && !isSpeaking && !isListening && (
          <Badge variant="purple" className="flex items-center gap-1">
            <Loader className="w-3 h-3 animate-spin mr-1" />
            Processing
          </Badge>
        )}
        
        {isGeneratingImage && !isSpeaking && !isListening && (
          <Badge variant="purple" className="flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Generating Image
          </Badge>
        )}
      </div>
      
      {/* Data stream line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 data-stream opacity-30"></div>
    </div>
  );
};

export default JarvisCentralCore;
