
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string | number;
  content?: string;
  text?: string;
  role?: Role;
  sender?: 'user' | 'jarvis' | 'system';
  timestamp: Date;
  data?: any;
  skillType?: string;
  generatedImage?: any;
}

export interface MessageSuggestion {
  id: string;
  text: string;
  onClick?: () => void;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface JarvisChatProps {
  activeMode?: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite';
  setIsSpeaking?: (isSpeaking: boolean) => void;
  isListening?: boolean;
  activeAssistant?: string;
  setActiveAssistant?: (assistant: string) => void;
  inputMode?: 'voice' | 'text';
  setInputMode?: (mode: 'voice' | 'text') => void;
  onMessageCheck?: (message: string) => boolean;
  hackerModeActive?: boolean;
}
