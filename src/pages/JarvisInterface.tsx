
import React from 'react';
import { Bot } from 'lucide-react';
import JarvisHeader from '@/components/interface/JarvisHeader';
import JarvisMainLayout from '@/components/interface/JarvisMainLayout';
import JarvisControlBar from '@/components/interface/JarvisControlBar';
import JarvisBackground from '@/components/interface/JarvisBackground';
import { useControlOptions } from '@/components/interface/JarvisControlOptions';
import { useJarvisSystem } from '@/hooks/useJarvisSystem';
import { useIsMobile } from '@/hooks/use-mobile';
import JarvisCore from '@/components/JarvisCore';
import JarvisVoiceCommands from '@/components/JarvisVoiceCommands';
import VoiceCommandIntegration from '@/features/VoiceCommandIntegration';

export type AssistantType = 'jarvis';

const JarvisInterface = () => {
  const {
    mode,
    activeMode,
    isSpeaking,
    setIsSpeaking,
    isListening,
    isProcessing,
    activeAssistant,
    inputMode,
    setInputMode,
    hackerOutput,
    setHackerOutput,
    isMuted,
    hackerModeActive,
    handleToggleMode,
    toggleMute,
    handleMessageCheck,
    activateHackerMode,
    deactivateHackerMode,
    toggleListening,
    handleAssistantChange,
  } = useJarvisSystem();
  
  const isMobile = useIsMobile();
  
  // Get control options based on current state
  const controlOptions = useControlOptions({ 
    activeMode, 
    hackerModeActive 
  });
  
  return (
    <div className={`relative min-h-screen flex flex-col ${hackerModeActive ? 'hacker-mode' : 'bg-jarvis-bg'} text-white overflow-hidden`}>
      <JarvisBackground hackerModeActive={hackerModeActive} />
      
      {/* Core components responsible for system functionality */}
      <JarvisCore />
      <JarvisVoiceCommands 
        isListening={isListening} 
        hackerModeActive={hackerModeActive}
        onActivateHacker={activateHackerMode}
      />
      <VoiceCommandIntegration isActive={isListening} />
      
      <JarvisHeader 
        hackerModeActive={hackerModeActive} 
        activeAssistant={activeAssistant} 
        toggleMute={toggleMute} 
        isMuted={isMuted} 
      />

      <JarvisMainLayout 
        isSpeaking={isSpeaking}
        isListening={isListening}
        isProcessing={isProcessing}
        activeMode={activeMode}
        hackerModeActive={hackerModeActive}
        mode={mode}
        hackerOutput={hackerOutput}
        setHackerOutput={setHackerOutput}
        deactivateHackerMode={deactivateHackerMode}
        toggleListening={toggleListening}
        activeAssistant={activeAssistant}
        handleAssistantChange={handleAssistantChange}
        inputMode={inputMode}
        setInputMode={setInputMode}
        handleMessageCheck={handleMessageCheck}
      />
      
      <JarvisControlBar 
        controlOptions={controlOptions} 
        onToggle={handleToggleMode} 
      />
    </div>
  );
};

export default JarvisInterface;
