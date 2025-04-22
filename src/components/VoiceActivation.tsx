
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

        // Check for trigger phrase
        if (currentTranscript.toLowerCase().includes('hey jarvis')) {
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
    }
  }, [onCommandReceived, isListening, toggleListening]);

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

  return (
    <div className="relative">
      <button 
        onClick={toggleListening}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full ${
          isListening ? 'bg-cyan-900/50' : 'bg-slate-800/50'
        } transition-all duration-300 border border-cyan-500/30 group`}
      >
        <div className={`absolute inset-0 rounded-full ${
          isListening ? 'animate-ping-slow bg-cyan-600/20' : ''
        }`}></div>
        
        {isListening ? (
          <Mic className="w-6 h-6 text-cyan-400 animate-pulse" />
        ) : (
          <MicOff className="w-6 h-6 text-slate-400" />
        )}
        
        <div className={`absolute -bottom-12 text-xs ${
          transcript ? 'opacity-100' : 'opacity-0'
        } transition-opacity text-cyan-300 max-w-[200px] truncate`}>
          {transcript}
        </div>
      </button>
    </div>
  );
};

export default VoiceActivation;
