
import { getWeatherResponse } from './weatherService';
import { getNewsResponse } from './newsService';
import { getTimeCalendarResponse } from './timeCalendarService';
import { getDailyBriefing } from './dailyBriefingService';

export interface SkillResponse {
  text: string;
  data?: any;
  shouldSpeak: boolean;
  skillType: 'weather' | 'news' | 'time' | 'calendar' | 'briefing' | 'general' | 'unknown';
}

export const processSkillCommand = async (command: string): Promise<SkillResponse> => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // Weather related queries
    if (lowerCommand.includes('weather') || 
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
    
    // Fall back to general query
    return {
      text: "I don't have a specific skill for that query. Let me search for an answer.",
      shouldSpeak: false,
      skillType: 'general'
    };
    
  } catch (error) {
    console.error('Error processing skill command:', error);
    return {
      text: "I'm sorry, I encountered an error processing your request.",
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
         lowerCommand.includes('good morning');
};
