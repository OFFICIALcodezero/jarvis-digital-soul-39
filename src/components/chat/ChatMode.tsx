
import React from "react";
import { Message } from "@/types/chat";
import GeneratedImageCard from "./GeneratedImageCard";

export interface ChatModeProps {
  messages: Message[];
  speakText: (text: string) => Promise<void>;
  audioPlaying: boolean;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

const ChatMode: React.FC<ChatModeProps> = ({
  messages,
  isTyping,
  currentTypingText,
  isProcessing,
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="jarvis-panel flex-1 flex flex-col overflow-auto bg-black/20 p-4 relative">
      {/* Messages container */}
      <div className="flex-1 space-y-4 overflow-auto relative z-10">
        {messages.map((message) => {
          // If the message has a generated image, render the image card inside the chat conversation
          if ((message as any).generatedImage) {
            return (
              <div key={message.id} className="flex justify-start">
                <div className="w-full max-w-[80%]">
                  <div className="bg-jarvis/5 p-2 rounded-t-lg rounded-b-none border border-jarvis/10">
                    <span className="text-jarvis text-xs">
                      Here is the image I created based on your prompt:
                    </span>
                  </div>
                  <GeneratedImageCard image={(message as any).generatedImage} />
                </div>
              </div>
            );
          }
          // Default message rendering
          return (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                    ? "bg-jarvis/20 text-white"
                    : "bg-jarvis/10 text-jarvis"
                  }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-jarvis/10 text-jarvis">
              {currentTypingText}
              <span className="animate-ping">_</span>
            </div>
          </div>
        )}
        {isProcessing && !isTyping && (
          <div className="flex justify-center">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-jarvis/50 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-jarvis/50 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-jarvis/50 animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMode;
