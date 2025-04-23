
import React from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChatContext } from "./JarvisChatContext";

const JarvisChatMain: React.FC = () => {
  const {
    messages, input, setInput, isTyping, currentTypingText, isProcessing,
    selectedLanguage, setSelectedLanguage, audioPlaying, volume, setVolume,
    stopSpeaking, toggleMute, isListening, activeAssistant, inputMode, setInputMode, handleSendMessage
  } = useJarvisChatContext();

  // For now, always pass getSuggestions inline
  const getSuggestions = (): string[] => [
    "What's the weather like today?",
    "Tell me the latest news",
    "What time is it?",
    "What's on my schedule today?",
    "Generate an image of a sunset over mountains",
    "Create an image of a futuristic robot"
  ];

  return (
    <ChatLayout
      messages={messages}
      input={input}
      setInput={setInput}
      isTyping={isTyping}
      currentTypingText={currentTypingText}
      isProcessing={isProcessing}
      selectedLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
      audioPlaying={audioPlaying}
      volume={volume}
      onVolumeChange={values => setVolume(values[0])}
      stopSpeaking={stopSpeaking}
      toggleMute={toggleMute}
      isListening={isListening}
      activeAssistant={activeAssistant}
      inputMode={inputMode}
      setInputMode={setInputMode}
      handleSendMessage={handleSendMessage}
      getSuggestions={getSuggestions}
    />
  );
};

export default JarvisChatMain;
