
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
  isListening: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isProcessing,
  isListening,
}) => {
  return (
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
          onClick={handleSendMessage}
          disabled={isProcessing || isListening || !input.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
