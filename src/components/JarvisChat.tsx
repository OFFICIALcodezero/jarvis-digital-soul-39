import React, { useState, useRef, useEffect } from 'react';
import { JarvisMode } from './JarvisCore';
import { Send, Play, Square, Trash, Volume2, Volume, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { getApiKey } from '../utils/apiKeyManager';

interface JarvisChatProps {
  activeMode: JarvisMode;
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
  const [hackerCommand, setHackerCommand] = useState('');
  const [hackerOutput, setHackerOutput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get API keys directly from the apiKeyManager
  const apiKey = getApiKey('openai');
  const elevenLabsKey = getApiKey('elevenlabs');

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setAudioPlaying(false);
      setIsSpeaking(false);
    };
    audioRef.current.onplay = () => {
      setAudioPlaying(true);
      setIsSpeaking(true);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  useEffect(() => {
    // Listen for command suggestions
    const handleCommandSuggestion = (e: CustomEvent) => {
      const { command } = e.detail;
      setInput(command);
      handleSendMessage(command);
    };

    window.addEventListener('jarvis-command' as any, handleCommandSuggestion as any);
    
    return () => {
      window.removeEventListener('jarvis-command' as any, handleCommandSuggestion as any);
    };
  }, []);

  useEffect(() => {
    // When volume changes, update audio element volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Mock voice recognition for demo purposes
    if (isListening && (activeMode === 'voice' || activeMode === 'face')) {
      const timer = setTimeout(() => {
        const demoVoiceCommands = [
          "What's the weather like today?",
          "Tell me a joke.",
          "What time is it?",
          "Create a new project folder.",
          "How do I learn React?",
          "Jarvis, enter hacker mode."
        ];
        const randomCommand = demoVoiceCommands[Math.floor(Math.random() * demoVoiceCommands.length)];
        
        // Add user message from voice
        addMessage('user', randomCommand);
        
        // Process response
        processUserMessage(randomCommand);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isListening, activeMode]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;
    
    addMessage('user', messageToSend);
    processUserMessage(messageToSend);
    setInput('');
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    setCurrentTypingText('');
    
    // Split text into characters and show them one by one
    for (let i = 0; i <= text.length; i++) {
      setCurrentTypingText(text.substring(0, i));
      // Random typing speed between 20-50ms
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 20));
    }
    
    setIsTyping(false);
    setCurrentTypingText('');
    addMessage('assistant', text);
  };

  const speakText = async (text: string) => {
    if (!elevenLabsKey || (activeMode !== 'voice' && activeMode !== 'face')) {
      return;
    }
    
    try {
      // Use Roger voice (deep male voice fitting for Jarvis)
      const voiceId = 'CwhRBWXzGAHq8TQ4Fs17';
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.7,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('ElevenLabs API request failed');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: 'Text-to-Speech Error',
        description: 'Failed to generate speech. Please check your ElevenLabs API key.',
        variant: 'destructive',
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioPlaying(false);
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.8);
    }
  };

  const processUserMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      // Check for help command
      if (message.toLowerCase().trim() === 'help') {
        const helpResponse = `Available commands:

1. Conversation Commands:
- "Tell me a joke"
- "What time is it?"
- "Who created you?"

2. Hacker Module Commands:
- "Access the mainframe"
- "Scan for vulnerabilities"
- "Decrypt the signal"

3. Knowledge Commands:
- "Who is Elon Musk?"
- "Explain quantum computing"
- "Latest tech news"

Type any of these commands or ask me anything else!`;

        await simulateTyping(helpResponse);
        if (activeMode === 'voice' || activeMode === 'face') {
          await speakText(helpResponse);
        }
        setIsProcessing(false);
        return;
      }

      // Check if we have required API keys based on mode
      if ((activeMode === 'face' || activeMode === 'voice') && !elevenLabsKey) {
        toast({
          title: "ElevenLabs API Key Required",
          description: "Please set your ElevenLabs API key in the controls panel.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      if (!apiKey) {
        toast({
          title: "OpenAI API Key Required",
          description: "Please set your OpenAI API key in the controls panel.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Handle special commands
      if (message.toLowerCase().includes("enter hacker mode")) {
        // Switch to hacker mode
        toast({
          title: "Hacker Mode Activated",
          description: "JARVIS is now in hacker mode. Use with caution.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a response based on the active mode
      let response = '';
      
      if (activeMode === 'hacker') {
        if (message.toLowerCase().includes('scan') || message.toLowerCase().includes('network')) {
          setHackerOutput(`
[+] Initiating network scan...
[+] Discovered devices: 6
[+] IP Range: 192.168.1.0/24
[+] Open ports found on 192.168.1.1: 80, 443, 22
[+] Vulnerability scan complete
[+] 2 potential security issues detected
[+] Scan complete.
          `);
        } else if (message.toLowerCase().includes('crack') || message.toLowerCase().includes('password')) {
          setHackerOutput(`
[!] Warning: Password cracking attempt detected
[!] This feature is disabled for ethical reasons
[!] Please use JARVIS responsibly
          `);
        } else {
          setHackerOutput(`
[+] Executing command: ${message}
[+] Processing...
[+] Command executed successfully.
[+] Results available in secured memory.
          `);
        }
      }
      
      // Generate a standard response
      const responses = [
        "I understand you're asking about " + message.split(' ').slice(0, 3).join(' ') + ". Let me help with that.",
        "I've analyzed your query about " + message.split(' ').slice(0, 3).join(' ') + " and here's what I found.",
        "Based on your question about " + message.split(' ').slice(0, 3).join(' ') + ", I can provide the following information.",
        "I've processed your request regarding " + message.split(' ').slice(0, 3).join(' ') + " and here's my response."
      ];
      
      response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add typing effect for the assistant's response
      await simulateTyping(response);
      
      // Speak the response if in voice or face mode
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

  const handleHackerCommandSubmit = () => {
    if (!hackerCommand.trim()) return;
    
    setHackerOutput(`
[+] Executing: ${hackerCommand}
[+] Processing command...
[+] Command executed with code: 0
[+] Operation completed successfully
    `);
    
    setHackerCommand('');
  };

  const clearHackerConsole = () => {
    setHackerOutput('');
  };

  const renderChatMessages = () => {
    return messages.map(message => (
      <div 
        key={message.id}
        className={`mb-4 ${message.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[85%]`}
      >
        <div 
          className={`
            px-4 py-3 rounded-lg jarvis-panel
            ${message.role === 'user' ? 'ml-auto bg-jarvis/10' : 'mr-auto bg-black/40'}
          `}
        >
          <div className="text-sm font-medium mb-1 flex justify-between items-center">
            <span>{message.role === 'user' ? 'You' : 'JARVIS'}</span>
            
            {message.role === 'assistant' && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-jarvis/70 hover:text-jarvis hover:bg-transparent"
                  onClick={() => speakText(message.content)}
                  disabled={audioPlaying}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className={`${message.role === 'assistant' ? 'text-jarvis' : 'text-white'}`}>
            {message.content}
          </div>
          
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    ));
  };

  const renderAudioControls = () => {
    if (activeMode === 'voice' || activeMode === 'face') {
      return (
        <div className="p-2 flex items-center justify-end space-x-2 border-t border-jarvis/10">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
            onClick={toggleMute}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 mr-1" />
            ) : (
              <Volume className="h-4 w-4 mr-1" />
            )}
            {volume === 0 ? 'Unmute' : 'Mute'}
          </Button>
          
          {audioPlaying && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
              onClick={stopSpeaking}
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-jarvis"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {activeMode === 'hacker' ? (
        <div className="jarvis-panel flex-1 flex flex-col">
          <div className="p-2 bg-black/60 flex items-center justify-between">
            <div className="text-jarvis text-sm terminal-text">JARVIS Terminal</div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-jarvis hover:bg-jarvis/20" 
                onClick={clearHackerConsole}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-black/80 font-mono text-jarvis text-sm overflow-y-auto">
            <div className="terminal-text text-jarvis/80">
              <p>J.A.R.V.I.S v1.0 - Terminal Interface</p>
              <p>Copyright (c) Stark Industries</p>
              <p className="mb-4">Type 'help' for available commands</p>
              {hackerOutput && (
                <pre className="whitespace-pre-wrap text-xs">{hackerOutput}</pre>
              )}
            </div>
            <div ref={chatEndRef}></div>
          </div>
          
          <div className="p-2 bg-black/60 flex">
            <div className="text-jarvis mr-2 terminal-text">$</div>
            <Input
              value={hackerCommand}
              onChange={(e) => setHackerCommand(e.target.value)}
              className="flex-1 bg-transparent border-none text-jarvis terminal-text text-sm focus-visible:ring-0"
              placeholder="Enter command..."
              onKeyDown={(e) => e.key === 'Enter' && handleHackerCommandSubmit()}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-jarvis hover:bg-jarvis/20 ml-2" 
              onClick={handleHackerCommandSubmit}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="jarvis-panel flex-1 flex flex-col">
          <div className="p-3 bg-black/60 border-b border-jarvis/20">
            <h2 className="text-jarvis font-medium">JARVIS Chat Interface</h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {renderChatMessages()}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-4 mr-auto max-w-[85%]">
                <div className="px-4 py-3 rounded-lg bg-black/40 jarvis-panel">
                  <div className="text-sm font-medium mb-1">JARVIS</div>
                  <div className="text-jarvis">
                    {currentTypingText}<span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>
            )}
            
            {isProcessing && !isTyping && (
              <div className="flex space-x-2 items-center text-jarvis mb-4">
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm">JARVIS is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
          
          {/* Audio controls section */}
          {renderAudioControls()}
          
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
      )}
    </div>
  );
};

export default JarvisChat;
