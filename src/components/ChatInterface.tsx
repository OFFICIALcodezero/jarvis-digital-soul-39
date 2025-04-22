
import React, { useState } from 'react';
import { Send } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0, 
      text: "Hi there! I'm an AI assistant. How can I help you today?", 
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: messages.length,
      text: input,
      sender: 'user'
    };

    const aiResponse: Message = {
      id: messages.length + 1,
      text: `I'm simulating an AI response to: "${input}". In a real implementation, this would be replaced with an actual AI service response.`,
      sender: 'ai'
    };

    setMessages([...messages, newUserMessage, aiResponse]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-xl 
                ${message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border'}
              `}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex items-center space-x-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-grow p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
