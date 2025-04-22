
import React from 'react';
import { Brain } from 'lucide-react';

interface MessageSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <div className="px-4 mb-4 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-jarvis/10 text-jarvis text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-jarvis/20 transition-colors"
        >
          <Brain className="w-3 h-3 mr-1.5" />
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default MessageSuggestions;
