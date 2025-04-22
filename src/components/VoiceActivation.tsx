
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceActivationProps {
  onCommandReceived: (command: string) => void;
  isListening: boolean;
  toggleListening: () => void;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({ 
  onCommandReceived, 
  isListening,
  toggleListening
}) => {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [activationDetected, setActivationDetected] = useState(false);
  
  // Sound effect for activation
  const playActivationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(770, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (error) {
      console.error("Could not play activation sound:", error);
    }
  };

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        // Check for trigger phrase "Hey Jarvis"
        const isActivated = currentTranscript.toLowerCase().includes('hey jarvis');
        
        if (isActivated && !activationDetected) {
          setActivationDetected(true);
          playActivationSound();
          
          // Visual feedback for activation
          setTimeout(() => setActivationDetected(false), 2000);
          
          // Extract command after "hey jarvis"
          const commandParts = currentTranscript.toLowerCase().split('hey jarvis');
          if (commandParts.length > 1 && commandParts[1].trim()) {
            onCommandReceived(commandParts[1].trim());
            setTranscript('');
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (isListening) {
          toggleListening();
        }
      };

      return () => {
        recognition.stop();
      };
    } else {
      console.error('Speech recognition not supported in this browser');
      setRecognitionSupported(false);
    }
  }, [onCommandReceived, isListening, toggleListening, activationDetected]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        // Recognition might already be started, ignore
      }
    } else {
      recognition.stop();
      setTranscript('');
    }
  }, [isListening]);

  if (!recognitionSupported) {
    return (
      <div className="relative">
        <button 
          className="relative flex items-center justify-center w-12 h-12 rounded-full jarvis-panel border border-red-500/30 group"
          onClick={() => alert("Speech recognition is not supported in your browser")}
        >
          <MicOff className="w-5 h-5 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={toggleListening}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full jarvis-panel ${
          isListening || activationDetected ? 'border border-jarvis' : ''
        } transition-all duration-300 group`}
      >
        {/* Animated rings when active */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping-slow bg-jarvis/20"></div>
            <div className="absolute inset-0 rounded-full animate-ping-slow delay-300 bg-jarvis/10"></div>
          </>
        )}
        
        {/* Activation flash */}
        {activationDetected && (
          <div className="absolute inset-0 rounded-full bg-jarvis/30 animate-pulse"></div>
        )}
        
        {isListening ? (
          <Mic className="w-5 h-5 text-jarvis animate-pulse" />
        ) : (
          <MicOff className="w-5 h-5 text-gray-400" />
        )}
        
        {/* Transcript display */}
        {transcript && (
          <div className="absolute -bottom-12 text-xs max-w-[200px] bg-black/60 px-3 py-1 rounded-full text-jarvis truncate">
            {transcript}
          </div>
        )}
      </button>
    </div>
  );
};

export default VoiceActivation;
