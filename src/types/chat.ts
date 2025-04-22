
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface JarvisChatProps {
  activeMode: 'normal' | 'voice' | 'face' | 'hacker';
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface ChatModeProps {
  messages: Message[];
  speakText: (text: string) => void;
  audioPlaying: boolean;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
}
