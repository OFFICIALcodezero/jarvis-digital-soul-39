
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useChatLogic } from '@/hooks/useChatLogic';
import { getDailyBriefing } from '@/services/dailyBriefingService';
import { checkImageMatchesPrompt } from '@/services/imagePromptChecker';
import { parseImageRequest } from "@/services/imagePromptParser";
import { GeneratedImage, generateImage } from '@/services/imageGenerationService';
import { processSkillCommand, isSkillCommand } from '@/services/skillsService';
import type { JarvisChatProps } from '@/types/chat';
import type { WeatherData } from '@/services/weatherService';
import type { NewsArticle } from '@/services/newsService';
import type { CalendarEvent } from '@/services/timeCalendarService';

interface ChatContextType {
  messages: ReturnType<typeof useChatLogic>['messages'];
  setMessages: ReturnType<typeof useChatLogic>['setMessages'];
  input: string;
  setInput: (input: string) => void;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  setIsSpeaking: (on: boolean) => void;
  isSpeaking: boolean;
  audioPlaying: boolean; // Added this property
  volume: number;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  isListening: boolean;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
  activeAssistant: 'jarvis';
  setActiveAssistant: (assistant: 'jarvis') => void;
  activeMode: 'normal' | 'voice' | 'face' | 'hacker';
  weatherData: WeatherData | null;
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  newsArticles: NewsArticle[];
  setNewsArticles: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  handleSendMessage: () => Promise<void>;
  handleImageGenerationFromPrompt: (prompt: string, isRefine?: boolean) => Promise<void>;
  handleRefineImage: (prevPrompt: string, refinement: string) => Promise<void>;
  setActiveImage: React.Dispatch<React.SetStateAction<GeneratedImage | null>>;
  activeImage: GeneratedImage | null;
  showDashboard: boolean;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useJarvisChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("JarvisChatContext must be within provider.");
  return ctx;
};

