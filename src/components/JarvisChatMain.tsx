
import React, { useState, useEffect } from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChat } from "./JarvisChatContext";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

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
    setInputMode,
    isSpeaking
  } = useJarvisChat();
  
  const [input, setInput] = useState("");
  const isTyping = false;
  const currentTypingText = "";
  const selectedLanguage = "en";
  const setSelectedLanguage = () => {};
  const audioPlaying = isSpeaking;
  const [volume, setVolume] = useState(80);
  const stopSpeaking = () => {};
  const toggleMute = () => {};
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();
  
  // Process voice input when in voice mode
  useEffect(() => {
    if (inputMode === 'voice' && transcript && !isProcessing) {
      // Check for wake word
      const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(transcript);
      
      if (hasWakeWord) {
        console.log("Processing voice command:", transcript);
        sendMessage(transcript);
        clearTranscript();
      }
    }
  }, [transcript, inputMode, isProcessing, sendMessage, clearTranscript]);

  // Return empty array for suggestions
  const getSuggestions = (): string[] => {
    return [];
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
