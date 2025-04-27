
import React from "react";
import { Message } from "@/types/chat";
import GeneratedImageCard from "./GeneratedImageCard";
import ModelViewer3D from "../ModelViewer3D";

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
}) => {
  return (
    <div className="jarvis-panel flex-1 flex flex-col overflow-auto bg-black/20 p-4">
      <div className="flex-1 space-y-4 overflow-auto">
        {messages.map((message) => {
          // Check for model display data with type assertion
          if ((message as any).data?.showModel) {
            return (
              <div key={message.id} className="flex justify-start">
                <div className="w-full max-w-[80%]">
                  <div className="bg-jarvis/5 p-2 rounded-t-lg rounded-b-none border border-jarvis/10">
                    <span className="text-jarvis text-xs">
                      Holographic projection initialized:
                    </span>
                  </div>
                  <ModelViewer3D />
                </div>
              </div>
            );
          }
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
