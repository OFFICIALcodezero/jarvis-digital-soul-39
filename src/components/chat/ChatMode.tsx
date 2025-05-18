
import React from "react";
import { Message } from "@/types/chat";
import GeneratedImageCard from "./GeneratedImageCard";
import HologramMessage from "./HologramMessage";
import JarvisVisualizer from "../JarvisVisualizer";

export interface ChatModeProps {
  messages: Message[];
  speakText?: (text: string) => Promise<void>;
  audioPlaying?: boolean;
  isTyping?: boolean;
  currentTypingText?: string;
  isProcessing?: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  hackerMode?: boolean;
}

const ChatMode: React.FC<ChatModeProps> = ({
  messages,
  isTyping = false,
  currentTypingText = '',
  isProcessing = false,
  selectedLanguage = 'en',
  onLanguageChange = () => {},
  hackerMode = false,
  audioPlaying = false
}) => {
  return (
    <div className={`jarvis-panel flex-1 flex flex-col overflow-auto ${hackerMode ? 'hacker-terminal hacker-grid' : 'bg-black/20'} p-4 relative`}>
      {/* Messages container */}
      <div className="flex-1 space-y-4 overflow-auto relative z-10 pb-8">
        {messages.map((message) => {
          // If the message has a generated image, render the image card inside the chat conversation
          if ((message as any).generatedImage) {
            return (
              <div key={message.id} className="flex justify-start">
                <div className="w-full max-w-[80%]">
                  <div className={`${hackerMode ? 'bg-transparent border-red-500/30' : 'bg-transparent border-jarvis/10'} p-2 rounded-t-lg rounded-b-none border`}>
                    <span className={`${hackerMode ? 'hacker-text' : 'text-white'} text-xs`}>
                      Here is the image I created based on your prompt:
                    </span>
                  </div>
                  <GeneratedImageCard image={(message as any).generatedImage} />
                </div>
              </div>
            );
          }
          
          // Use the new HologramMessage component for regular messages
          return (
            <HologramMessage
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
              hackerMode={hackerMode}
              isSpeaking={message.role === 'assistant' && audioPlaying}
            />
          );
        })}
        
        {/* Currently typing message */}
        {isTyping && (
          <HologramMessage
            message={{ id: 'typing', role: 'assistant', content: currentTypingText, timestamp: new Date() }}
            isUser={false}
            isTyping={true}
            currentTypingText={currentTypingText}
            hackerMode={hackerMode}
          />
        )}
        
        {/* Processing indicator */}
        {isProcessing && !isTyping && (
          <div className="flex justify-center my-4">
            <div className="flex space-x-2 items-center">
              <div className={`w-2 h-2 rounded-full ${hackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse`}></div>
              <div className={`w-2 h-2 rounded-full ${hackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse delay-75`}></div>
              <div className={`w-2 h-2 rounded-full ${hackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse delay-150`}></div>
            </div>
          </div>
        )}
        
        {/* Audio visualizer when speaking */}
        {audioPlaying && (
          <div className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-[500px] px-4">
            <JarvisVisualizer 
              isActive={audioPlaying} 
              complexity="advanced"
              className="h-20"
              color={hackerMode ? "rgba(255, 60, 60, 0.8)" : "rgba(51, 195, 240, 0.8)"}
            />
          </div>
        )}
      </div>
      
      {/* Hacker mode overlay elements */}
      {hackerMode && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scan line effect */}
          <div className="hacker-scan-line"></div>
          
          {/* Random code characters floating in background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-red-500 matrix-char"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              >
                {['0', '1', '{', '}', '>', '<', '/', '$', '#', '@'][Math.floor(Math.random() * 10)]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMode;
