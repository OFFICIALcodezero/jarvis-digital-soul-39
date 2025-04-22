
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
  activeAssistant: 'jarvis';
  setActiveAssistant: (assistant: 'jarvis') => void;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
}

export interface LanguageOption {
  code: string;
  name: string;
}

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

export interface AudioControlsProps {
  volume: number;
  audioPlaying: boolean;
  stopSpeaking: () => void;
  toggleMute: () => void;
  onVolumeChange: (values: number[]) => void;
  isMicActive: boolean;
  onMicToggle: () => void;
  inputMode: 'voice' | 'text';
  onInputModeChange: (mode: 'voice' | 'text') => void;
}

export interface UserPreference {
  name?: string;
  interests?: string[];
  lastInteractions?: { topic: string, timestamp: Date }[];
}

export interface ConversationContext {
  recentTopics: string[];
  userPreferences: UserPreference;
  sessionStartTime: Date;
}
