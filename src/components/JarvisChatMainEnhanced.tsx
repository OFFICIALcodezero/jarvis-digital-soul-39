
import React from 'react';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import ChatDashboardPanel from './chat/ChatDashboardPanel';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import HackerModeEnhanced from './chat/HackerModeEnhanced';
import useHackerMode from '../hooks/useHackerMode';

const JarvisChatMainEnhanced: React.FC = () => {
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    setMessages, 
    suggestions 
  } = useJarvisChat();
  
  const { isHackerModeActive, checkForHackerMode, deactivateHackerMode } = useHackerMode();

  const handleSendMessage = (text: string) => {
    // Check if hacker mode should be activated
    const isHackerCommand = checkForHackerMode(text);
    
    // If not a hacker command, send as normal message
    if (!isHackerCommand) {
      sendMessage(text);
    }
  };

  // Close hacker mode when clicking outside or sending a new message
  const handleCloseHackerMode = () => {
    if (isHackerModeActive) {
      deactivateHackerMode();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4" onClick={handleCloseHackerMode}>
        <ChatDashboardPanel 
          messages={messages} 
          isTyping={isTyping} 
        />
      </div>
      
      {/* Hacker mode overlay */}
      {isHackerModeActive && (
        <div className="absolute inset-0 z-10 bg-black/70 p-8 overflow-auto">
          <HackerModeEnhanced isActive={isHackerModeActive} />
        </div>
      )}
      
      {/* Message suggestions */}
      <div className="p-2 border-t border-gray-700">
        <MessageSuggestions 
          suggestions={suggestions} 
          onSelect={(suggestion) => handleSendMessage(suggestion)}
        />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <MessageInput 
          onSendMessage={handleSendMessage}
          isDisabled={isHackerModeActive}
        />
      </div>
    </div>
  );
};

export default JarvisChatMainEnhanced;
