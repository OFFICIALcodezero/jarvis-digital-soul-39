
import { FirebaseUser } from './firebaseService';
import { Message } from '@/types/chat';

// Store user message history in localStorage with user ID as part of the key
const getChatHistoryKey = (userId: string) => `jarvis_chat_history_${userId}`;

// Save chat messages to storage
export const saveUserChatHistory = (userId: string, messages: Message[]): void => {
  try {
    const historyKey = getChatHistoryKey(userId);
    const messagesToStore = messages.map(message => ({
      ...message,
      timestamp: message.timestamp instanceof Date ? message.timestamp.toISOString() : message.timestamp
    }));
    localStorage.setItem(historyKey, JSON.stringify(messagesToStore));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Load chat messages from storage
export const loadUserChatHistory = (userId: string): Message[] => {
  try {
    const historyKey = getChatHistoryKey(userId);
    const savedHistory = localStorage.getItem(historyKey);
    
    if (!savedHistory) {
      return [];
    }
    
    return JSON.parse(savedHistory).map((message: any) => ({
      ...message,
      timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
    }));
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Clear chat history for a user
export const clearUserChatHistory = (userId: string): void => {
  try {
    const historyKey = getChatHistoryKey(userId);
    localStorage.removeItem(historyKey);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

// Save chat messages to history (simplified version for service integration)
export const saveToHistory = (messages: Message[]): void => {
  if (messages.length === 0) return;
  
  try {
    const userId = 'default_user'; // Use a default ID if no user is logged in
    saveUserChatHistory(userId, messages);
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

// Process history query - this is the missing function
export const processHistoryQuery = (message: string): Message[] | null => {
  // Simple implementation to check if a message is asking about chat history
  const lowerMessage = message.toLowerCase();
  
  if (
    lowerMessage.includes('chat history') ||
    lowerMessage.includes('past questions') ||
    lowerMessage.includes('asked earlier') ||
    lowerMessage.includes('previous conversations')
  ) {
    const userId = 'default_user'; // Use a default ID if no user is logged in
    const history = loadUserChatHistory(userId);
    
    // Only return history if we have any
    if (history.length > 0) {
      // Create a summary message of the chat history
      const historyPreview = history.slice(-5); // Get last 5 messages
      const content = `Here's a summary of our recent conversation:\n\n${
        historyPreview.map(msg => 
          `${msg.role === 'user' ? 'You' : 'Jarvis'}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`
        ).join('\n\n')
      }\n\nIs there anything specific from our conversation you'd like to revisit?`;
      
      return [{
        id: Date.now().toString(),
        content,
        role: 'assistant',
        timestamp: new Date(),
        data: history
      }];
    }
  }
  
  return null;
};
