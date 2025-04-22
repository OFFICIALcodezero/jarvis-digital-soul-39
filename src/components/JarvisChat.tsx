
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { getApiKey } from '../utils/apiKeyManager';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { Message, JarvisChatProps } from '../types/chat';
import HackerMode from './chat/HackerMode';
import ChatMode from './chat/ChatMode';
import AudioControls from './chat/AudioControls';

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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { speakText, stopSpeaking, setAudioVolume } = useVoiceSynthesis(activeMode);
  const apiKey = getApiKey('openai');

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 0.8);
  };

  useEffect(() => {
    setAudioVolume(volume);
  }, [volume, setAudioVolume]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    setCurrentTypingText('');
    
    for (let i = 0; i <= text.length; i++) {
      setCurrentTypingText(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 20));
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
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a simple response
      const responses = [
        "I understand you're asking about " + message.split(' ').slice(0, 3).join(' ') + ". Let me help with that.",
        "I've analyzed your query about " + message.split(' ').slice(0, 3).join(' ') + " and here's what I found.",
        "Based on your question about " + message.split(' ').slice(0, 3).join(' ') + ", I can provide the following information.",
        "I've processed your request regarding " + message.split(' ').slice(0, 3).join(' ') + " and here's my response."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      await simulateTyping(response);
      
      if (activeMode === 'voice' || activeMode === 'face') {
        await speakText(response);
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
      />
      
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
