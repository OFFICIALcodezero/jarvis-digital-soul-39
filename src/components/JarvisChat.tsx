
import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '../utils/apiKeyManager';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Message, ConversationContext, UserPreference } from '../types/chat';
import HackerMode from './chat/HackerMode';
import ChatMode from './chat/ChatMode';
import AudioControls from './chat/AudioControls';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import FaceRecognition from './FaceRecognition';
import { getUserMemory, updateUserMemory } from '@/services/aiService';
import { generateAssistantResponse, getAssistantVoiceId } from '@/services/aiAssistantService';
import { AssistantType } from '@/pages/JarvisInterface';

export interface JarvisChatProps {
  activeMode: 'normal' | 'voice' | 'face' | 'hacker';
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  activeAssistant: AssistantType;
  setActiveAssistant: (assistant: AssistantType) => void;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
}

const JarvisChat: React.FC<JarvisChatProps> = ({ 
  activeMode, 
  setIsSpeaking, 
  isListening: parentIsListening,
  activeAssistant,
  setActiveAssistant,
  inputMode,
  setInputMode
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
  const [volume, setVolume] = useState(80);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    recentTopics: [],
    userPreferences: getUserMemory(),
    sessionStartTime: new Date()
  });
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { speakText, stopSpeaking, setAudioVolume, setVoiceId } = useVoiceSynthesis(activeMode);
  const apiKey = getApiKey('openai');

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  useEffect(() => {
    setAudioVolume(volume / 100);
  }, [volume, setAudioVolume]);

  // Set voice based on active assistant
  useEffect(() => {
    const voiceId = getAssistantVoiceId(activeAssistant);
    setVoiceId(voiceId);
  }, [activeAssistant, setVoiceId]);

  useEffect(() => {
    // Update conversation context every time user memory changes
    setConversationContext(prev => ({
      ...prev,
      userPreferences: getUserMemory()
    }));
  }, [messages]);

  // Automatically activate face recognition in face mode
  useEffect(() => {
    if (activeMode === 'face') {
      setFaceRecognitionActive(true);
    } else {
      setFaceRecognitionActive(false);
    }
  }, [activeMode]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 80);
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
      
      // Generate response from selected AI assistant
      const response = await generateAssistantResponse(
        message, 
        chatHistory, 
        activeAssistant,
        selectedLanguage
      );
      
      // Display the response with typing effect
      await simulateTyping(response);
      
      // Speak the response if in voice or face mode or if input mode is voice
      if (activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice') {
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
    onLanguageChange: (languageCode: string) => setSelectedLanguage(languageCode)
  };

  const audioControlsProps = {
    volume,
    audioPlaying,
    stopSpeaking,
    toggleMute,
    onVolumeChange: (values: number[]) => setVolume(values[0]),
    isMicActive: parentIsListening,
    onMicToggle: () => {},
    activeAssistant,
    onAssistantChange: setActiveAssistant,
    inputMode,
    onInputModeChange: setInputMode
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
    if ((activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      if (parentIsListening && !isListening) {
        startListening();
      } else if (!parentIsListening && isListening) {
        stopListening();
      }
    }
  }, [activeMode, parentIsListening, isListening, startListening, stopListening, inputMode]);

  // Process voice input
  useEffect(() => {
    if (transcript && (activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      setInput(transcript);
      clearTranscript();
      handleSendMessage();
    }
  }, [transcript]);

  // Handle face detection events
  const handleFaceDetected = (faceData: any) => {
    // In a real app, we could analyze facial expressions to enhance interactions
    console.log("Face detected:", faceData);
  };

  const handleFaceNotDetected = () => {
    // Could pause interactions when no face is detected
    console.log("Face not detected");
  };

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
        <div className={`${activeMode === 'face' ? 'md:w-[320px] p-3' : 'hidden'} bg-black/30 border-r border-jarvis/20`}>
          <FaceRecognition 
            isActive={faceRecognitionActive}
            toggleActive={() => setFaceRecognitionActive(!faceRecognitionActive)}
            onFaceDetected={handleFaceDetected}
            onFaceNotDetected={handleFaceNotDetected}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMode {...chatModeProps} />
          
          {!isProcessing && messages.length < 3 && (
            <MessageSuggestions 
              suggestions={getSuggestions()} 
              onSuggestionClick={processUserMessage}
            />
          )}
          
          <div ref={chatEndRef}></div>
          
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
      </div>
    </div>
  );
};

export default JarvisChat;
