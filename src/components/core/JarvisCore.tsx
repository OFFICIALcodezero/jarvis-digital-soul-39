
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader } from 'lucide-react';

interface JarvisCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
}

const JarvisCore: React.FC<JarvisCoreProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
}) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Base core glow */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-jarvis/10 blur-xl transition-opacity duration-500",
        (isSpeaking || isListening) && "opacity-100",
        !isSpeaking && !isListening && "opacity-40"
      )} />

      {/* Dynamic rings */}
      <div className={cn(
        "absolute w-full h-full rounded-full border-2 border-jarvis/30",
        (isSpeaking || isListening) && "animate-ping-slow"
      )} />
      <div className={cn(
        "absolute w-[90%] h-[90%] rounded-full border border-jarvis/20",
        isProcessing && "animate-spin-slow"
      )} />
      
      {/* Central core */}
      <div className="relative w-32 h-32">
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-r from-jarvis/20 to-jarvis/30 backdrop-blur-sm",
          (isSpeaking || isListening) && "animate-pulse"
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            {isProcessing ? (
              <Loader className="w-8 h-8 text-jarvis animate-spin" />
            ) : (
              <div className={cn(
                "w-16 h-16 rounded-full bg-jarvis/30 flex items-center justify-center",
                (isSpeaking || isListening) && "animate-pulse"
              )}>
                <div className="w-12 h-12 rounded-full bg-jarvis/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-jarvis/50" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Energy particles */}
      {(isSpeaking || isListening) && (
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-jarvis rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JarvisCore;
