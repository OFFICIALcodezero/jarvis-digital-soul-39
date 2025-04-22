
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bot, Copy, Send, User } from 'lucide-react';
import AudioControls from './AudioControls';
import LanguageSelector from './LanguageSelector';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

const ChatMode = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [language, setLanguage] = useState('en');
  const [isJarvisTyping, setIsJarvisTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: `jarvis-${Date.now()}`,
      text: 'Hello. I am JARVIS, your personal AI assistant. How may I help you today?',
      sender: 'jarvis',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages([initialMessage]);
    }, 1000);
  }, []);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsJarvisTyping(true);
    
    // Simulate JARVIS response after a delay
    setTimeout(() => {
      const jarvisResponses: Record<string, string> = {
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! How may I help you?',
        'hey': 'Hey! I\'m here to assist you. What can I do for you?',
        'who are you': 'I am JARVIS, a virtual AI assistant inspired by Tony Stark\'s AI. I\'m designed to help you with various tasks and provide information.',
        'what can you do': 'I can assist with information, answer questions, help with productivity tasks, provide entertainment, and much more. What would you like help with?',
        'thank you': 'You\'re welcome! I\'m happy to assist. Is there anything else you need?',
        'thanks': 'You\'re welcome! Let me know if you need anything else.',
        'help': 'I\'m here to help! You can ask me questions, request information, or give me specific commands. What do you need assistance with?',
      };
      
      const lowercaseInput = inputValue.toLowerCase();
      let response = '';
      
      // Check for exact matches first
      if (jarvisResponses[lowercaseInput]) {
        response = jarvisResponses[lowercaseInput];
      } 
      // Then check for partial matches
      else {
        for (const [key, value] of Object.entries(jarvisResponses)) {
          if (lowercaseInput.includes(key)) {
            response = value;
            break;
          }
        }
      }
      
      // Default response if no matches
      if (!response) {
        response = 'I understand your request. How can I assist you further with that?';
      }
      
      const jarvisMessage: Message = {
        id: `jarvis-${Date.now()}`,
        text: response,
        sender: 'jarvis',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, jarvisMessage]);
      setIsJarvisTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleMicToggle = () => {
    setIsMicActive(!isMicActive);
    
    if (!isMicActive) {
      // Simulating voice activation after a delay
      setTimeout(() => {
        const voiceCommandText = "What's the weather today?";
        setInputValue(voiceCommandText);
        
        // Auto-send the voice command after setting it
        setTimeout(() => {
          handleSendMessage();
        }, 500);
        
        setIsMicActive(false);
      }, 2000);
    }
  };
  
  const handleVoiceToggle = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full glass-morphism rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#33c3f0]/20 flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-[#33c3f0] mr-2" />
          <span className="text-[#d6d6ff] font-medium">JARVIS Assistant</span>
        </div>
        <LanguageSelector selectedLanguage={language} onLanguageChange={handleLanguageChange} />
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#33c3f0]/20 text-white'
                    : 'bg-black/40 text-[#d6d6ff] border border-[#33c3f0]/20'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'jarvis' ? (
                    <Bot className="h-4 w-4 text-[#33c3f0]" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                </div>
                <div className="text-sm">{message.text}</div>
                
                <div className="flex justify-end mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-[#8a8a9b] hover:text-white hover:bg-transparent"
                          onClick={() => copyToClipboard(message.text)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
          
          {isJarvisTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-black/40 text-[#d6d6ff] border border-[#33c3f0]/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Bot className="h-4 w-4 text-[#33c3f0]" />
                  <span className="text-xs opacity-70">{formatTime(new Date())}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-[#33c3f0] rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-[#33c3f0] rounded-full animate-pulse delay-150"></div>
                  <div className="h-2 w-2 bg-[#33c3f0] rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-[#33c3f0]/20">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="bg-black/30 border-[#33c3f0]/30 text-white focus:border-[#33c3f0]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ''}
            className="bg-[#33c3f0] hover:bg-[#1eaedb] text-black"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between mt-3">
          <div>
            {isMicActive && (
              <div className="flex items-center text-xs text-[#33c3f0]">
                <div className="mr-1 h-2 w-2 bg-[#33c3f0] rounded-full animate-pulse"></div>
                Listening...
              </div>
            )}
          </div>
          
          <AudioControls
            isMicActive={isMicActive}
            isVoiceEnabled={isVoiceEnabled}
            volume={volume}
            onMicToggle={handleMicToggle}
            onVoiceToggle={handleVoiceToggle}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMode;
