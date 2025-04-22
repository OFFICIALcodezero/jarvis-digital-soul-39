import React, { useState, useEffect } from 'react';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { JarvisChatProps } from '@/types/chat';
import HackerMode from './chat/HackerMode';
import ChatLayout from './chat/ChatLayout';
import FaceRecognition from './FaceRecognition';
import { useChatLogic } from '@/hooks/useChatLogic';
import JarvisDashboard from './JarvisDashboard';
import { processSkillCommand, isSkillCommand } from '@/services/skillsService';
import { WeatherData } from '@/services/weatherService';
import { NewsArticle } from '@/services/newsService';
import { CalendarEvent } from '@/services/timeCalendarService';
import { getDailyBriefing } from '@/services/dailyBriefingService';
import ImageGenerationWidget from './widgets/ImageGenerationWidget';
import { GeneratedImage } from '@/services/imageGenerationService';

const JarvisChat: React.FC<JarvisChatProps> = ({
  activeMode,
  setIsSpeaking,
  isListening: parentIsListening,
  activeAssistant,
  setActiveAssistant,
  inputMode,
  setInputMode
}) => {
  const [hackerOutput, setHackerOutput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [pendingImagePrompt, setPendingImagePrompt] = useState<string>('');

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

  const { speakText, stopSpeaking, setAudioVolume, isPlaying, voices, selectedVoice, setSelectedVoice } = useVoiceSynthesis(activeMode);

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  useEffect(() => {
    setAudioVolume(volume / 100);
  }, [volume, setAudioVolume]);

  useEffect(() => {
    if (activeMode !== 'hacker') {
      playDailyBriefing();
    }
  }, [activeMode]);

  const playDailyBriefing = async () => {
    try {
      const { text, briefing } = await getDailyBriefing();
      
      if (briefing) {
        if (briefing.weather) {
          setWeatherData({
            location: briefing.weather.location,
            current: {
              temp: briefing.weather.temperature,
              condition: briefing.weather.condition,
              icon: 'cloud-sun',
              humidity: 60,
              windSpeed: 5
            },
            forecast: [
              {
                date: 'Today',
                maxTemp: briefing.weather.temperature + 5,
                minTemp: briefing.weather.temperature - 5,
                condition: briefing.weather.forecast,
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
              }
            ]
          });
        }
        
        if (briefing.news) {
          setNewsArticles(briefing.news.map((item, index) => ({
            title: item.topHeadline,
            source: item.source,
            summary: item.topHeadline,
            category: index === 0 ? 'technology' : index === 1 ? 'world' : 'science',
            publishedAt: new Date().toISOString()
          })));
        }
        
        if (briefing.calendar && briefing.calendar.nextEvent) {
          setCalendarEvents([
            {
              title: briefing.calendar.nextEvent.title,
              time: briefing.calendar.nextEvent.time,
              date: new Date().toLocaleDateString()
            }
          ]);
        }
      }
      
      const briefingMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: text,
        timestamp: new Date()
      };
      
      setIsSpeaking(true);
      await speakText(text);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error playing daily briefing:', error);
    }
  };

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 80);
  };

  const getSuggestions = (): string[] => {
    return [
      "What's the weather like today?",
      "Tell me the latest news",
      "What time is it?",
      "What's on my schedule today?",
      "Generate an image of a sunset over mountains",
      "Create an image of a futuristic robot"
    ];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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
        const updatedMessages = [...messages, userMessage];
        
        updatedMessages.push({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          generatedImage: skillResponse.data,
        });
        
        setMessages(updatedMessages);
        setInput("");
        setShowImageGenerator(false);

        setIsSpeaking(true);
        await speakText(
          `Here is the image I created based on your prompt: ${skillResponse.data.prompt}`
        );
        setIsSpeaking(false);
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
        setGeneratedImage(skillResponse.data);
        setShowImageGenerator(true);
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
      setAudioPlaying(true);
      setIsSpeaking(true);
      await speakText(result.text);
      setAudioPlaying(false);
      setIsSpeaking(false);
    }
  };

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript 
  } = useSpeechRecognition();

  useEffect(() => {
    if ((activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      if (parentIsListening && !isListening) {
        startListening();
      } else if (!parentIsListening && isListening) {
        stopListening();
      }
    }
  }, [activeMode, parentIsListening, isListening, startListening, stopListening, inputMode]);

  useEffect(() => {
    if (transcript && (activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      setInput(transcript);
      clearTranscript();
      handleSendMessage();
    }
  }, [transcript]);

  useEffect(() => {
    if (activeMode === 'face') {
      setFaceRecognitionActive(true);
    } else {
      setFaceRecognitionActive(false);
    }
  }, [activeMode]);

  if (activeMode === 'hacker') {
    return <HackerMode hackerOutput={hackerOutput} setHackerOutput={setHackerOutput} />;
  }

  return (
    <div className="jarvis-panel flex-1 flex flex-col h-full">
      <div className="p-3 bg-black/60 border-b border-jarvis/20">
        <h2 className="text-jarvis font-medium">
          {activeAssistant.toUpperCase()} Chat Interface
        </h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {activeMode === 'face' && (
          <div className="md:w-[320px] p-3 bg-black/30 border-r border-jarvis/20">
            <FaceRecognition 
              isActive={faceRecognitionActive}
              toggleActive={() => setFaceRecognitionActive(!faceRecognitionActive)}
              onFaceDetected={() => {}}
              onFaceNotDetected={() => {}}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {showDashboard && (
            <div className="p-3 bg-black/20 border-b border-jarvis/20">
              <JarvisDashboard />
            </div>
          )}

          {showImageGenerator && (
            <div className="p-3 bg-black/30 border-b border-jarvis/20">
              <ImageGenerationWidget 
                initialPrompt={pendingImagePrompt}
                onGenerate={(image) => {
                  setGeneratedImage(image);
                  setPendingImagePrompt('');
                }}
                onClose={() => setShowImageGenerator(false)}
              />
            </div>
          )}

          <ChatLayout
            messages={messages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            currentTypingText={currentTypingText}
            isProcessing={isProcessing}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            audioPlaying={audioPlaying}
            volume={volume}
            onVolumeChange={(values: number[]) => setVolume(values[0])}
            stopSpeaking={stopSpeaking}
            toggleMute={toggleMute}
            isListening={isListening}
            activeAssistant={activeAssistant}
            inputMode={inputMode}
            setInputMode={setInputMode}
            handleSendMessage={handleSendMessage}
            getSuggestions={getSuggestions}
          />
        </div>
      </div>
    </div>
  );
};

export default JarvisChat;
