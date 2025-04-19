
import React, { useState, useRef, useEffect } from 'react';
import { JarvisMode } from './JarvisCore';
import { Send, Play, Square, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';

interface JarvisChatProps {
  activeMode: JarvisMode;
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  apiKey: string;
  elevenLabsKey: string;
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
  isListening, 
  apiKey, 
  elevenLabsKey 
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [hackerCommand, setHackerCommand] = useState('');
  const [hackerOutput, setHackerOutput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput]);

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

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    addMessage('user', input);
    processUserMessage(input);
    setInput('');
  };

  const processUserMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        "I've analyzed your question about " + message.split(' ').slice(0, 3).join(' ') + " and here's what I found.",
        "Based on your query about " + message.split(' ').slice(0, 3).join(' ') + ", I can provide the following information.",
        "I've processed your request regarding " + message.split(' ').slice(0, 3).join(' ') + " and here's my response."
      ];
      
      response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add assistant's response
      addMessage('assistant', response);
      
      if (activeMode === 'voice' || activeMode === 'face') {
        // Simulate voice speaking
        setIsSpeaking(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
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
          <div className="text-sm font-medium mb-1">
            {message.role === 'user' ? 'You' : 'JARVIS'}
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

  return (
    <div className="flex flex-col h-full">
      {activeMode === 'hacker' ? (
        <div className="jarvis-panel flex-1 flex flex-col">
          <div className="p-2 bg-black/60 flex items-center justify-between">
            <div className="text-jarvis text-sm">JARVIS Terminal</div>
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
            {isProcessing && (
              <div className="flex space-x-2 items-center text-jarvis mb-4">
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm">JARVIS is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
          
          <div className="p-3 bg-black/30 border-t border-jarvis/20">
            <div className="flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/40 border-jarvis/30 text-white focus-visible:ring-jarvis/50"
                placeholder="Type your message..."
                disabled={isProcessing || isListening}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 text-jarvis hover:bg-jarvis/20" 
                onClick={handleSendMessage}
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
