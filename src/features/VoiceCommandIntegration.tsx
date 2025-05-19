
import React, { useEffect, useState, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCommandIntegrationProps {
  isActive: boolean;
}

interface RemoteUser {
  id: string;
  name: string;
  status: 'idle' | 'speaking' | 'processing';
  lastSeen: Date;
}

const VoiceCommandIntegration: React.FC<VoiceCommandIntegrationProps> = ({ 
  isActive
}) => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    clearTranscript,
    isSupported 
  } = useSpeechRecognition();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [userId] = useState<string>(`user_${Math.random().toString(36).substring(2, 9)}`);
  const [userName] = useState<string>(`User_${Math.floor(Math.random() * 1000)}`);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCommandsRef = useRef<Set<string>>(new Set());
  
  // Get JarvisChat context safely with a fallback
  let sendMessage: (message: string) => Promise<void>;
  let isSpeaking = false;
  
  // Try-catch to handle possible context not being available
  try {
    // Dynamically import to avoid direct usage that could throw an error
    const { useJarvisChat } = require('@/components/JarvisChatContext');
    try {
      const jarvisChat = useJarvisChat();
      sendMessage = jarvisChat.sendMessage;
      isSpeaking = jarvisChat.isSpeaking;
    } catch (error) {
      // Context not available, use fallback
      console.warn("JarvisChat context not available, using fallback values");
      sendMessage = async (message: string) => {
        console.log("Would send message:", message);
        toast({
          title: "Voice Command",
          description: `Received: "${message}" (Context unavailable)`,
        });
      };
    }
  } catch (error) {
    // Module not available or other error
    console.warn("JarvisChat module not available");
    sendMessage = async (message: string) => {
      console.log("Would send message:", message);
      toast({
        title: "Voice Command",
        description: `Received: "${message}" (Module unavailable)`,
      });
    };
  }
  
  // Set up and connect to Supabase Realtime for command broadcasting and presence
  useEffect(() => {
    if (!isActive) return;
    
    // Create a realtime channel for voice commands
    const channel = supabase.channel('voice_commands', {
      config: {
        broadcast: { self: true },
        presence: { key: userId },
      }
    });

    // Handle incoming voice commands from other clients
    channel
      .on('broadcast', { event: 'voice_command' }, (payload) => {
        console.log('Received broadcast voice command:', payload);
        if (payload.payload && payload.payload.command) {
          // Add visual indicator that command was received remotely
          toast({
            title: `Command from ${payload.payload.userName || "Remote User"}`,
            description: `Processing: "${payload.payload.command}"`,
          });
          
          // Process the command but don't broadcast it again
          processCommand(payload.payload.command, false, payload.payload.userName);
        }
      })
      .on('broadcast', { event: 'status_update' }, (payload) => {
        if (payload.payload && payload.payload.userId && payload.payload.status) {
          // Update the status of remote users
          setRemoteUsers(prev => {
            // Find if user already exists in our state
            const userIndex = prev.findIndex(u => u.id === payload.payload.userId);
            
            if (userIndex >= 0) {
              // Update existing user
              const newUsers = [...prev];
              newUsers[userIndex] = {
                ...newUsers[userIndex],
                status: payload.payload.status,
                lastSeen: new Date()
              };
              return newUsers;
            } else if (payload.payload.userName) {
              // Add new user
              return [...prev, {
                id: payload.payload.userId,
                name: payload.payload.userName,
                status: payload.payload.status,
                lastSeen: new Date()
              }];
            }
            
            return prev;
          });
        }
      })
      .on('presence', { event: 'sync' }, () => {
        // Get current state of all users in the channel
        const state = channel.presenceState();
        console.log('Presence state synced:', state);
        
        // Transform presence state into our RemoteUsers format
        const users: RemoteUser[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          // Skip our own user ID
          if (key === userId) return;
          
          // Add each presence as a user
          if (Array.isArray(presences) && presences.length > 0) {
            const presence = presences[0] as any;
            users.push({
              id: key,
              name: presence.userName || 'Anonymous',
              status: presence.status || 'idle',
              lastSeen: new Date()
            });
          }
        });
        
        setRemoteUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        
        if (key !== userId && newPresences.length > 0) {
          const newUser = newPresences[0] as any;
          
          toast({
            title: "User Connected",
            description: `${newUser.userName || 'A new user'} joined voice command system`,
          });
          
          // Add to our list of remote users
          setRemoteUsers(prev => {
            // Check if user already exists
            if (prev.some(user => user.id === key)) {
              return prev.map(user => 
                user.id === key 
                  ? { 
                      ...user, 
                      status: newUser.status || 'idle',
                      lastSeen: new Date() 
                    } 
                  : user
              );
            } else {
              return [...prev, {
                id: key,
                name: newUser.userName || 'Anonymous',
                status: newUser.status || 'idle',
                lastSeen: new Date()
              }];
            }
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        
        if (key !== userId && leftPresences.length > 0) {
          const leftUser = leftPresences[0] as any;
          
          toast({
            title: "User Disconnected",
            description: `${leftUser.userName || 'A user'} left voice command system`,
          });
          
          // Remove from our list of remote users
          setRemoteUsers(prev => prev.filter(user => user.id !== key));
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to voice commands channel');
          setRealtimeChannel(channel);
          
          // Track our presence with name and status
          await channel.track({
            userName,
            status: 'idle',
            joinedAt: new Date().toISOString()
          });
        }
      });

    return () => {
      if (channel) {
        console.log('Removing voice commands channel');
        supabase.removeChannel(channel);
      }
    };
  }, [isActive, userId, userName]);
  
  // Update our status in the presence system
  useEffect(() => {
    if (!realtimeChannel) return;
    
    const updateStatus = async () => {
      const status = isProcessing ? 'processing' : isListening ? 'speaking' : 'idle';
      
      // Update our presence
      await realtimeChannel.track({
        userName,
        status,
        updatedAt: new Date().toISOString()
      });
      
      // Also broadcast status update for immediate notification
      await realtimeChannel.send({
        type: 'broadcast',
        event: 'status_update',
        payload: { userId, userName, status }
      }).catch(err => console.error('Error broadcasting status:', err));
    };
    
    updateStatus();
  }, [isListening, isProcessing, realtimeChannel, userId, userName]);
  
  // Start/stop listening based on active status
  useEffect(() => {
    if (isActive && !isListening && isSupported) {
      startListening();
      console.log("Voice recognition started");
    } else if (!isActive && isListening) {
      stopListening();
      console.log("Voice recognition stopped");
    }
    
    return () => {
      if (isListening) {
        stopListening();
        console.log("Voice recognition cleanup");
      }
      
      // Clear any pending command timeouts
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    };
  }, [isActive, isListening, startListening, stopListening, isSupported]);
  
  // Process transcript when it changes
  useEffect(() => {
    if (!transcript || transcript === lastProcessedTranscript || isSpeaking || isProcessing) return;
    
    // Check for wake word "Jarvis"
    const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(transcript);
    
    if (hasWakeWord) {
      console.log("Wake word detected:", transcript);
      
      // Process command and broadcast to other clients
      processCommand(transcript, true);
      setLastProcessedTranscript(transcript);
      clearTranscript();
    }
  }, [transcript, lastProcessedTranscript, isSpeaking, isProcessing]);
  
  // Function to process voice commands with debouncing and broadcasting
  const processCommand = async (command: string, shouldBroadcast: boolean = true, remoteName?: string) => {
    // Prevent processing if this command is already being handled
    if (activeCommandsRef.current.has(command)) {
      return;
    }
    
    // Add to active commands
    activeCommandsRef.current.add(command);
    setIsProcessing(true);
    
    // Notify user
    toast({
      title: remoteName ? `Processing ${remoteName}'s Command` : "Voice Command Detected",
      description: `Processing: "${command}"`,
    });
    
    // Broadcast command to other clients
    if (shouldBroadcast && realtimeChannel) {
      try {
        await realtimeChannel.send({
          type: 'broadcast',
          event: 'voice_command',
          payload: { command, userId, userName }
        });
        console.log("Voice command broadcast to other clients");
      } catch (error) {
        console.error("Error broadcasting voice command:", error);
      }
    }
    
    try {
      // Process the command
      await sendMessage(command);
    } catch (error) {
      console.error("Error processing voice command:", error);
    } finally {
      // Add delay before allowing the same command again
      commandTimeoutRef.current = setTimeout(() => {
        activeCommandsRef.current.delete(command);
        setIsProcessing(false);
      }, 2000);
    }
  };
  
  // Cleanup function for remote users who haven't been seen in a while
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setRemoteUsers(prev => 
        prev.filter(user => {
          // Remove users not seen for over 5 minutes
          return now.getTime() - user.lastSeen.getTime() < 5 * 60 * 1000;
        })
      );
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return null; // This is a non-visual component
};

export default VoiceCommandIntegration;
