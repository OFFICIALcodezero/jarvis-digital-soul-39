
import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceActivationProps {
  onCommandReceived?: (command: string) => void;
  isListening?: boolean;
  toggleListening?: () => void;
  isSpeaking?: boolean;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({
  onCommandReceived,
  isListening,
  toggleListening,
  isSpeaking
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isListening ? 'bg-[#33c3f0]/30 border-2 border-[#33c3f0]' : 'bg-black/30 border border-[#33c3f0]/30'
        }`}
      >
        {isListening ? (
          <Mic className="h-6 w-6 text-[#33c3f0] animate-pulse" />
        ) : (
          <MicOff className="h-6 w-6 text-[#33c3f0]/50" />
        )}
      </button>
      
      {isSpeaking && (
        <div className="flex items-center space-x-1 mt-2">
          <div className="h-1 w-1 bg-[#33c3f0] rounded-full animate-pulse"></div>
          <div className="h-1 w-1 bg-[#33c3f0] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-1 w-1 bg-[#33c3f0] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      
      <div className="text-xs text-[#33c3f0]/70">
        {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Click to activate"}
      </div>
    </div>
  );
};

export default VoiceActivation;
