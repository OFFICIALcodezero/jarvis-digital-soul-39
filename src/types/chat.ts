
import { GeneratedImage } from '@/services/imageGenerationService';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  generatedImage?: GeneratedImage;
  data?: any;
  skillType?: string;
}

export interface MessageSuggestion {
  id: string;
  text: string;
}

export interface JarvisChatProps {
  activeMode: 'normal' | 'voice' | 'face' | 'hacker';
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  activeAssistant: string;
  setActiveAssistant: (assistant: string) => void;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
  onMessageCheck?: (message: string) => boolean;
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

export interface GeneratedImageData {
  url: string;
  prompt: string;
  timestamp: Date;
  style?: string;
  resolution?: string;
}
