import React, { useEffect, useContext } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { toast } from '@/components/ui/sonner';
import { JarvisChatContext } from '@/contexts/JarvisChatProvider';
import { getNewsResponse } from '@/services/newsService';
import { processFileManagerCommand } from '@/services/fileManagerService';
import { processCalculation } from '@/services/calculatorService';
import { processWorldClockQuery, isWorldClockQuery } from '@/services/worldClockService';
import { detectThreats } from '@/services/threatDetectionService';
import { processServiceCommand } from '@/services/serviceIntegrations/serviceCommandHandler';

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
  const sendMessage = jarvisChat?.sendMessage;
  
  useEffect(() => {
    // Security commands
    registerCommand('securityScan', {
      pattern: /(run security scan|scan security|security scan)/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.scan();
        }
        
        toast("Security Scan", {
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
        
        toast("EMERGENCY MODE", {
          description: "Emergency protocols activated!",
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
        
        toast("HACKER MODE", {
          description: "Initializing hacker mode...",
        });
      },
      feedback: "Hacker mode initialized. Security systems engaged."
    });

    // Threat detection
    registerCommand('threatDetection', {
      pattern: /(detect threat|scan for threats|threat detection|security threat)/i,
      handler: async () => {
        if (sendMessage) {
          await sendMessage("detect threat");
        } else {
          // Fallback if context not available
          const phoneNumber = "whatsapp:+13205300568"; // Default Twilio number
          await detectThreats(phoneNumber);
        }
      },
      feedback: "Initiating threat detection. Scanning for potential security threats."
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
          
          toast("System Updates", {
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
        if (sendMessage) {
          await sendMessage("Show me the latest world news");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("world news");
          toast("World News Headlines", {
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
        if (sendMessage) {
          await sendMessage("Show me the latest tech news");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("tech news");
          toast("Technology News", {
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
        if (sendMessage) {
          await sendMessage("Show me the latest news from India");
        } else {
          // Fallback if context not available
          const response = await getNewsResponse("news in India");
          toast("India News", {
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
          if (sendMessage) {
            await sendMessage(`Show me news about ${topic}`);
          } else {
            // Fallback if context not available
            const response = await getNewsResponse(`news on ${topic}`);
            toast(`${topic.charAt(0).toUpperCase() + topic.slice(1)} News`, {
              description: response.text.substring(0, 100) + "...",
            });
          }
        }
      },
      feedback: "Searching for news on your requested topic."
    });
    
    // File management commands
    registerCommand('fileManager', {
      pattern: /(open|create|rename|move|delete|list) (file|folder|document)/i,
      handler: async (transcript) => {
        const response = processFileManagerCommand(transcript);
        if (response) {
          if (sendMessage) {
            await sendMessage(transcript);
          } else {
            toast("File Manager", {
              description: response.message,
            });
          }
        }
      },
      feedback: "Processing file management request."
    });
    
    // Calculator commands
    registerCommand('calculator', {
      pattern: /(calculate|compute|what is|\d+\s*[\+\-\*\/]\s*\d+|convert)/i,
      handler: async (transcript) => {
        const result = processCalculation(transcript);
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          toast("Calculator", {
            description: result.error || `${result.expression} = ${result.result}`,
          });
        }
      },
      feedback: "Calculating your request."
    });
    
    // World clock commands
    registerCommand('worldClock', {
      pattern: /(time|clock) in ([a-zA-Z\s]+)/i,
      handler: async (transcript) => {
        if (isWorldClockQuery(transcript)) {
          const worldClockResult = processWorldClockQuery(transcript);
          
          if (sendMessage) {
            await sendMessage(transcript);
          } else if (worldClockResult) {
            toast(`Time in ${worldClockResult.location}`, {
              description: `${worldClockResult.time} (${worldClockResult.date})`,
            });
          }
        }
      },
      feedback: "Checking world clock information."
    });
    
    // Chat history commands
    registerCommand('chatHistory', {
      pattern: /(show|get) (my|the) (chat history|past questions|conversations|previous)/i,
      handler: async () => {
        if (sendMessage) {
          await sendMessage("Show my chat history");
        } else {
          toast("Chat History", {
            description: "Retrieving your chat history...",
          });
        }
      },
      feedback: "Retrieving your chat history."
    });
    
    // Satellite view command
    registerCommand('satelliteView', {
      pattern: /(satellite view|satellite image|satellite imagery|show satellite|satellite surveillance) (of|for) ([a-zA-Z\s]+)/i,
      handler: async (transcript) => {
        const match = transcript.match(/(satellite view|satellite image|satellite imagery|show satellite|satellite surveillance) (of|for) ([a-zA-Z\s]+)/i);
        if (match && match[3]) {
          const location = match[3].trim();
          if (sendMessage) {
            await sendMessage(`Show satellite view of ${location}`);
          } else {
            toast("Satellite View", {
              description: `Accessing satellite imagery for ${location}...`,
            });
            window.location.href = `/satellite?location=${encodeURIComponent(location)}`;
          }
        }
      },
      feedback: "Accessing satellite surveillance systems."
    });
    
    // Service integration commands
    registerCommand('emailService', {
      pattern: /(send email|resend|email to)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Email Service", {
              description: "Processing email request...",
            });
          }
        }
      },
      feedback: "Processing email request."
    });

    registerCommand('authService', {
      pattern: /(login|signup|authenticate|clerk)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Authentication Service", {
              description: "Processing authentication request...",
            });
          }
        }
      },
      feedback: "Processing authentication request."
    });

    registerCommand('automationService', {
      pattern: /(automate|make workflow|create workflow)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Automation Service", {
              description: "Processing automation request...",
            });
          }
        }
      },
      feedback: "Processing automation request."
    });

    registerCommand('locationService', {
      pattern: /(find location|search location|map|mapbox)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Location Service", {
              description: "Searching for location...",
            });
          }
        }
      },
      feedback: "Searching for location."
    });

    registerCommand('messagingService', {
      pattern: /(send message|call|text|twilio)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Messaging Service", {
              description: "Processing messaging request...",
            });
          }
        }
      },
      feedback: "Processing messaging request."
    });

    registerCommand('searchService', {
      pattern: /(search|serper|web search)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Search Service", {
              description: "Performing web search...",
            });
          }
        }
      },
      feedback: "Performing web search."
    });

    registerCommand('imageService', {
      pattern: /(create image|generate image|bannerbear)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Image Service", {
              description: "Generating image...",
            });
          }
        }
      },
      feedback: "Generating image."
    });

    registerCommand('pdfService', {
      pattern: /(convert pdf|edit pdf|pdf|ilovepdf)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("PDF Service", {
              description: "Processing PDF request...",
            });
          }
        }
      },
      feedback: "Processing PDF request."
    });

    registerCommand('audioService', {
      pattern: /(find sound|audio|sound|freesound)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Audio Service", {
              description: "Searching for sounds...",
            });
          }
        }
      },
      feedback: "Searching for sounds."
    });

    registerCommand('petService', {
      pattern: /(find pet|adopt pet|petfinder)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Pet Service", {
              description: "Searching for pets...",
            });
          }
        }
      },
      feedback: "Searching for pets."
    });

    registerCommand('financeService', {
      pattern: /(stock price|financial data|alphavantage)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Finance Service", {
              description: "Retrieving financial data...",
            });
          }
        }
      },
      feedback: "Retrieving financial data."
    });

    registerCommand('cryptoService', {
      pattern: /(crypto price|bitcoin|ethereum|coinbase)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Crypto Service", {
              description: "Retrieving cryptocurrency data...",
            });
          }
        }
      },
      feedback: "Retrieving cryptocurrency data."
    });

    registerCommand('dataVisualizationService', {
      pattern: /(visualize data|tableau|data viz)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Data Visualization Service", {
              description: "Processing data visualization request...",
            });
          }
        }
      },
      feedback: "Processing data visualization request."
    });

    registerCommand('biService', {
      pattern: /(business intelligence|power bi|report)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Business Intelligence Service", {
              description: "Processing BI request...",
            });
          }
        }
      },
      feedback: "Processing Business Intelligence request."
    });

    registerCommand('timeService', {
      pattern: /(what time|current time|timezone)/i,
      handler: async (transcript) => {
        const now = new Date();
        
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          toast("Time Service", {
            description: `Current time: ${now.toLocaleTimeString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`,
          });
        }
      },
      feedback: "Checking the current time."
    });

    registerCommand('codingService', {
      pattern: /(coding challenge|hackerearth|code)/i,
      handler: async (transcript) => {
        if (sendMessage) {
          await sendMessage(transcript);
        } else {
          const result = await processServiceCommand(transcript);
          if (result.handled) {
            toast("Coding Service", {
              description: "Processing coding request...",
            });
          }
        }
      },
      feedback: "Processing coding request."
    });
    
    return () => {
      // Cleanup
      unregisterCommand('securityScan');
      unregisterCommand('emergencyMode');
      unregisterCommand('hackerMode');
      unregisterCommand('threatDetection');
      unregisterCommand('checkUpdates');
      unregisterCommand('worldNews');
      unregisterCommand('techNews');
      unregisterCommand('indiaNews');
      unregisterCommand('customNews');
      unregisterCommand('fileManager');
      unregisterCommand('calculator');
      unregisterCommand('worldClock');
      unregisterCommand('chatHistory');
      unregisterCommand('satelliteView');
      
      // Clean up service integration commands
      unregisterCommand('emailService');
      unregisterCommand('authService');
      unregisterCommand('automationService');
      unregisterCommand('locationService');
      unregisterCommand('messagingService');
      unregisterCommand('searchService');
      unregisterCommand('imageService');
      unregisterCommand('pdfService');
      unregisterCommand('audioService');
      unregisterCommand('petService');
      unregisterCommand('financeService');
      unregisterCommand('cryptoService');
      unregisterCommand('dataVisualizationService');
      unregisterCommand('biService');
      unregisterCommand('timeService');
      unregisterCommand('codingService');
    };
  }, [registerCommand, unregisterCommand, hackerModeActive, onActivateHacker, sendMessage]);
  
  return null; // This is a non-visual component
};

export default JarvisVoiceCommands;
