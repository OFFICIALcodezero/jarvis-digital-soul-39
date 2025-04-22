
import React from 'react';

interface VoiceActivationProps {
  onCommandReceived?: (command: string) => void;
  isListening?: boolean;
  toggleListening?: () => void;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({
  onCommandReceived,
  isListening,
  toggleListening
}) => {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isListening ? 'bg-[#33c3f0]/30 border-2 border-[#33c3f0]' : 'bg-black/30 border border-[#33c3f0]/30'
        }`}
      >
        <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-[#33c3f0] animate-pulse' : 'bg-[#33c3f0]/50'}`}></div>
      </button>
    </div>
  );
};

export default VoiceActivation;
