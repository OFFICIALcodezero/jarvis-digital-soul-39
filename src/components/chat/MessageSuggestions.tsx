
import React from 'react';
import { Brain } from 'lucide-react';
import { MessageSuggestion } from '@/types/chat';

interface MessageSuggestionsProps {
  suggestions: MessageSuggestion[] | string[];
  onSelect?: (suggestion: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  suggestions,
  onSelect,
  onSuggestionClick,
}) => {
  const handleClick = (suggestion: string | MessageSuggestion) => {
    const text = typeof suggestion === 'string' ? suggestion : suggestion.text;
    if (onSelect) onSelect(text);
    if (onSuggestionClick) onSuggestionClick(text);
  };

  return (
    <div className="px-4 mb-4 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => {
        const text = typeof suggestion === 'string' ? suggestion : suggestion.text;
        const key = typeof suggestion === 'string' ? `suggestion-${index}` : suggestion.id;
        
        return (
          <button
            key={key}
            onClick={() => handleClick(suggestion)}
            className="bg-jarvis/10 text-jarvis text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-jarvis/20 transition-colors"
          >
            <Brain className="w-3 h-3 mr-1.5" />
            {text}
          </button>
        );
      })}
    </div>
  );
};

export default MessageSuggestions;
