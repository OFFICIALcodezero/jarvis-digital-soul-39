
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';

interface QuickChatProps {
  isHackerMode?: boolean;
  className?: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

const QuickChat: React.FC<QuickChatProps> = ({
  isHackerMode = false,
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0, 
      text: "Hello, I'm JARVIS. How can I assist you today?", 
      sender: 'jarvis',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newUserMessage: ChatMessage = {
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
    
    const response = `I'll help you with "${userInput}". What additional information do you need?`;

    const jarvisResponse: ChatMessage = {
      id: messages.length + 1,
      text: response,
      sender: 'jarvis',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, jarvisResponse]);
    setIsProcessing(false);
  };

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'} ${className} flex flex-col h-full`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          Quick Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-full">
        {/* Messages container */}
        <div className="flex-1 space-y-2 overflow-y-auto mb-2 max-h-[200px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-1 text-xs ${
                  message.sender === "user"
                    ? isHackerMode 
                      ? "bg-transparent text-white border border-red-500/30" 
                      : "bg-transparent text-white border border-jarvis/30"
                    : isHackerMode 
                      ? "bg-transparent text-red-400 border border-red-500/30" 
                      : "bg-transparent text-white border border-jarvis/30"
                  }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-center">
              <div className="flex space-x-1 items-center">
                <div className={`w-1.5 h-1.5 rounded-full ${isHackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${isHackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse delay-75`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${isHackerMode ? 'bg-red-500/70' : 'bg-jarvis'} animate-pulse delay-150`}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="mt-auto">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-black/40 border border-gray-700 rounded-l px-2 py-1 text-white text-xs"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className={`px-2 py-1 rounded-r ${
                isHackerMode ? 'bg-red-600/70 hover:bg-red-700/70' : 'bg-jarvis/60 hover:bg-jarvis/80'
              } text-white`}
              disabled={isProcessing}
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickChat;
