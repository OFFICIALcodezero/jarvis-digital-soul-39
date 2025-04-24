
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context shape
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

interface JarvisChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: 'user' | 'jarvis') => void;
  clearMessages: () => void;
}

// Create the context with a default value
const JarvisChatContext = createContext<JarvisChatContextType | undefined>(undefined);

// Create a provider component
interface JarvisChatProviderProps {
  children: ReactNode;
}

export const JarvisChatProvider: React.FC<JarvisChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, sender: 'user' | 'jarvis') => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
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
    throw new Error('JarvisChatContext must be within provider.');
  }
  return context;
};

export default JarvisChatProvider;
