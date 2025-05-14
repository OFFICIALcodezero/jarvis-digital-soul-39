
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
