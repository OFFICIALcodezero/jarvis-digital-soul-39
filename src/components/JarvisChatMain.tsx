
import React from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChatContext } from "./JarvisChatContext";

const JarvisChatMain: React.FC = () => {
  const {
    messages, input, setInput, isTyping, currentTypingText, isProcessing,
    selectedLanguage, setSelectedLanguage, audioPlaying, volume, setVolume,
    stopSpeaking, toggleMute, isListening, activeAssistant, inputMode, setInputMode, handleSendMessage
  } = useJarvisChatContext();

  // Enhanced suggestions with more image generation examples
  const getSuggestions = (): string[] => [
    "What's the weather like today?",
    "Tell me the latest news",
    "What time is it?",
    "What's on my schedule today?",
    "Generate an image of a sunset over mountains",
    "Create an image of a futuristic robot",
    "Draw a magical forest with glowing mushrooms",
    "Show me an image of a disco-dancing fish in neon colors",
    "Generate a cyberpunk city at night"
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
