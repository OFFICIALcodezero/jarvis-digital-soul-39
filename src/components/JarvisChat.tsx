
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { getApiKey } from '../utils/apiKeyManager';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { Message, JarvisChatProps, ConversationContext, UserPreference } from '../types/chat';
import HackerMode from './chat/HackerMode';
import ChatMode from './chat/ChatMode';
import AudioControls from './chat/AudioControls';
import { generateAIResponse, getUserMemory, updateUserMemory } from '@/services/aiService';

const JarvisChat: React.FC<JarvisChatProps> = ({ 
  activeMode, 
  setIsSpeaking, 
  isListening
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am JARVIS, your personal assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hackerOutput, setHackerOutput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    recentTopics: [],
    userPreferences: getUserMemory(),
    sessionStartTime: new Date()
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { speakText, stopSpeaking, setAudioVolume } = useVoiceSynthesis(activeMode);
  const apiKey = getApiKey('openai');

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  useEffect(() => {
    setAudioVolume(volume);
  }, [volume, setAudioVolume]);

  useEffect(() => {
    // Update conversation context every time user memory changes
    setConversationContext(prev => ({
      ...prev,
      userPreferences: getUserMemory()
    }));
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 0.8);
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update recent topics if this is an assistant message
    if (role === 'assistant') {
      setConversationContext(prev => {
        const topics = [...prev.recentTopics];
        // Simple topic extraction - would be more sophisticated in production
        const simpleTopic = content.split(' ').slice(0, 3).join(' ') + '...';
        
        if (!topics.includes(simpleTopic)) {
          topics.unshift(simpleTopic);
          if (topics.length > 5) topics.pop(); // Keep only most recent 5 topics
        }
        
        return {
          ...prev,
          recentTopics: topics
        };
      });
    }
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    setCurrentTypingText('');
    
    for (let i = 0; i <= text.length; i++) {
      setCurrentTypingText(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
    }
    
    setIsTyping(false);
    setCurrentTypingText('');
    addMessage('assistant', text);
  };

  const processUserMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        title: "OpenAI API Key Required",
        description: "Please set your OpenAI API key in the controls panel.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    addMessage('user', message);
    
    try {
      // Update user memory
      updateUserMemory(message);
      
      // Format chat history for the AI service
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Generate response from OpenAI
      const response = await generateAIResponse(message, chatHistory, selectedLanguage);
      
      // Display the response with typing effect
      await simulateTyping(response);
      
      // Speak the response if in voice or face mode
      if (activeMode === 'voice' || activeMode === 'face') {
        setAudioPlaying(true);
        setIsSpeaking(true);
        await speakText(response);
        setAudioPlaying(false);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;
    
    processUserMessage(messageToSend);
    setInput('');
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const languages = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      zh: "Chinese"
    };
    toast({
      title: "Language Changed",
      description: `JARVIS will now respond in ${languages[languageCode as keyof typeof languages] || languageCode}`,
    });
  };

  const getSuggestions = (): string[] => {
    // Simple suggestions based on conversation history and context
    const suggestions = [
      "What can you help me with?",
      "Tell me a joke",
      "What's the weather like today?",
      "Explain quantum computing"
    ];
    
    // Add personalized suggestions if we have user preferences
    const userPrefs = conversationContext.userPreferences;
    
    if (userPrefs.name) {
      suggestions.push(`What's my name?`);
    }
    
    if (userPrefs.interests && userPrefs.interests.length > 0) {
      const randomInterest = userPrefs.interests[Math.floor(Math.random() * userPrefs.interests.length)];
      suggestions.push(`Tell me more about ${randomInterest}`);
    }
    
    // Return random 3 suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  if (activeMode === 'hacker') {
    return (
      <HackerMode 
        hackerOutput={hackerOutput}
        setHackerOutput={setHackerOutput}
      />
    );
  }

  return (
    <div className="jarvis-panel flex-1 flex flex-col">
      <div className="p-3 bg-black/60 border-b border-jarvis/20">
        <h2 className="text-jarvis font-medium">JARVIS Chat Interface</h2>
      </div>
      
      <ChatMode
        messages={messages}
        speakText={speakText}
        audioPlaying={audioPlaying}
        isTyping={isTyping}
        currentTypingText={currentTypingText}
        isProcessing={isProcessing}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Suggestion chips */}
      {!isProcessing && messages.length < 3 && (
        <div className="px-4 mb-4 flex flex-wrap gap-2">
          {getSuggestions().map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(suggestion)}
              className="bg-jarvis/10 text-jarvis text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-jarvis/20 transition-colors"
            >
              <Brain className="w-3 h-3 mr-1.5" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <div ref={chatEndRef}></div>
      
      {(activeMode === 'voice' || activeMode === 'face') && (
        <AudioControls
          volume={volume}
          setVolume={setVolume}
          audioPlaying={audioPlaying}
          stopSpeaking={stopSpeaking}
          toggleMute={toggleMute}
        />
      )}
      
      <div className="p-3 bg-black/30 border-t border-jarvis/20">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/40 border-jarvis/30 text-white focus-visible:ring-jarvis/50"
            placeholder={isListening ? "Listening..." : "Type your message..."}
            disabled={isProcessing || isListening}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-jarvis hover:bg-jarvis/20" 
            onClick={() => handleSendMessage()}
            disabled={isProcessing || isListening || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JarvisChat;
