
import React from 'react';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface ChatModeProps {
  messages: Message[];
  speakText: (text: string) => void;
  audioPlaying: boolean;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
}

const ChatMode: React.FC<ChatModeProps> = ({
  messages,
  speakText,
  audioPlaying,
  isTyping,
  currentTypingText,
  isProcessing,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map(message => (
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
      ))}
      
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
    </div>
  );
};

export default ChatMode;
