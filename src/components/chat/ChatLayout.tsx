
import React from 'react';
import { Message } from '@/types/chat';
import ChatMode from './ChatMode';
import AudioControls from './AudioControls';
import MessageInput from './MessageInput';
import MessageSuggestions from './MessageSuggestions';
import { AssistantType } from '@/pages/JarvisInterface';

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  audioPlaying: boolean;
  volume: number;
  onVolumeChange: (values: number[]) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
  isListening: boolean;
  activeAssistant: AssistantType;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
  handleSendMessage: () => void;
  getSuggestions: () => string[];
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  input,
  setInput,
  isTyping,
  currentTypingText,
  isProcessing,
  selectedLanguage,
  onLanguageChange,
  audioPlaying,
  volume,
  onVolumeChange,
  stopSpeaking,
  toggleMute,
  isListening,
  activeAssistant,
  inputMode,
  setInputMode,
  handleSendMessage,
  getSuggestions
}) => {
  const chatModeProps = {
    messages,
    speakText: async () => {},
    audioPlaying,
    isTyping,
    currentTypingText,
    isProcessing,
    selectedLanguage,
    onLanguageChange
  };

  const audioControlsProps = {
    volume,
    audioPlaying,
    stopSpeaking,
    toggleMute,
    onVolumeChange,
    isMicActive: isListening,
    onMicToggle: () => {},
    inputMode,
    onInputModeChange: setInputMode
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatMode {...chatModeProps} />
      
      {!isProcessing && messages.length < 3 && (
        <MessageSuggestions 
          suggestions={getSuggestions()} 
          onSuggestionClick={text => {
            setInput(text);
            handleSendMessage();
          }}
        />
      )}
      
      <div className="p-3 bg-black/30 border-t border-jarvis/20">
        <AudioControls {...audioControlsProps} />
      </div>
      
      <MessageInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        isListening={isListening}
      />
    </div>
  );
};

export default ChatLayout;
