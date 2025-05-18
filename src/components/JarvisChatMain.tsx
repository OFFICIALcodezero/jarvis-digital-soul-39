
import React, { useState, useEffect, useRef } from "react";
import ChatMode from "./chat/ChatMode";
import MessageInput from "./chat/MessageInput";
import { useJarvisChat } from "./JarvisChatContext";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface JarvisChatMainProps {
  hackerMode?: boolean;
  detectedEmotion?: string;
  detectedAge?: number | null;
  detectedGender?: string | null;
  detectedObjects?: Array<{ class: string; confidence: number }>;
}

const JarvisChatMain: React.FC<JarvisChatMainProps> = ({ 
  hackerMode = false, 
  detectedEmotion,
  detectedAge,
  detectedGender,
  detectedObjects
}) => {
  const {
    messages, 
    sendMessage, 
    isGeneratingImage,
    handleImageGenerationFromPrompt,
    isProcessing: contextIsProcessing,
    activeAssistant,
    inputMode, 
    setInputMode,
    isSpeaking,
    isListening
  } = useJarvisChat();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const { 
    startListening, 
    stopListening,
    transcript, 
    listening: speechRecognitionActive,
    clearTranscript,
    resetTranscript
  } = useSpeechRecognition({ continuous: true });
  
  // Sync speech recognition transcript with input
  useEffect(() => {
    if (transcript && speechRecognitionActive) {
      setInput(transcript);
    }
  }, [transcript, speechRecognitionActive]);
  
  // Effects for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Set audio playing state based on context
  useEffect(() => {
    setAudioPlaying(isSpeaking);
  }, [isSpeaking]);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async () => {
    if (input.trim() === "" || contextIsProcessing || isGeneratingImage) return;
    
    // Clear input and transcript
    const message = input;
    setInput("");
    resetTranscript();
    
    // Check if it's an image generation request
    if (message.toLowerCase().includes("generate an image") || 
        message.toLowerCase().includes("create an image") ||
        message.toLowerCase().includes("make an image")) {
      await handleImageGenerationFromPrompt(message);
      return;
    }
    
    // Send regular message
    await sendMessage(message);
    
    // Simulate typing effect for demo (in a real app this would come from the backend)
    simulateTypingResponse(message);
  };
  
  const simulateTypingResponse = (message: string) => {
    setIsTyping(true);
    setCurrentTypingText("");
    
    const responses = [
      `I understand you're asking about "${message.substring(0, 20)}...". Let me process that for you.`,
      `Processing your request about "${message.substring(0, 15)}...". One moment please.`,
      `Analyzing your question on "${message.substring(0, 25)}...". Working on it now.`
    ];
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    let i = 0;
    
    const typingInterval = setInterval(() => {
      if (i < selectedResponse.length) {
        setCurrentTypingText(prev => prev + selectedResponse.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsTyping(false);
        }, 500);
      }
    }, 20);
  };
  
  const handleToggleListening = () => {
    if (speechRecognitionActive) {
      stopListening();
      // If there's transcript content when stopping, send it as a message
      if (transcript.trim()) {
        setInput(transcript);
        setTimeout(() => {
          handleSendMessage();
        }, 300);
      }
    } else {
      clearTranscript();
      startListening();
    }
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleImageUploadRequest = () => {
    const imagePrompt = "I'd like to generate an image of a futuristic city.";
    setInput(imagePrompt);
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };
  
  const isProcessing = contextIsProcessing || isGeneratingImage;

  return (
    <>
      <ChatMode 
        messages={messages}
        isTyping={isTyping}
        currentTypingText={currentTypingText}
        isProcessing={isProcessing && !isTyping}
        hackerMode={hackerMode}
        audioPlaying={audioPlaying && !isMuted}
      />
      
      <MessageInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        isListening={speechRecognitionActive}
        onToggleListen={handleToggleListening}
        audioPlaying={audioPlaying}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
        onImageUpload={handleImageUploadRequest}
        hackerMode={hackerMode}
      />
      
      <div ref={chatEndRef} />
    </>
  );
};

export default JarvisChatMain;
