
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

export interface JarvisCentralCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: string;
}

const JarvisCentralCore: React.FC<JarvisCentralCoreProps> = ({
  isSpeaking = false,
  isListening = false,
  isProcessing = false,
  activeMode = 'normal'
}) => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, speed: number, angle: number}[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [coreActivity, setCoreActivity] = useState(0.5); // 0-1 scale of energy
  
  // Generate energy particles that orbit around the core
  useEffect(() => {
    // Adjust core activity based on state
    if (isSpeaking) setCoreActivity(1);
    else if (isListening) setCoreActivity(0.8);
    else if (isProcessing) setCoreActivity(0.7);
    else setCoreActivity(0.5);
    
    // Create particles
    const particleCount = isListening || isSpeaking ? 20 : 10;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 3 + 1,
        angle: Math.random() * Math.PI * 2
      });
    }
    setParticles(newParticles);
    
    // Play sound effect when state changes
    if (isSpeaking || isListening) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.type = isSpeaking ? 'sine' : 'triangle';
          oscillator.frequency.setValueAtTime(isSpeaking ? 440 : 660, audioCtx.currentTime);
          
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.5);
        }
      } catch (error) {
        console.error("Could not play core sound effect:", error);
      }
    }
  }, [isSpeaking, isListening, isProcessing]);

  return (
    <div className="h-full w-full flex items-center justify-center relative z-10">
      {/* Particle effect container */}
      <div className="particle-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: isSpeaking || isListening ? 0.8 : 0.4,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px rgba(${isSpeaking ? '234, 56, 76' : '30, 174, 219'}, 0.6)`,
              transform: isListening || isSpeaking ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
            }}
          />
        ))}
      </div>
      
      {/* Outer rings - Iron Man styled with red and gold colors */}
      <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-[#F97316]/30 animate-spin-slow"></div>
      <div className="absolute w-[260px] h-[260px] rounded-full border-2 border-[#ea384c]/20 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      <div className="absolute w-[220px] h-[220px] rounded-full border-2 border-[#F97316]/30"></div>
      
      {/* Additional orbiting elements */}
      {(activeMode === 'normal' || activeMode === 'voice') && (
        <>
          <div className="absolute w-4 h-4 rounded-full bg-[#ea384c]/40 animate-orbit" 
               style={{ animationDuration: '20s' }}></div>
          <div className="absolute w-3 h-3 rounded-full bg-[#F97316]/50 animate-orbit" 
               style={{ animationDuration: '15s', animationDelay: '2s', animationDirection: 'reverse' }}></div>
        </>
      )}
      
      {/* Pulsing effect when active */}
      <div className={cn(
        "absolute w-[180px] h-[180px] rounded-full",
        (isSpeaking || isListening) && "bg-[#ea384c]/10 animate-ping-slow"
      )}></div>
      
      {/* Core element - Iron Man arc reactor style */}
      <div 
        ref={coreRef}
        className={cn(
          "w-[120px] h-[120px] rounded-full flex items-center justify-center relative overflow-hidden core-glow",
          "bg-gradient-to-r from-[#ea384c] via-[#F97316] to-[#ea384c]",
          isSpeaking && "animate-pulse",
          isListening && "animate-breathe",
          isProcessing && "animate-flicker"
        )}
        style={{
          boxShadow: `0 0 20px 5px rgba(234, 56, 76, 0.6), inset 0 0 15px rgba(249, 115, 22, 0.8)`,
        }}
      >
        {/* Metallic texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjE1Ii8+Cjwvc3ZnPg==')]"></div>
        
        {/* Inner core layers */}
        <div className="absolute w-[90px] h-[90px] rounded-full bg-[#ea384c]/30 backdrop-blur-lg"></div>
        <div className="absolute w-[70px] h-[70px] rounded-full bg-[#F97316]/20 animate-pulse-subtle"></div>
        <div className="absolute w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#ea384c] to-[#F97316] opacity-70"></div>
        
        {/* Energy wave effect */}
        <div className={cn(
          "absolute w-full h-[40%] bottom-0 overflow-hidden",
          isSpeaking || isListening ? "opacity-100" : "opacity-40",
          "transition-opacity duration-500"
        )}>
          <div className={cn(
            "absolute w-[200%] h-full bg-[#F97316]/50",
            "animate-wave"
          )}
            style={{ 
              animationDuration: `${3 - coreActivity * 2}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              borderTopLeftRadius: '100%',
              borderTopRightRadius: '100%',
              left: '-50%',
              bottom: '-20%',
            }}
          ></div>
        </div>
        
        {/* Central bright spot - Arc reactor core */}
        <div className={cn(
          "w-[30px] h-[30px] rounded-full bg-white z-10",
          "animate-pulse-subtle",
          isSpeaking && "animate-pulse",
          isListening && "animate-breathe"
        )}
          style={{ 
            boxShadow: `0 0 15px 5px rgba(255, 255, 255, ${coreActivity * 0.8})` 
          }}
        ></div>
        
        {/* Triangular pattern around core - like Iron Man's reactor */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[25px] w-[12px] bg-[#F97316]/70"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-30px)`,
              transformOrigin: 'bottom center',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
            }}
          ></div>
        ))}
        
        {/* Outer glow that intensifies with activity */}
        <div className="absolute inset-0 rounded-full"
             style={{ 
               boxShadow: `0 0 30px ${coreActivity * 15}px rgba(234, 56, 76, ${coreActivity * 0.6})`,
               transition: 'box-shadow 0.5s ease-out'
             }}
        ></div>
      </div>
      
      {/* Scanning lines when speaking/listening */}
      {(isSpeaking || isListening) && (
        <div className="absolute w-[200px] h-[200px] rounded-full overflow-hidden pointer-events-none">
          <div className="absolute w-full h-1 bg-[#F97316]/30 top-1/2 transform -translate-y-1/2 animate-wave"
               style={{ animationDuration: '2s' }}></div>
          <div className="absolute w-1 h-full bg-[#ea384c]/30 left-1/2 transform -translate-x-1/2 animate-wave"
               style={{ animationDuration: '2.5s' }}></div>
        </div>
      )}
      
      {/* Status indicators around the core */}
      <div className={cn(
        "absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-sm font-bold uppercase",
        isSpeaking ? "text-[#F97316]" : isListening ? "text-[#ea384c]" : "text-[#ea384c]/60"
      )}>
        {isSpeaking ? "Speaking" : isListening ? "Listening" : isProcessing ? "Processing" : "Standby"}
      </div>
    </div>
  );
};

export default JarvisCentralCore;
