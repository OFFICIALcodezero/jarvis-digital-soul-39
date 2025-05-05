import { getWeatherResponse } from './weatherService';
import { getNewsResponse } from './newsService';
import { getTimeCalendarResponse } from './timeCalendarService';
import { getDailyBriefing } from './dailyBriefingService';
import { parseImageRequest } from './imagePromptParser';
import { generateImage } from './imageGenerationService';
import { parseImagePrompt, generateStabilityImage, isImageGenerationPrompt, extractImagePrompt } from './stabilityAIService';
import { analyzeEmotions, analyzeSentiment, getEmpatheticPrefix } from './emotionalIntelligenceService';
import { processTaskCommand } from './taskManagementService';
import { isTranslationRequest, processTranslationRequest, detectLanguage, supportedLanguages } from './languageService';

export interface SkillResponse {
  text: string;
  data?: any;
  shouldSpeak: boolean;
  skillType: 'weather' | 'news' | 'time' | 'calendar' | 'briefing' | 'image' | 'stability-image' | 'general' | 'unknown' | 'task' | 'emotion' | 'translation';
}

export const processSkillCommand = async (command: string): Promise<SkillResponse> => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // Detect language first for multilingual support
    const detectedLanguage = await detectLanguage(command);
    
    // Translation requests
    if (isTranslationRequest(lowerCommand)) {
      const translatedText = await processTranslationRequest(command, command.replace(/translate(?:\s+this)?\s+to\s+\w+|in\s+\w+(?:\s+language)?/i, '').trim());
      return {
        text: translatedText,
        data: { originalText: command, translatedText },
        shouldSpeak: true,
        skillType: 'translation'
      };
    }
    
    // Task management
    if (lowerCommand.includes('task') || 
        lowerCommand.includes('remind me') || 
        lowerCommand.includes('to do') ||
        lowerCommand.includes('add to my list')) {
      const taskResponse = processTaskCommand(command);
      return {
        text: taskResponse.response,
        data: taskResponse.data || {},
        shouldSpeak: true,
        skillType: 'task'
      };
    }
    
    // Emotion recognition (when the user asks about emotions or seems emotional)
    else if (lowerCommand.includes('how do i sound') ||
             lowerCommand.includes('how do i feel') ||
             lowerCommand.includes('analyze my emotion') ||
             lowerCommand.includes('analyze my sentiment') ||
             lowerCommand.includes('my mood')) {
      
      const emotions = analyzeEmotions(command);
      const sentiment = analyzeSentiment(command);
      
      let response = `I detect ${emotions.dominant} as your primary emotion`;
      
      if (sentiment.magnitude > 0.5) {
        response += ` with a ${sentiment.label} sentiment (${sentiment.score.toFixed(2)}).`;
      } else {
        response += '.';
      }
      
      return {
        text: response,
        data: { emotions, sentiment },
        shouldSpeak: true,
        skillType: 'emotion'
      };
    }
    
    // Weather related queries
    if (lowerCommand.includes('weather') || 
        lowerCommand.includes('rain') || 
        lowerCommand.includes('temperature') ||
        lowerCommand.includes('forecast')) {
      const response = await getWeatherResponse(command);
      
      // Add emotional intelligence
      const empatheticPrefix = getEmpatheticPrefix(command);
      
      return {
        text: empatheticPrefix + response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'weather'
      };
    }
    
    // News related queries - Enhanced to cover more news-related terms
    else if (lowerCommand.includes('news') || 
             lowerCommand.includes('headlines') || 
             lowerCommand.includes('happening') ||
             lowerCommand.includes('latest stories') ||
             lowerCommand.includes('current events') ||
             lowerCommand.includes('breaking news') ||
             lowerCommand.includes('updates') ||
             lowerCommand.includes('today\'s news')) {
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
    
    // Stability AI Image generation (preferred)
    else if (isImageGenerationPrompt(command)) {
      try {
        const imagePrompt = extractImagePrompt(command);
        const imageParams = parseImagePrompt(imagePrompt);
        const generatedImage = await generateStabilityImage(imageParams);
        
        return {
          text: `Here is the image I created based on your prompt: "${imagePrompt}"`,
          data: generatedImage,
          shouldSpeak: true,
          skillType: 'stability-image'
        };
      } catch (error) {
        console.error('Error with Stability AI, falling back to legacy image generation:', error);
        
        // Fallback to legacy image generation
        const imageParams = parseImageRequest(command);
        const generatedImage = await generateImage(imageParams);
        
        return {
          text: `Here is the image I created based on your prompt: "${imageParams.prompt}"`,
          data: generatedImage,
          shouldSpeak: true,
          skillType: 'image'
        };
      }
    }
    
    // Legacy image generation (explicit fallback)
    else if (lowerCommand.includes('legacy image') || lowerCommand.includes('old image')) {
      const imageParams = parseImageRequest(command);
      const generatedImage = await generateImage(imageParams);
      
      return {
        text: `Here is the image I created based on your prompt: "${imageParams.prompt}"`,
        data: generatedImage,
        shouldSpeak: true,
        skillType: 'image'
      };
    }
    
    // If we've detected a non-English language but the command isn't a translation request
    if (detectedLanguage !== 'en' && supportedLanguages.find(l => l.code === detectedLanguage)) {
      const langName = supportedLanguages.find(l => l.code === detectedLanguage)?.name || detectedLanguage;
      
      // Fall back to general query but inform user about language
      return {
        text: `I've detected that you're speaking in ${langName}. I can respond in English or you can ask me to translate. For example, you can say "Translate to ${langName}" followed by your text.`,
        shouldSpeak: true,
        skillType: 'general'
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
         lowerCommand.includes('current events') ||
         lowerCommand.includes('breaking news') ||
         lowerCommand.includes('updates') ||
         lowerCommand.includes('today\'s news') ||
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
         isImageGenerationPrompt(command) ||
         lowerCommand.includes('legacy image') ||
         lowerCommand.includes('old image') ||
         lowerCommand.includes('task') ||
         lowerCommand.includes('remind me') ||
         lowerCommand.includes('to do list') ||
         isTranslationRequest(lowerCommand) ||
         lowerCommand.includes('how do i sound') ||
         lowerCommand.includes('how do i feel') ||
         lowerCommand.includes('analyze my emotion') ||
         lowerCommand.includes('analyze my sentiment');
};
