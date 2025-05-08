
import React, { useEffect, useContext } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { toast } from '@/components/ui/use-toast';
import { JarvisChatContext } from '@/contexts/JarvisChatProvider';
import { getNewsResponse } from '@/services/newsService';

interface JarvisVoiceCommandsProps {
  isListening: boolean;
  hackerModeActive?: boolean;
  onActivateHacker?: () => void;
}

const JarvisVoiceCommands: React.FC<JarvisVoiceCommandsProps> = ({ 
  isListening, 
  hackerModeActive = false,
  onActivateHacker
}) => {
  const { registerCommand, unregisterCommand } = useVoiceCommands(isListening);
  
  // Get chat context for messaging
  const jarvisChat = useContext(JarvisChatContext);
  const processUserMessage = jarvisChat?.processUserMessage;
  
  useEffect(() => {
    // Security commands
    registerCommand('securityScan', {
      pattern: /(run security scan|scan security|security scan)/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.scan();
        }
        
        toast({
          title: "Security Scan",
          description: "Running security scan...",
        });
      },
      feedback: "Initiating security scan of all systems."
    });
    
    // Emergency mode
    registerCommand('emergencyMode', {
      pattern: /(emergency mode|activate emergency|emergency protocol)/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.setEmergencyMode();
        }
        
        toast({
          title: "EMERGENCY MODE",
          description: "Emergency protocols activated!",
          variant: "destructive",
        });
      },
      feedback: "Emergency mode activated. All systems on high alert."
    });
    
    // Hacker mode
    registerCommand('hackerMode', {
      pattern: /(hacker mode|activate hacker|hacking mode|launch hacker)/i,
      handler: () => {
        if (onActivateHacker) {
          onActivateHacker();
        }
        
        toast({
          title: "HACKER MODE",
          description: "Initializing hacker mode...",
          variant: "default",
        });
      },
      feedback: "Hacker mode initialized. Security systems engaged."
    });
    
    // System updates
    registerCommand('checkUpdates', {
      pattern: /(check for updates|system updates|update status)/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.system) {
          const updateStatus = window.JARVIS.system.getUpdateStatus();
          
          let updateMessage = "System update status: ";
          Object.entries(updateStatus).forEach(([module, status]) => {
            updateMessage += `${module}: ${status}. `;
          });
          
          toast({
            title: "System Updates",
            description: updateMessage,
          });
        }
      },
      feedback: "Checking for system updates."
    });
    
    // World news command
    registerCommand('worldNews', {
      pattern: /(world news|global news|what's happening|news headlines|latest news)/i,
      handler: async () => {
        if (processUserMessage) {
          await processUserMessage("Show me the latest world news");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("world news");
          toast({
            title: "World News Headlines",
            description: response.text.substring(0, 100) + "...",
          });
        }
      },
      feedback: "Fetching the latest world news headlines."
    });
    
    // Tech news command
    registerCommand('techNews', {
      pattern: /(tech news|technology news|tech updates)/i,
      handler: async () => {
        if (processUserMessage) {
          await processUserMessage("Show me the latest tech news");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("tech news");
          toast({
            title: "Technology News",
            description: response.text.substring(0, 100) + "...",
          });
        }
      },
      feedback: "Fetching the latest technology news."
    });
    
    // India news command
    registerCommand('indiaNews', {
      pattern: /(india news|indian news|news from india)/i,
      handler: async () => {
        if (processUserMessage) {
          await processUserMessage("Show me the latest news from India");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("news in India");
          toast({
            title: "India News",
            description: response.text.substring(0, 100) + "...",
          });
        }
      },
      feedback: "Fetching the latest news from India."
    });
    
    // Custom topic news command
    registerCommand('customNews', {
      pattern: /news (about|on) ([a-zA-Z\s]+)/i,
      handler: async (transcript) => {
        const match = transcript.match(/news (about|on) ([a-zA-Z\s]+)/i);
        if (match && match[2]) {
          const topic = match[2].trim();
          if (processUserMessage) {
            await processUserMessage(`Show me news about ${topic}`);
          } else {
            // Fallback if context not available
            const response = await getNewsResponse(`news on ${topic}`);
            toast({
              title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} News`,
              description: response.text.substring(0, 100) + "...",
            });
          }
        }
      },
      feedback: "Searching for news on your requested topic."
    });
    
    return () => {
      // Cleanup
      unregisterCommand('securityScan');
      unregisterCommand('emergencyMode');
      unregisterCommand('hackerMode');
      unregisterCommand('checkUpdates');
      unregisterCommand('worldNews');
      unregisterCommand('techNews');
      unregisterCommand('indiaNews');
      unregisterCommand('customNews');
    };
  }, [registerCommand, unregisterCommand, hackerModeActive, onActivateHacker, processUserMessage]);
  
  return null; // This component doesn't render anything
};

export default JarvisVoiceCommands;
