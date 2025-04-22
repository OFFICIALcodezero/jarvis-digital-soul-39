import React, { useState, useRef, useEffect } from 'react';
import { toast } from './ui/use-toast';
import { getApiKey } from '../utils/apiKeyManager';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Message, JarvisChatProps, ConversationContext, UserPreference } from '../types/chat';
import HackerMode from './chat/HackerMode';
import ChatMode from './chat/ChatMode';
import AudioControls from './chat/AudioControls';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import { generateAIResponse, getUserMemory, updateUserMemory } from '@/services/aiService';

const JarvisChat: React.FC<JarvisChatProps> = ({ 
  activeMode, 
  setIsSpeaking, 
  isListening: parentIsListening 
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

  const getSuggestions = (): string[] => {
    const suggestions = [
      "What can you help me with?",
      "Tell me a joke",
      "What's the weather like today?",
      "Explain quantum computing"
    ];
    
    const userPrefs = conversationContext.userPreferences;
    
    if (userPrefs.name) {
      suggestions.push(`What's my name?`);
    }
    
    if (userPrefs.interests && userPrefs.interests.length > 0) {
      const randomInterest = userPrefs.interests[Math.floor(Math.random() * userPrefs.interests.length)];
      suggestions.push(`Tell me more about ${randomInterest}`);
    }
    
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    processUserMessage(input);
    setInput('');
  };

  const hackerModeProps = {
    hackerOutput,
    setHackerOutput
  };

  const chatModeProps = {
    messages,
    speakText,
    audioPlaying,
    isTyping,
    currentTypingText,
    isProcessing,
    selectedLanguage,
    onLanguageChange: (languageCode: string) => {}
  };

  const audioControlsProps = {
    volume,
    audioPlaying,
    stopSpeaking,
    toggleMute,
    onVolumeChange: (values: number[]) => setVolume(values[0])
  };
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript 
  } = useSpeechRecognition();

  // Voice mode effect
  useEffect(() => {
    if (activeMode === 'voice' || activeMode === 'face') {
      if (parentIsListening && !isListening) {
        startListening();
      } else if (!parentIsListening && isListening) {
        stopListening();
      }
    }
  }, [activeMode, parentIsListening, isListening, startListening, stopListening]);

  // Process voice input
  useEffect(() => {
    if (transcript && (activeMode === 'voice' || activeMode === 'face')) {
      setInput(transcript);
      clearTranscript();
      handleSendMessage();
    }
  }, [transcript]);

  if (activeMode === 'hacker') {
    return <HackerMode hackerOutput={hackerOutput} setHackerOutput={setHackerOutput} />;
  }

  return (
    <div className="jarvis-panel flex-1 flex flex-col">
      <div className="p-3 bg-black/60 border-b border-jarvis/20">
        <h2 className="text-jarvis font-medium">JARVIS Chat Interface</h2>
      </div>
      
      <ChatMode {...chatModeProps} />
      
      {!isProcessing && messages.length < 3 && (
        <MessageSuggestions 
          suggestions={getSuggestions()} 
          onSuggestionClick={processUserMessage}
        />
      )}
      
      <div ref={chatEndRef}></div>
      
      {(activeMode === 'voice' || activeMode === 'face') && (
        <AudioControls 
          volume={volume}
          audioPlaying={audioPlaying}
          stopSpeaking={stopSpeaking}
          toggleMute={toggleMute}
          onVolumeChange={(values) => setVolume(values[0])}
          isMicActive={isListening}
          onMicToggle={() => isListening ? stopListening() : startListening()}
        />
      )}
      
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

export default JarvisChat;
