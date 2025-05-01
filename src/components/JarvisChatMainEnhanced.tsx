
import React, { useState } from 'react';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import ChatDashboardPanel from './chat/ChatDashboardPanel';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import HackerModeEnhanced from './chat/HackerModeEnhanced';
import useHackerMode from '../hooks/useHackerMode';

const JarvisChatMainEnhanced: React.FC = () => {
  const jarvisChat = useJarvisChat();
  const [input, setInput] = useState('');
  
  const { isHackerModeActive, checkForHackerMode, deactivateHackerMode } = useHackerMode();

  // Create a local send message function since the JarvisChatContext doesn't have sendMessage
  const handleSendMessage = (text: string) => {
    // Check if hacker mode should be activated
    const isHackerCommand = checkForHackerMode(text);
    
    // If not a hacker command and we have image generation handling available
    if (!isHackerCommand && jarvisChat.handleImageGenerationFromPrompt) {
      // We'll use image generation as a fallback since sendMessage isn't available
      jarvisChat.handleImageGenerationFromPrompt(text)
        .catch(error => console.error("Failed to process message:", error));
    }
    
    // Clear input
    setInput('');
  };

  // Close hacker mode when clicking outside or sending a new message
  const handleCloseHackerMode = () => {
    if (isHackerModeActive) {
      deactivateHackerMode();
    }
  };

  // Create a dummy messages array since we might not have one from context
  const messages = jarvisChat.messages || [];
  const isProcessing = jarvisChat.isGeneratingImage || false;
  
  // Create dummy suggestions
  const defaultSuggestions = [
    { id: 'default-1', text: 'Generate an image for me' },
    { id: 'default-2', text: 'What can you help me with?' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4" onClick={handleCloseHackerMode}>
        <ChatDashboardPanel />
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
          suggestions={defaultSuggestions} 
          onSuggestionClick={(suggestion) => handleSendMessage(suggestion)}
        />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <MessageInput 
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isDisabled={isHackerModeActive}
        />
      </div>
    </div>
  );
};

export default JarvisChatMainEnhanced;
