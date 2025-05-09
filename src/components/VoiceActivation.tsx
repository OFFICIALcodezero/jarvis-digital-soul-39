
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import IronManBackground from './chat/IronManBackground';
import { toast } from '@/components/ui/use-toast';

interface VoiceActivationProps {
  onCommandReceived?: (command: string) => void;
  isListening?: boolean;
  toggleListening?: () => void;
  isSpeaking?: boolean;
  hackerMode?: boolean;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({
  onCommandReceived,
  isListening = false,
  toggleListening = () => {},
  isSpeaking = false,
  hackerMode = false
}) => {
  // The Iron Man should glow when Jarvis is speaking, actively processing, or listening
  const isJarvisActive = isSpeaking || isListening;
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [animationState, setAnimationState] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [showPermissionTooltip, setShowPermissionTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const permissionCheckTimeout = useRef<number | null>(null);
  
  // Create a smoother pulsing effect when listening
  useEffect(() => {
    let interval: number;
    
    if (isListening) {
      setAnimationState('listening');
      // Smoother animation using smaller increments
      interval = window.setInterval(() => {
        setPulseIntensity(prev => {
          // Create a smoother pulse effect
          if (prev >= 1.2) return 1.18;
          if (prev <= 1) return 1.02;
          return prev > 1.1 ? prev - 0.01 : prev + 0.01;
        });
      }, 100); // Faster interval for smoother animation
    } else if (isSpeaking) {
      setAnimationState('processing');
      // Different pulse pattern for speaking
      interval = window.setInterval(() => {
        setPulseIntensity(prev => prev === 1 ? 1.1 : 1);
      }, 600);
    } else {
      setAnimationState('idle');
    }
    
    return () => {
      if (interval) clearInterval(interval);
      setPulseIntensity(1);
    };
  }, [isListening, isSpeaking]);

  // Show permission tooltip when user clicks on mic but doesn't have permission
  const handleMicClick = () => {
    // Request microphone permission when clicked
    if (!isListening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          toggleListening();
          setShowPermissionTooltip(false);
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          setAnimationState('error');
          setShowPermissionTooltip(true);
          
          // Hide tooltip after 5 seconds
          if (permissionCheckTimeout.current) {
            window.clearTimeout(permissionCheckTimeout.current);
          }
          
          permissionCheckTimeout.current = window.setTimeout(() => {
            setShowPermissionTooltip(false);
          }, 5000);
          
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands.",
            variant: "destructive"
          });
        });
    } else {
      toggleListening();
    }
  };
  
  // Clean up timeout
  useEffect(() => {
    return () => {
      if (permissionCheckTimeout.current) {
        window.clearTimeout(permissionCheckTimeout.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Iron Man Background positioned to fill the space */}
      <div className="mb-4 relative w-full h-40">
        <IronManBackground isGlowing={isJarvisActive} hackerMode={hackerMode} />
      </div>
      
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={handleMicClick}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            hackerMode 
              ? `${isListening ? 'bg-red-500/30 border-2 border-red-500' : 'bg-black/30 border border-red-500/30'}`
              : `${isListening ? 'bg-[#33c3f0]/30 border-2 border-[#33c3f0]' : 'bg-black/30 border border-[#33c3f0]/30'}`
          }`}
          style={{ transform: `scale(${pulseIntensity})` }}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <Mic className={`h-6 w-6 ${hackerMode ? 'text-red-400' : 'text-white'} ${
              animationState === 'listening' ? 'animate-pulse' : ''
            }`} />
          ) : (
            <MicOff className={`h-6 w-6 ${hackerMode ? 'text-red-400/50' : 'text-white/50'} ${
              animationState === 'error' ? 'text-red-500' : ''
            }`} />
          )}
        </button>
        
        {showPermissionTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-red-500/80 text-white text-xs rounded-md whitespace-nowrap">
            Please allow microphone access
          </div>
        )}
      </div>
      
      {isJarvisActive && (
        <div className="flex items-center space-x-1 mt-2">
          <div className={`h-1 w-1 ${hackerMode ? 'bg-red-400' : 'bg-white'} rounded-full animate-pulse`}></div>
          <div className={`h-1 w-1 ${hackerMode ? 'bg-red-400' : 'bg-white'} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`h-1 w-1 ${hackerMode ? 'bg-red-400' : 'bg-white'} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      
      <div className={`text-xs ${hackerMode ? 'text-red-400/70' : 'text-white/70'}`}>
        {isListening ? "Listening for 'Jarvis'..." : isSpeaking ? "Speaking..." : "Click to activate"}
      </div>
    </div>
  );
};

export default VoiceActivation;