// Provider component that contains most logic from old JarvisChat
export const JarvisChatProvider: React.FC<{ children: React.ReactNode } & JarvisChatProps> = ({
  children,
  activeMode,
  setIsSpeaking,
  isListening: parentIsListening,
  activeAssistant,
  setActiveAssistant,
  inputMode,
  setInputMode
}) => {
  const [isSpeaking, _setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(80);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);

  const {
    messages,
    input,
    setInput,
    isTyping,
    currentTypingText,
    isProcessing,
    selectedLanguage,
    setSelectedLanguage,
    chatEndRef,
    processUserMessage,
    scrollToBottom,
    setMessages
  } = useChatLogic(activeMode, setIsSpeaking, activeAssistant, inputMode);

  const { speakText, stopSpeaking, setAudioVolume, isPlaying } = useVoiceSynthesis(activeMode);

  // Map isPlaying from useVoiceSynthesis to audioPlaying for the context
  const audioPlaying = isPlaying;

  useEffect(() => { scrollToBottom(); }, [messages, currentTypingText]);

  useEffect(() => { setAudioVolume(volume / 100); }, [volume, setAudioVolume]);

  const toggleMute = () => setVolume(prev => prev > 0 ? 0 : 80);

  // IMAGE LOGIC (factored for overlay/components)
  const handleRefineImage = async (prevPrompt: string, refinement: string) => {
    const newPrompt = `${prevPrompt}. ${refinement}`;
    await handleImageGenerationFromPrompt(newPrompt, true);
  };

  const handleImageGenerationFromPrompt = async (prompt: string, isRefine = false) => {
    const userMsg = {
      id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
      role: 'user' as const,
      content: prompt,
      timestamp: new Date()
    };
    let msgs = isRefine ? messages.filter(m => !m.generatedImage) : messages;
    setMessages([...msgs, userMsg]);
    setInput('');
    const loadingMsg = {
      id: (Date.now() + Math.floor(Math.random() * 1000) + 1).toString(),
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      generatedImage: {
        url: '',
        prompt,
        timestamp: new Date(),
        style: undefined,
        resolution: undefined
      } as GeneratedImage
    };
    setMessages(prev => [...prev, loadingMsg]);
    _setIsSpeaking(true);

    try {
      const params = parseImageRequest(prompt);
      const img = await generateImage(params);

      const matchesPrompt = checkImageMatchesPrompt(img);
      let responseText = matchesPrompt
        ? `Here is what I created for you. ${img.prompt}`
        : `Here's my attempt to create ${img.prompt}. If this doesn't match what you wanted, you can try again or refine the prompt.`;

      setMessages(msgsNow => [
        ...msgsNow.filter(m => !(m.generatedImage && m.generatedImage.url === '')),
        {
          id: (Date.now() + Math.floor(Math.random() * 1000) + 2).toString(),
          role: 'assistant' as const,
          content: '',
          timestamp: new Date(),
          generatedImage: img
        }
      ]);
      setActiveImage(img);

      await speakText(responseText);
    } catch (e) {
      console.error('Error generating image:', e);
      setMessages(msgsNow => [
        ...msgsNow.filter(m => !(m.generatedImage && m.generatedImage.url === '')),
        {
          id: (Date.now() + Math.floor(Math.random() * 1000) + 3).toString(),
          role: 'assistant' as const,
          content: "I'm sorry, I couldn't generate the image. Please try again.",
          timestamp: new Date()
        }
      ]);
    }
    _setIsSpeaking(false);
  };

  const memoValue = useMemo<ChatContextType>(() => ({
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    currentTypingText,
    isProcessing,
    selectedLanguage,
    setSelectedLanguage,
    chatEndRef,
    speakText,
    stopSpeaking,
    setIsSpeaking: _setIsSpeaking,
    isSpeaking,
    audioPlaying, // Added audioPlaying to the context value
    volume,
    setVolume,
    toggleMute,
    isListening: parentIsListening,
    inputMode,
    setInputMode,
    activeAssistant,
    setActiveAssistant,
    activeMode,
    weatherData,
    setWeatherData,
    newsArticles,
    setNewsArticles,
    calendarEvents,
    setCalendarEvents,
    handleSendMessage: async () => {
      // moved from JarvisChat, preserve signature
      if (!input.trim()) return;

      // Direct image prompt detection
      const isDirectImagePrompt = (msg: string) => {
        const lower = msg.toLowerCase();
        return (
          lower.startsWith('generate an image') ||
          lower.startsWith('generate a image') ||
          lower.startsWith('generate image') ||
          lower.startsWith('create an image') ||
          lower.startsWith('create image') ||
          lower.startsWith('draw') ||
          lower.startsWith('make an image') ||
          lower.startsWith('show me') ||
          lower.startsWith('paint') ||
          lower.startsWith('illustrate') ||
          /image of|image about/.test(lower) ||
          (lower.includes('picture') && (lower.includes('generate') || lower.includes('create') || lower.includes('show')))
        );
      };

      if (isDirectImagePrompt(input)) {
        await handleImageGenerationFromPrompt(input);
        return;
      }

      let result;
      if (isSkillCommand(input)) {
        const skillResponse = await processSkillCommand(input);

        const userMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content: input,
          timestamp: new Date(),
        };

        if (skillResponse.skillType === "image" && skillResponse.data) {
          setMessages(prev => [
            ...prev,
            userMessage,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "",
              timestamp: new Date(),
              generatedImage: skillResponse.data,
            }
          ]);
          setInput("");
          setActiveImage(skillResponse.data);

          _setIsSpeaking(true);
          await speakText(
            `Here is the image I created based on your prompt: ${skillResponse.data.prompt}`
          );
          _setIsSpeaking(false);
          return;
        }
        if (skillResponse.skillType === 'weather' && skillResponse.data) {
          setWeatherData(skillResponse.data);
        } else if (skillResponse.skillType === 'news' && skillResponse.data) {
          setNewsArticles(skillResponse.data);
        } else if (skillResponse.skillType === 'calendar' && skillResponse.data && skillResponse.data.events) {
          setCalendarEvents(skillResponse.data.events);
        } else if (skillResponse.skillType === 'briefing' && skillResponse.data) {
          if (skillResponse.data.weather) {
            setWeatherData({
              location: skillResponse.data.weather.location,
              current: {
                temp: skillResponse.data.weather.temperature,
                condition: skillResponse.data.weather.condition,
                icon: 'cloud-sun',
                humidity: 60,
                windSpeed: 5
              },
              forecast: [{
                date: 'Today',
                maxTemp: skillResponse.data.weather.temperature + 5,
                minTemp: skillResponse.data.weather.temperature - 5,
                condition: skillResponse.data.weather.forecast,
                icon: 'cloud-sun'
              },
              {
                date: 'Tomorrow',
                maxTemp: 75,
                minTemp: 65,
                condition: 'Partly Cloudy',
                icon: 'cloud-sun'
              },
              {
                date: 'Wednesday',
                maxTemp: 77,
                minTemp: 64,
                condition: 'Sunny',
                icon: 'sun'
              },
              {
                date: 'Thursday',
                maxTemp: 72,
                minTemp: 62,
                condition: 'Rain',
                icon: 'cloud-rain'
              }]
            });
          }
          if (skillResponse.data.news) {
            setNewsArticles(skillResponse.data.news.map((item: any, index: number) => ({
              title: item.topHeadline,
              source: item.source,
              summary: item.topHeadline,
              category: index === 0 ? 'technology' : index === 1 ? 'world' : 'science',
              publishedAt: new Date().toISOString()
            })));
          }
          if (skillResponse.data.calendar && skillResponse.data.calendar.nextEvent) {
            setCalendarEvents([{
              title: skillResponse.data.calendar.nextEvent.title,
              time: skillResponse.data.calendar.nextEvent.time,
              date: new Date().toLocaleDateString()
            }]);
          }
        } else if (skillResponse.skillType === 'image' && skillResponse.data) {
          setActiveImage(skillResponse.data);
        }
        result = {
          shouldSpeak: skillResponse.shouldSpeak,
          text: skillResponse.text,
        };
      } else {
        result = await processUserMessage(input);
      }
      setInput("");
      if (result?.shouldSpeak) {
        _setIsSpeaking(true);
        await speakText(result.text);
        _setIsSpeaking(false);
      }
    },
    handleImageGenerationFromPrompt,
    handleRefineImage,
    setActiveImage,
    activeImage,
    showDashboard,
    setShowDashboard,
  }), [
    messages, setMessages, input, setInput, isTyping, currentTypingText, isProcessing, selectedLanguage,
    setSelectedLanguage, chatEndRef, speakText, stopSpeaking, _setIsSpeaking, isSpeaking, audioPlaying, // Added audioPlaying to the dependencies
    volume, setVolume, toggleMute, parentIsListening, inputMode, setInputMode, activeAssistant, setActiveAssistant, activeMode,
    weatherData, setWeatherData, newsArticles, setNewsArticles, calendarEvents, setCalendarEvents, activeImage,
    showDashboard, setShowDashboard
  ]);

  return (
    <ChatContext.Provider value={memoValue}>
      {children}
    </ChatContext.Provider>
  );
};
