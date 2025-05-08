
import React from 'react';
import { AssistantType } from '@/pages/JarvisInterface';
import VoiceActivation from '@/components/VoiceActivation';
import JarvisCentralCore from '@/components/JarvisCentralCore';
import JarvisChat from '@/components/JarvisChat';
import HackerMode from '@/components/chat/HackerMode';

interface JarvisMainLayoutProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: 'normal' | 'voice' | 'face';
  hackerModeActive: boolean;
  mode: 'chat' | 'hacker';
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
  deactivateHackerMode: () => void;
  toggleListening: () => void;
  activeAssistant: AssistantType;
  handleAssistantChange: (assistant: string) => void;
  inputMode: 'voice' | 'text';
  setInputMode: React.Dispatch<React.SetStateAction<'voice' | 'text'>>;
  handleMessageCheck: (message: string) => boolean;
}

const JarvisMainLayout: React.FC<JarvisMainLayoutProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
  activeMode,
  hackerModeActive,
  mode,
  hackerOutput,
  setHackerOutput,
  deactivateHackerMode,
  toggleListening,
  activeAssistant,
  handleAssistantChange,
  inputMode,
  setInputMode,
  handleMessageCheck
}) => {
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 z-10">
      <div className="lg:w-1/3 order-2 lg:order-1">
        <div className={`${hackerModeActive ? 'bg-black/40 border-red-500/20' : 'glass-morphism'} p-4 rounded-2xl h-full flex flex-col`}>
          <JarvisCentralCore 
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            activeMode={hackerModeActive ? 'hacker' : activeMode}
          />
          <div className="mt-4">
            <VoiceActivation 
              isListening={isListening}
              toggleListening={toggleListening}
              isSpeaking={isSpeaking}
              hackerMode={hackerModeActive}
            />
          </div>
        </div>
      </div>
      
      <div className="lg:w-2/3 order-1 lg:order-2">
        {hackerModeActive && mode === 'hacker' ? (
          <div className="h-full rounded-xl overflow-hidden border border-red-500/30">
            <HackerMode 
              hackerOutput={hackerOutput}
              setHackerOutput={setHackerOutput}
              onDeactivate={deactivateHackerMode}
            />
          </div>
        ) : (
          <JarvisChat 
            activeMode={activeMode}
            setIsSpeaking={value => typeof value === 'function' ? value(isSpeaking) : value}
            isListening={isListening}
            activeAssistant={activeAssistant}
            setActiveAssistant={handleAssistantChange}
            inputMode={inputMode}
            setInputMode={setInputMode}
            onMessageCheck={handleMessageCheck}
            hackerModeActive={hackerModeActive} 
            hackerOutput={hackerOutput}
            setHackerOutput={setHackerOutput}
            onDeactivateHacker={deactivateHackerMode}
          />
        )}
      </div>
    </div>
  );
};

export default JarvisMainLayout;
