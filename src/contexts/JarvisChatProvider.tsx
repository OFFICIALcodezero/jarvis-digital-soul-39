
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Message } from '@/types/chat';

// Define the context shape
interface JarvisChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: 'user' | 'jarvis') => void;
  clearMessages: () => void;
  // Add additional properties to match what JarvisCentralCore needs
  activeImage: any;
  setActiveImage: (image: any) => void;
}

// Create the context with a default value
const JarvisChatContext = createContext<JarvisChatContextType | undefined>(undefined);

// Create a provider component
interface JarvisChatProviderProps {
  children: ReactNode;
}

export const JarvisChatProvider: React.FC<JarvisChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeImage, setActiveImage] = useState<any>(null);

  const addMessage = (text: string, sender: 'user' | 'jarvis') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      role: sender === 'user' ? 'user' : 'assistant',
      content: text
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    addMessage,
    clearMessages,
    activeImage,
    setActiveImage
  };

  return (
    <JarvisChatContext.Provider value={value}>
      {children}
    </JarvisChatContext.Provider>
  );
};

// Create a custom hook for using this context
export const useJarvisChat = (): JarvisChatContextType => {
  const context = useContext(JarvisChatContext);
  if (context === undefined) {
    throw new Error('useJarvisChat must be used within JarvisChatProvider');
  }
  return context;
};

// Create a custom hook specifically for JarvisChatContext
export const useJarvisChatContext = (): JarvisChatContextType => {
  const context = useContext(JarvisChatContext);
  if (context === undefined) {
    throw new Error('JarvisChatContext must be within provider');
  }
  return context;
};

export default JarvisChatProvider;
