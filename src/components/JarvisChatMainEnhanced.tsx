
import React, { useState, useEffect } from 'react';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import ChatDashboardPanel from './chat/ChatDashboardPanel';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import HackerModeEnhanced from './chat/HackerModeEnhanced';
import useHackerMode from '../hooks/useHackerMode';
import { toast } from './ui/sonner';
import { detectThreats } from '@/services/threatDetectionService';
import { getAllServices } from '@/services/serviceIntegrations/serviceRegistry';

const JarvisChatMainEnhanced: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [serviceSuggestions, setServiceSuggestions] = useState<{ id: string, text: string }[]>([]);
  
  // Try to use the JarvisChat context, but provide fallbacks if it's not available
  let jarvisChat;
  try {
    jarvisChat = useJarvisChat();
  } catch (error) {
    console.warn("JarvisChat context not available, using fallback values");
    jarvisChat = {
      handleImageGenerationFromPrompt: async (text: string) => {
        console.log("Image generation requested:", text);
        return null;
      },
      isGeneratingImage: false,
      messages: [],
      activeImage: null,
      setActiveImage: () => {},
      handleRefineImage: async () => null,
      generationProgress: 0
    };
  }
  
  const { isHackerModeActive, checkForHackerMode, deactivateHackerMode } = useHackerMode();

  // Load service suggestions
  useEffect(() => {
    try {
      const services = getAllServices();
      const suggestions = services
        .filter(service => service.status === 'available')
        .slice(0, 5)
        .map(service => ({
          id: service.id,
          text: service.commands[0]
        }));
      
      setServiceSuggestions(suggestions);
    } catch (error) {
      console.error("Error loading service suggestions:", error);
    }
  }, []);

  // Create a local send message function since the JarvisChatContext doesn't have sendMessage
  const handleSendMessage = async (text: string) => {
    // Check if hacker mode should be activated
    const isHackerCommand = checkForHackerMode(text);
    
    // Handle threat detection command
    if (text.toLowerCase().includes("detect threat") || text.toLowerCase().includes("scan for threats")) {
      setIsProcessing(true);
      // Add the message to our local state
      setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now().toString() }]);
      
      // Process threat detection
      try {
        const phoneNumber = "whatsapp:+13205300568"; // Default Twilio number
        const result = await detectThreats(phoneNumber);
        
        let responseText = "";
        if (result.status === "threats_detected") {
          responseText = `I've detected ${result.threatCount} high-level security threats. Alerts have been sent to your WhatsApp.`;
        } else {
          responseText = "Threat scan complete. No immediate threats detected.";
        }
        
        // Add response message
        setMessages(prev => [...prev, { role: 'assistant', content: responseText, id: Date.now().toString() }]);
      } catch (error) {
        console.error("Error in threat detection:", error);
        toast("Error", {
          description: "Failed to complete threat detection.",
        });
      } finally {
        setIsProcessing(false);
      }
      
      // Clear input
      setInput('');
      return;
    }
    
    // If not a hacker command and we have a sendMessage function available
    if (!isHackerCommand && jarvisChat.sendMessage) {
      setIsProcessing(true);
      
      try {
        await jarvisChat.sendMessage(text);
      } catch (error) {
        console.error("Failed to process message:", error);
        toast("Error", {
          description: "Failed to process your message.",
        });
      } finally {
        setIsProcessing(false);
      }
    }
    // Fallback if sendMessage not available but image generation is
    else if (!isHackerCommand && jarvisChat.handleImageGenerationFromPrompt) {
      setIsProcessing(true);
      
      try {
        // Add the message to our local state
        setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now().toString() }]);
        
        // We'll use image generation as a fallback
        await jarvisChat.handleImageGenerationFromPrompt(text);
        
        // Add a generic response
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `I've processed your request: "${text}"`,
            id: Date.now().toString() 
          }
        ]);
      } catch (error) {
        console.error("Failed to process message:", error);
      } finally {
        setIsProcessing(false);
      }
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
  
  // Use context messages if available, otherwise use local state
  const displayMessages = jarvisChat.messages?.length > 0 ? jarvisChat.messages : messages;
  const isCurrentlyProcessing = jarvisChat.isGeneratingImage || isProcessing;
  
  // Create service-based suggestions
  const suggestions = [
    ...serviceSuggestions,
    { id: 'threat-1', text: 'Detect threat' },
    { id: 'threat-2', text: 'Scan for threats' },
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
      
      {/* Available integrations */}
      <div className="p-2 border-t border-gray-700">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-400 mr-2">Available Integrations:</span>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Resend</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Clerk</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Make</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Mapbox</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Twilio</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">Weather</span>
            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">YouTube</span>
          </div>
        </div>
        <MessageSuggestions 
          suggestions={suggestions} 
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
          isProcessing={isCurrentlyProcessing}
        />
      </div>
    </div>
  );
};

export default JarvisChatMainEnhanced;
