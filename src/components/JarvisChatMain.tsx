
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
    if (inputMode === 'voice' && transcript && !isProcessing && !isSpeaking) {
      const processedTranscript = transcript.trim();
      
      if (processedTranscript) {
        console.log("Processing voice input:", processedTranscript);
        
        // Check for wake word (case insensitive)
        const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(processedTranscript);
        
        if (hasWakeWord) {
          console.log("Wake word detected, sending message:", processedTranscript);
          sendMessage(processedTranscript);
          clearTranscript();
          
          // Brief pause in listening while processing to avoid feedback loops
          stopListening();
          setTimeout(() => {
            if (inputMode === 'voice') {
              startListening();
            }
          }, 1000);
        } else {
          console.log("No wake word detected in:", processedTranscript);
        }
      }
    }
  }, [transcript, inputMode, isProcessing, isSpeaking, sendMessage, clearTranscript, startListening, stopListening]);

  // Start listening automatically when in voice mode
  useEffect(() => {
    if (inputMode === 'voice' && !isListening && !isProcessing) {
      console.log("Starting voice listening automatically");
      startListening();
    }
    
    // Clean up when component unmounts or mode changes
    return () => {
      if (isListening) {
        console.log("Stopping voice recognition on cleanup");
        stopListening();
      }
    };
  }, [inputMode, isListening, isProcessing, startListening, stopListening]);

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

  const toggleListeningHandler = () => {
    if (isListening) {
      console.log("Manually stopping voice recognition");
      stopListening();
    } else {
      console.log("Manually starting voice recognition");
      clearTranscript();
      startListening();
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
      toggleListening={toggleListeningHandler}
    />
  );
};

export default JarvisChatMain;
