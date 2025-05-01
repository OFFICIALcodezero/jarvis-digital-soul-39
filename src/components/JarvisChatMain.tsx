import React, { useState } from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChat } from "./JarvisChatContext";

interface JarvisChatMainProps {
  hackerMode?: boolean;
}

const JarvisChatMain: React.FC<JarvisChatMainProps> = ({ hackerMode = false }) => {
  const {
    messages, 
    sendMessage, 
    isProcessing,
    activeAssistant,
    inputMode, 
    setInputMode
  } = useJarvisChat();
  
  const [input, setInput] = useState("");
  const isTyping = false;
  const currentTypingText = "";
  const selectedLanguage = "en";
  const setSelectedLanguage = () => {};
  const audioPlaying = false;
  const [volume, setVolume] = useState(80);
  const stopSpeaking = () => {};
  const toggleMute = () => {};
  const isListening = false;

  // Enhanced suggestions with more image generation examples
  const getSuggestions = (): string[] => {
    if (hackerMode) {
      return [
        "Analyze network vulnerabilities",
        "Decrypt secure communications",
        "Access mainframe security protocols",
        "Trace IP location",
        "Run system diagnostics",
        "Deploy countermeasures",
        "Activate stealth protocols",
        "Scan for surveillance",
        "Deploy network firewall",
        "Deactivate hacker mode"
      ];
    }
    
    return [
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
  };

  const handleSendMessage = () => {
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput("");
    }
  };

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
      activeAssistant={activeAssistant as any}
      inputMode={inputMode}
      setInputMode={setInputMode}
      handleSendMessage={handleSendMessage}
      getSuggestions={getSuggestions}
      hackerMode={hackerMode}
    />
  );
};

export default JarvisChatMain;
