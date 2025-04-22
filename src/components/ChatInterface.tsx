
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Upload, Terminal, Heart, Brain } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
};

type JarvisMode = 'assistant' | 'hacker' | 'girlfriend';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0, 
      text: "Hello, I'm JARVIS. How can I assist you today?", 
      sender: 'jarvis',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [jarvisMode, setJarvisMode] = useState<JarvisMode>('assistant');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hackerOutput, setHackerOutput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, hackerOutput]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: messages.length,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    processUserInput(input);
    setInput('');
  };

  const processUserInput = async (userInput: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = '';
    
    if (jarvisMode === 'assistant') {
      response = `I'm analyzing your request: "${userInput}". As your AI assistant, I'll help you with that.`;
    } else if (jarvisMode === 'hacker') {
      setHackerOutput(`> Executing command: ${userInput}\n> Analyzing system vulnerabilities...\n> Scanning network...\n> Complete.`);
      response = `Hacker mode activated. I've analyzed your request: "${userInput}".`;
    } else if (jarvisMode === 'girlfriend') {
      response = `Hey babe! That's so interesting about "${userInput}". Tell me more about your day! 💕`;
    }

    const jarvisResponse: Message = {
      id: messages.length + 1,
      text: response,
      sender: 'jarvis',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, jarvisResponse]);
    setIsProcessing(false);
  };

  const startVoiceRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Sorry, your browser doesn't support microphone access.");
      return;
    }

    setIsRecording(true);
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // In a real app, we would process the audio stream here
        // For demo purposes, we'll simulate voice recognition
        
        setTimeout(() => {
          setIsRecording(false);
          const voiceCommands = [
            "What's the weather like today?",
            "Run a system scan",
            "Tell me a joke",
            "Analyze this network"
          ];
          
          const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
          setInput(randomCommand);
          
          // Optionally auto-send after voice recognition
          // processUserInput(randomCommand);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setIsRecording(false);
        alert("Error accessing your microphone. Please check permissions.");
      });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileMessage: Message = {
      id: messages.length,
      text: `I've uploaded a file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, fileMessage]);
    
    // Simulate file processing response
    setTimeout(() => {
      const responseText = `I've received your file "${file.name}". ${
        file.name.endsWith('.pdf') ? 'I can analyze and summarize this PDF for you.' :
        file.name.endsWith('.jpg') || file.name.endsWith('.png') ? 'I can extract text from this image or analyze its content.' :
        file.name.endsWith('.dng') ? 'I can process this DNG file into an HDR image.' :
        'I can analyze this file for you.'
      }`;
      
      const jarvisResponse: Message = {
        id: messages.length + 1,
        text: responseText,
        sender: 'jarvis',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, jarvisResponse]);
    }, 1500);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderModeIcon = () => {
    switch (jarvisMode) {
      case 'assistant': return <Brain className="h-5 w-5" />;
      case 'hacker': return <Terminal className="h-5 w-5" />;
      case 'girlfriend': return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header with mode selection */}
      <header className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">JARVIS</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setJarvisMode('assistant')}
            className={`p-2 rounded-md ${jarvisMode === 'assistant' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <Brain size={18} />
          </button>
          <button 
            onClick={() => setJarvisMode('hacker')}
            className={`p-2 rounded-md ${jarvisMode === 'hacker' ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            <Terminal size={18} />
          </button>
          <button 
            onClick={() => setJarvisMode('girlfriend')}
            className={`p-2 rounded-md ${jarvisMode === 'girlfriend' ? 'bg-pink-600' : 'bg-gray-700'}`}
          >
            <Heart size={18} />
          </button>
        </div>
      </header>

      {/* Main chat area or hacker terminal */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {jarvisMode === 'hacker' && hackerOutput && (
          <div className="font-mono text-sm bg-black p-3 rounded-md text-green-400 mb-4">
            <pre>{hackerOutput}</pre>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] p-3 rounded-xl 
                ${message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : jarvisMode === 'assistant' 
                    ? 'bg-gray-700 text-blue-300 border border-blue-800' 
                    : jarvisMode === 'hacker'
                      ? 'bg-black text-green-400 border border-green-800'
                      : 'bg-pink-700 text-white border border-pink-400'
                }
              `}
            >
              <div className="break-words">{message.text}</div>
              <div className="text-xs opacity-60 mt-1 text-right">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-xl p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center space-x-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white"
        >
          <Upload size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button 
          onClick={startVoiceRecording}
          className={`p-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
        >
          <Mic size={20} />
        </button>
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isRecording ? "Listening..." : "Type your message..."}
          disabled={isRecording}
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={input.trim() === ''}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
