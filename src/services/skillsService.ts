import { getWeatherResponse } from './weatherService';
import { getNewsResponse } from './newsService';
import { getTimeCalendarResponse } from './timeCalendarService';
import { getDailyBriefing } from './dailyBriefingService';
import { parseImageRequest } from './imagePromptParser';
import { generateImage } from './imageGenerationService';

export interface SkillResponse {
  text: string;
  data?: any;
  shouldSpeak: boolean;
  skillType: 'weather' | 'news' | 'time' | 'calendar' | 'briefing' | 'image' | 'system' | 'security' | 'analysis' | 'general' | 'unknown';
}

// Simulate system status
const getSystemStatus = () => {
  return {
    cpu: Math.round(Math.random() * 30 + 70), // 70-100%
    memory: Math.round(Math.random() * 40 + 60), // 60-100%
    network: Math.round(Math.random() * 20 + 80), // 80-100%
    temperature: Math.round(Math.random() * 10 + 35), // 35-45°C
  };
};

// Simulate security protocols
const securityProtocols = [
  'Mark VII Deployment Protocol',
  'House Party Protocol',
  'Clean Slate Protocol',
  'Safe House Protocol',
  'Barn Door Protocol'
];

export const processSkillCommand = async (command: string): Promise<SkillResponse> => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // System Analysis & Diagnostics
    if (lowerCommand.includes('system status') || 
        lowerCommand.includes('diagnostics') || 
        lowerCommand.includes('system health')) {
      const status = getSystemStatus();
      return {
        text: `System diagnostics: CPU performance at ${status.cpu}%, Memory usage at ${status.memory}%, Network stability at ${status.network}%, Core temperature at ${status.temperature}°C. All systems operating within normal parameters, sir.`,
        data: status,
        shouldSpeak: true,
        skillType: 'system'
      };
    }
    
    // Security Protocols
    else if (lowerCommand.includes('security protocol') || 
             lowerCommand.includes('protocols') ||
             lowerCommand.includes('security status')) {
      const protocol = securityProtocols[Math.floor(Math.random() * securityProtocols.length)];
      return {
        text: `Security systems engaged. ${protocol} is active and ready. All defense systems are operational, sir.`,
        data: { activeProtocol: protocol },
        shouldSpeak: true,
        skillType: 'security'
      };
    }
    
    // Advanced Analysis Mode
    else if (lowerCommand.includes('analyze') || 
             lowerCommand.includes('scan') ||
             lowerCommand.includes('evaluate')) {
      const target = lowerCommand.replace(/(analyze|scan|evaluate)/g, '').trim();
      return {
        text: `Running advanced analysis on ${target}. Processing environmental data, structural integrity, and potential vulnerabilities. Analysis complete. No immediate threats detected.`,
        data: {
          target,
          threatLevel: 'low',
          integrity: '98%'
        },
        shouldSpeak: true,
        skillType: 'analysis'
      };
    }
    
    // Weather related queries
    else if (lowerCommand.includes('weather') || 
             lowerCommand.includes('rain') || 
             lowerCommand.includes('temperature') ||
             lowerCommand.includes('forecast')) {
      const response = await getWeatherResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'weather'
      };
    }
    
    // News related queries
    else if (lowerCommand.includes('news') || 
             lowerCommand.includes('headlines') || 
             lowerCommand.includes('happening') ||
             lowerCommand.includes('latest stories')) {
      const response = await getNewsResponse(command);
      return {
        text: response.text,
        data: response.articles,
        shouldSpeak: true,
        skillType: 'news'
      };
    }
    
    // Time related queries
    else if (lowerCommand.includes('time') || 
             lowerCommand.includes('date') ||
             lowerCommand.includes('day')) {
      const response = await getTimeCalendarResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'time'
      };
    }
    
    // Calendar/schedule related queries
    else if (lowerCommand.includes('schedule') || 
             lowerCommand.includes('calendar') || 
             lowerCommand.includes('event') ||
             lowerCommand.includes('meeting')) {
      const response = await getTimeCalendarResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'calendar'
      };
    }
    
    // Daily briefing
    else if (lowerCommand.includes('briefing') || 
             lowerCommand.includes('update me') || 
             lowerCommand.includes('what\'s up') ||
             lowerCommand.includes('daily update') ||
             lowerCommand.includes('good morning')) {
      const response = await getDailyBriefing();
      return {
        text: response.text,
        data: response.briefing,
        shouldSpeak: true,
        skillType: 'briefing'
      };
    }
    
    // Image generation queries
    else if (lowerCommand.includes('generate image') || 
             lowerCommand.includes('create image') || 
             lowerCommand.includes('make image') ||
             lowerCommand.includes('draw') ||
             (lowerCommand.includes('generate') && lowerCommand.includes('picture')) ||
             (lowerCommand.includes('create') && lowerCommand.includes('picture'))) {
      const imageParams = parseImageRequest(command);
      const generatedImage = await generateImage(imageParams);
      
      return {
        text: `Here is the image I created based on your prompt: "${imageParams.prompt}"`,
        data: generatedImage,
        shouldSpeak: true,
        skillType: 'image'
      };
    }
    
    // Fall back to general query
    return {
      text: "Very well, sir. I'll process that request through my general query system.",
      shouldSpeak: false,
      skillType: 'general'
    };
    
  } catch (error) {
    console.error('Error processing skill command:', error);
    return {
      text: "I apologize, sir, but I've encountered an error processing your request. Shall I run a diagnostic?",
      shouldSpeak: true,
      skillType: 'unknown'
    };
  }
};

// Check if the command is a skill-related command
export const isSkillCommand = (command: string): boolean => {
  const lowerCommand = command.toLowerCase();
  
  return lowerCommand.includes('weather') ||
         lowerCommand.includes('rain') ||
         lowerCommand.includes('temperature') ||
         lowerCommand.includes('forecast') ||
         lowerCommand.includes('news') ||
         lowerCommand.includes('headlines') ||
         lowerCommand.includes('happening') ||
         lowerCommand.includes('time') ||
         lowerCommand.includes('date') ||
         lowerCommand.includes('day') ||
         lowerCommand.includes('schedule') ||
         lowerCommand.includes('calendar') ||
         lowerCommand.includes('event') ||
         lowerCommand.includes('briefing') ||
         lowerCommand.includes('update me') ||
         lowerCommand.includes('what\'s up') ||
         lowerCommand.includes('good morning') ||
         lowerCommand.includes('generate image') ||
         lowerCommand.includes('create image') ||
         lowerCommand.includes('make image') ||
         lowerCommand.includes('draw') ||
         lowerCommand.includes('system status') ||
         lowerCommand.includes('diagnostics') ||
         lowerCommand.includes('security protocol') ||
         lowerCommand.includes('analyze') ||
         lowerCommand.includes('scan') ||
         (lowerCommand.includes('generate') && lowerCommand.includes('picture')) ||
         (lowerCommand.includes('create') && lowerCommand.includes('picture'));
};
