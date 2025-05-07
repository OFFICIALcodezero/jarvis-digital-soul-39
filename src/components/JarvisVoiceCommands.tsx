
import React, { useEffect, useContext } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { JarvisChatContext } from '@/contexts/JarvisChatProvider';
import { getNewsResponse } from '@/services/newsService';
import { getWeatherResponse } from '@/services/weatherService';
import { getTimeCalendarResponse } from '@/services/timeCalendarService';
import { processTaskCommand } from '@/services/taskManagementService';
import { toast } from '@/components/ui/use-toast';

interface JarvisVoiceCommandsProps {
  isListening: boolean;
  hackerModeActive: boolean;
  onActivateHacker: () => void;
}

const JarvisVoiceCommands: React.FC<JarvisVoiceCommandsProps> = ({ 
  isListening, 
  hackerModeActive,
  onActivateHacker
}) => {
  const { transcript, registerCommand, unregisterCommand } = useVoiceCommands(isListening);
  // Use the context directly instead of the hook to avoid the provider requirement
  const jarvisChat = useContext(JarvisChatContext);
  
  // Safely send message if the context is available
  const sendMessage = (message: string) => {
    if (jarvisChat && typeof jarvisChat === 'object' && 'handleImageGenerationFromPrompt' in jarvisChat) {
      // Use handleImageGenerationFromPrompt which is available in the context
      (jarvisChat as any).handleImageGenerationFromPrompt(message);
    }
  };
  
  // Register available voice commands
  useEffect(() => {
    // Command to launch hacker mode
    registerCommand('launch-hacker', {
      pattern: /launch.+hacker|hacker.+mode|enable.+hacker/i,
      handler: () => {
        onActivateHacker();
      },
      feedback: "Hacker mode activated. Security protocols engaged."
    });
    
    // Wake up / Sleep commands
    registerCommand('wake-up', {
      pattern: /wake.+up|hey.+jarvis|wake.+jarvis/i,
      handler: () => {
        if (window.JARVIS) {
          console.log("Jarvis activated and listening");
        }
      },
      feedback: "I'm awake and listening, sir."
    });
    
    registerCommand('sleep', {
      pattern: /go.+sleep|sleep.+mode|goodbye|bye.+jarvis/i,
      handler: () => {
        if (window.JARVIS) {
          console.log("Jarvis entering sleep mode");
        }
      },
      feedback: "Going into sleep mode. Call me when you need me."
    });
    
    // Time and date commands
    registerCommand('time', {
      pattern: /what.*time|current.+time|tell.+time/i,
      handler: async () => {
        const timeResponse = await getTimeCalendarResponse("What time is it?");
        sendMessage(timeResponse.text);
      },
      feedback: new Date().toLocaleTimeString()
    });
    
    registerCommand('date', {
      pattern: /what.*date|current.+date|today.+date|what.+day/i,
      handler: async () => {
        const dateResponse = await getTimeCalendarResponse("What is today's date?");
        sendMessage(dateResponse.text);
      },
      feedback: new Date().toLocaleDateString()
    });
    
    // Task and reminder commands
    registerCommand('add-task', {
      pattern: /add.+task|remind.+me.+to|set.+reminder|create.+task/i,
      handler: (text) => {
        const taskInfo = processTaskCommand(text);
        sendMessage(`Adding task: ${taskInfo.data?.task || "unknown task"}`);
      },
      feedback: "Task added to your list."
    });
    
    // Weather commands
    registerCommand('weather', {
      pattern: /weather.+in|weather.+at|what.+weather|temperature.+in/i,
      handler: async (text) => {
        const weatherResponse = await getWeatherResponse(text);
        sendMessage(weatherResponse.text);
      },
      feedback: "Checking weather information for you."
    });
    
    // Web search
    registerCommand('web-search', {
      pattern: /search.+for|search.+web|google|look.+up/i,
      handler: (text) => {
        const query = text.replace(/search.+for|search|google|look.+up/i, '').trim();
        sendMessage(`Searching for: ${query}`);
        
        // In a real implementation, this would integrate with a search API
        console.log(`Web search for: ${query}`);
      },
      feedback: "Searching the web for your query."
    });
    
    // Music controls
    registerCommand('play-music', {
      pattern: /play.+music|start.+music|play.+song/i,
      handler: () => {
        // In a real implementation, this would integrate with a music service
        sendMessage("Playing music");
        console.log("Music playback started");
      },
      feedback: "Starting music playback."
    });
    
    registerCommand('stop-music', {
      pattern: /stop.+music|pause.+music|stop.+song/i,
      handler: () => {
        // In a real implementation, this would integrate with a music service
        sendMessage("Stopping music");
        console.log("Music playback stopped");
      },
      feedback: "Music playback stopped."
    });
    
    // Alarm and timer
    registerCommand('set-alarm', {
      pattern: /set.+alarm.+for|wake.+me.+at/i,
      handler: (text) => {
        const timeMatch = text.match(/(\d{1,2})[:\s]?(\d{2})?\s*(am|pm)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
          const period = timeMatch[3]?.toLowerCase();
          
          // Convert to 24-hour format if needed
          if (period === 'pm' && hours < 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
          
          sendMessage(`Setting alarm for ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
          
          // In a real implementation, this would set an actual alarm
          console.log(`Alarm set for ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
        } else {
          sendMessage("I couldn't understand the time for the alarm.");
        }
      },
      feedback: "Alarm has been set."
    });
    
    registerCommand('set-timer', {
      pattern: /set.+timer|start.+timer.+for|countdown.+for/i,
      handler: (text) => {
        const durationMatch = text.match(/(\d+)\s*(minute|minutes|min|hour|hours|second|seconds|sec)/i);
        
        if (durationMatch) {
          const amount = parseInt(durationMatch[1]);
          const unit = durationMatch[2].toLowerCase();
          
          let milliseconds = 0;
          if (unit.includes('hour')) milliseconds = amount * 60 * 60 * 1000;
          else if (unit.includes('min')) milliseconds = amount * 60 * 1000;
          else milliseconds = amount * 1000;
          
          // In a real implementation, this would set an actual timer
          sendMessage(`Setting timer for ${amount} ${unit}`);
          console.log(`Timer set for ${milliseconds}ms`);
          
          setTimeout(() => {
            toast({
              title: "Timer Completed",
              description: `Your ${amount} ${unit} timer has finished.`,
            });
          }, milliseconds);
        } else {
          sendMessage("I couldn't understand the duration for the timer.");
        }
      },
      feedback: "Timer started."
    });
    
    // Email and messaging
    registerCommand('send-email', {
      pattern: /send.+email|email.+to|compose.+email/i,
      handler: (text) => {
        // Extract recipient from text
        const recipientMatch = text.match(/to\s+([a-zA-Z\s]+)/i);
        const recipient = recipientMatch ? recipientMatch[1] : "unknown recipient";
        
        // In a real implementation, this would open an email composer
        sendMessage(`Preparing email to ${recipient}`);
        console.log(`Email preparation for ${recipient}`);
      },
      feedback: "Preparing email composer."
    });
    
    registerCommand('send-message', {
      pattern: /send.+message|message.+to|text.+to|whatsapp.+to/i,
      handler: (text) => {
        // Extract recipient from text
        const recipientMatch = text.match(/to\s+([a-zA-Z\s]+)/i);
        const recipient = recipientMatch ? recipientMatch[1] : "unknown recipient";
        
        // In a real implementation, this would integrate with a messaging service
        sendMessage(`Sending message to ${recipient}`);
        console.log(`Message preparation for ${recipient}`);
      },
      feedback: "Preparing message."
    });
    
    // App launcher
    registerCommand('open-app', {
      pattern: /open.+app|launch.+app|start.+app|open\s+([a-zA-Z\s]+)/i,
      handler: (text) => {
        // Extract app name from text
        const appMatch = text.match(/open\s+([a-zA-Z\s]+)/i);
        const appName = appMatch ? appMatch[1] : "unknown app";
        
        // In a real implementation, this would launch the application
        sendMessage(`Opening ${appName}`);
        console.log(`App launch request: ${appName}`);
      },
      feedback: "Launching application."
    });
    
    // AI tools
    registerCommand('summarize', {
      pattern: /summarize.+pdf|summarize.+document|summarize.+text/i,
      handler: () => {
        // In a real implementation, this would use an AI service to summarize text
        sendMessage("Please upload the document you'd like me to summarize.");
        console.log("Document summarization requested");
      },
      feedback: "Ready to summarize document. Please upload it."
    });
    
    registerCommand('translate', {
      pattern: /translate.+to|translation|translate.+text/i,
      handler: (text) => {
        // Extract language from text
        const languageMatch = text.match(/to\s+([a-zA-Z\s]+)/i);
        const language = languageMatch ? languageMatch[1] : "English";
        
        // In a real implementation, this would use a translation service
        sendMessage(`Translating to ${language}`);
        console.log(`Translation to ${language} requested`);
      },
      feedback: "Translation service ready."
    });
    
    // Hacker mode commands
    registerCommand('trace-ip', {
      pattern: /trace.+ip|track.+address|locate.+ip/i,
      handler: () => {
        if (!hackerModeActive) {
          onActivateHacker();
        }
        sendMessage("Initiating IP trace");
      },
      feedback: "IP tracing initialized. Hacker mode engaged."
    });
    
    registerCommand('launch-tor', {
      pattern: /launch.+tor|start.+tor.+browser|anonymous.+browsing/i,
      handler: () => {
        if (!hackerModeActive) {
          onActivateHacker();
        }
        sendMessage("Launching Tor browser for anonymous browsing");
      },
      feedback: "Tor network connection established. Anonymity protocols active."
    });
    
    // News commands
    registerCommand('global-news', {
      pattern: /world.+news|global.+news|international.+news|show.+world.+news/i,
      handler: async () => {
        const newsResponse = await getNewsResponse("Show world news");
        sendMessage(newsResponse.text);
      },
      feedback: "Fetching global news headlines."
    });
    
    registerCommand('tech-news', {
      pattern: /tech.+news|technology.+updates|tech.+updates|give.+tech/i,
      handler: async () => {
        const newsResponse = await getNewsResponse("tech news");
        sendMessage(newsResponse.text);
      },
      feedback: "Retrieving technology news updates."
    });
    
    registerCommand('india-news', {
      pattern: /india.+news|news.+india|indian.+headlines/i,
      handler: async () => {
        const newsResponse = await getNewsResponse("news in India");
        sendMessage(newsResponse.text);
      },
      feedback: "Gathering latest headlines from India."
    });
    
    registerCommand('custom-news', {
      pattern: /news.+on|news.+about|headlines.+about/i,
      handler: async (text) => {
        // Extract topic from the command
        const topicMatch = text.match(/on\s+([a-zA-Z\s]+)|about\s+([a-zA-Z\s]+)/i);
        const topic = topicMatch ? (topicMatch[1] || topicMatch[2]) : "general";
        
        const newsResponse = await getNewsResponse(`news on ${topic}`);
        sendMessage(newsResponse.text);
      },
      feedback: "Searching for news on your requested topic."
    });
    
    // Command to run security scan
    registerCommand('security-scan', {
      pattern: /security\s+scan|run\s+scan|threat\s+scan|check\s+security/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.scan();
        }
        sendMessage("Run a security scan");
      },
      feedback: "Initiating security scan. Checking for threats."
    });
    
    // Command to activate emergency mode
    registerCommand('emergency-mode', {
      pattern: /emergency\s+mode|activate\s+lockdown|security\s+lockdown/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.setEmergencyMode();
        }
        sendMessage("Activate emergency mode");
      },
      feedback: "Emergency mode activated. System locked down. Network connections disabled."
    });
    
    // Command to create system backup
    registerCommand('system-backup', {
      pattern: /create\s+backup|backup\s+system|save\s+system\s+state/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.system) {
          window.JARVIS.system.backup();
        }
        sendMessage("Create a system backup");
      },
      feedback: "Creating system backup. This will take a few moments."
    });
    
    // Command to check for updates
    registerCommand('check-updates', {
      pattern: /check\s+(for\s+)?updates|update\s+system/i,
      handler: () => {
        sendMessage("Check for system updates");
      },
      feedback: "Checking for system updates."
    });
    
    // Command to scan for nearby objects
    registerCommand('scan-objects', {
      pattern: /scan\s+(for\s+)?objects|detect\s+objects/i,
      handler: () => {
        sendMessage("Scan for objects in my environment");
      },
      feedback: "Initiating object detection scan."
    });
    
    // Clean up commands when component unmounts
    return () => {
      unregisterCommand('launch-hacker');
      unregisterCommand('wake-up');
      unregisterCommand('sleep');
      unregisterCommand('time');
      unregisterCommand('date');
      unregisterCommand('add-task');
      unregisterCommand('weather');
      unregisterCommand('web-search');
      unregisterCommand('play-music');
      unregisterCommand('stop-music');
      unregisterCommand('set-alarm');
      unregisterCommand('set-timer');
      unregisterCommand('send-email');
      unregisterCommand('send-message');
      unregisterCommand('open-app');
      unregisterCommand('summarize');
      unregisterCommand('translate');
      unregisterCommand('trace-ip');
      unregisterCommand('launch-tor');
      unregisterCommand('global-news');
      unregisterCommand('tech-news');
      unregisterCommand('india-news');
      unregisterCommand('custom-news');
      unregisterCommand('security-scan');
      unregisterCommand('emergency-mode');
      unregisterCommand('system-backup');
      unregisterCommand('check-updates');
      unregisterCommand('scan-objects');
    };
  }, [registerCommand, unregisterCommand, onActivateHacker, sendMessage, hackerModeActive]);

  return null; // This is a non-UI component
};

export default JarvisVoiceCommands;
