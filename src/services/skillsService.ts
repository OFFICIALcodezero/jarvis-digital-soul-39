
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
import { validateHackerCode } from './hackerModeService';
import { getCurrentBiometrics, getBiometricHistory, getStressRecommendations } from './biometricsService';
import { 
  analyzeData, 
  getSatelliteData, 
  translateText, 
  generateStrategicPlan, 
  researchAndDevelop, 
  sendSecureMessage 
} from './starkTechService';

export interface SkillResponse {
  text: string;
  data?: any;
  shouldSpeak: boolean;
  skillType: 'weather' | 'news' | 'time' | 'calendar' | 'briefing' | 'image' | 'stability-image' | 'general' | 'unknown' | 'task' | 'emotion' | 'translation' | 'hacker' | 'biometrics' | 'satellite' | 'tony' | 'analysis' | 'planning' | 'research' | 'secure-comms';
}

export const processSkillCommand = async (command: string): Promise<SkillResponse> => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // Detect language first for multilingual support
    const detectedLanguage = await detectLanguage(command);
    
    // Check for hacker mode activation code
    if (validateHackerCode(command)) {
      return {
        text: "Hacker Mode activated. Security protocols engaged. Type 'help' in the terminal for available commands.",
        data: { mode: 'hacker' },
        shouldSpeak: true,
        skillType: 'hacker'
      };
    }
    
    // Biometrics monitoring
    if (lowerCommand.includes('biometrics') || 
        lowerCommand.includes('heart rate') || 
        lowerCommand.includes('stress level') ||
        lowerCommand.includes('how am i feeling') ||
        lowerCommand.includes('monitor my health')) {
      
      const biometricData = await getCurrentBiometrics();
      
      if (!biometricData) {
        return {
          text: "No biometric devices are currently connected. Please connect a device like Fitbit or Apple Watch to monitor your biometrics.",
          shouldSpeak: true,
          skillType: 'biometrics'
        };
      }
      
      let response = `Current biometrics: Heart rate is ${biometricData.heartRate} BPM, stress level is ${biometricData.stressLevel}/100 (${biometricData.status}).`;
      
      if (biometricData.recommendations && biometricData.recommendations.length > 0) {
        response += "\n\nRecommendations:\n- " + biometricData.recommendations.join("\n- ");
      }
      
      return {
        text: response,
        data: biometricData,
        shouldSpeak: true,
        skillType: 'biometrics'
      };
    }

    // Satellite surveillance
    if (lowerCommand.includes('satellite') || 
        lowerCommand.includes('surveillance') || 
        lowerCommand.includes('satellite view') ||
        lowerCommand.includes('observe location')) {
      
      // Extract location from command
      const locationMatches = command.match(/satellite.*(of|for|on|at)\s+([a-zA-Z\s]+)/i) ||
                             command.match(/observe\s+([a-zA-Z\s]+)/i) ||
                             command.match(/surveillance.*(of|for|on|at)\s+([a-zA-Z\s]+)/i);
      
      let location = "current location";
      if (locationMatches && locationMatches[2]) {
        location = locationMatches[2].trim();
      } else if (locationMatches && locationMatches[1]) {
        location = locationMatches[1].trim();
      }
      
      const satelliteData = await getSatelliteData(location);
      
      let response = `Satellite surveillance of ${satelliteData.location.name} (${satelliteData.location.latitude.toFixed(4)}, ${satelliteData.location.longitude.toFixed(4)}):\n\n`;
      
      if (satelliteData.data?.weather) {
        response += `Weather: ${satelliteData.data.weather.temperature}°C, ${satelliteData.data.weather.conditions}\n`;
      }
      
      if (satelliteData.data?.terrain) {
        response += `Terrain: ${satelliteData.data.terrain.type}, elevation: ${satelliteData.data.terrain.elevation}m\n`;
      }
      
      if (satelliteData.data?.activity) {
        if (satelliteData.data.activity.detected) {
          response += `Activity detected: ${satelliteData.data.activity.type} (${satelliteData.data.activity.confidence}% confidence)\n`;
        } else {
          response += `No significant activity detected\n`;
        }
      }
      
      response += `\nImage resolution: ${satelliteData.resolution}`;
      
      return {
        text: response,
        data: satelliteData,
        shouldSpeak: true,
        skillType: 'satellite'
      };
    }
    
    // Data analysis
    if (lowerCommand.includes('analyze data') || 
        lowerCommand.includes('data analysis') || 
        lowerCommand.includes('analyze market') ||
        lowerCommand.includes('analyze trends')) {
      
      // Determine data type
      let dataType: 'market' | 'scientific' | 'security' | 'social' | 'environmental' = 'market';
      
      if (lowerCommand.includes('scientific') || lowerCommand.includes('research')) {
        dataType = 'scientific';
      } else if (lowerCommand.includes('security') || lowerCommand.includes('vulnerabilities')) {
        dataType = 'security';
      } else if (lowerCommand.includes('social') || lowerCommand.includes('media')) {
        dataType = 'social';
      } else if (lowerCommand.includes('environmental') || lowerCommand.includes('climate')) {
        dataType = 'environmental';
      }
      
      const analysisResult = await analyzeData(dataType);
      
      let response = `${analysisResult.predictedOutcome}\n\n`;
      response += `Analysis based on ${analysisResult.dataPoints.toLocaleString()} data points with ${analysisResult.confidenceLevel}% confidence.\n\n`;
      response += `Key insights:\n`;
      analysisResult.insights.forEach((insight, index) => {
        response += `${index + 1}. ${insight}\n`;
      });
      
      return {
        text: response,
        data: analysisResult,
        shouldSpeak: true,
        skillType: 'analysis'
      };
    }
    
    // Strategic planning
    if (lowerCommand.includes('strategic plan') || 
        lowerCommand.includes('create plan') || 
        lowerCommand.includes('strategy for')) {
      
      // Extract goal from command
      const goalMatches = command.match(/plan\s+for\s+(.+)/i) ||
                         command.match(/strategy\s+for\s+(.+)/i) ||
                         command.match(/strategic\s+plan\s+for\s+(.+)/i);
      
      let goal = "improving operational efficiency";
      if (goalMatches && goalMatches[1]) {
        goal = goalMatches[1].trim();
      }
      
      const plan = await generateStrategicPlan(goal);
      
      let response = `${plan.title}\n\n`;
      response += `${plan.description}\n\n`;
      response += `Steps:\n`;
      plan.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += `\nTimeline: ${plan.timeline}\n\n`;
      response += `Resources needed:\n`;
      plan.resources.forEach((resource) => {
        response += `- ${resource}\n`;
      });
      response += `\nPotential risks:\n`;
      plan.risks.forEach((risk) => {
        response += `- ${risk.description}\n  Mitigation: ${risk.mitigation}\n`;
      });
      
      return {
        text: response,
        data: plan,
        shouldSpeak: true,
        skillType: 'planning'
      };
    }
    
    // R&D Engine
    if (lowerCommand.includes('research and develop') || 
        lowerCommand.includes('r&d') || 
        lowerCommand.includes('research on') ||
        lowerCommand.includes('develop concept') ||
        lowerCommand.includes('develop technology for')) {
      
      // Extract concept from command
      const conceptMatches = command.match(/research\s+(?:on|for|about)?\s+(.+)/i) ||
                            command.match(/develop\s+(?:concept|technology)\s+(?:for|on)?\s+(.+)/i) ||
                            command.match(/r&d\s+(?:on|for)?\s+(.+)/i);
      
      let concept = "clean energy technology";
      if (conceptMatches && conceptMatches[1]) {
        concept = conceptMatches[1].trim();
      }
      
      const researchResult = await researchAndDevelop(concept);
      
      let response = `R&D Analysis for: ${concept}\n\n`;
      response += `Feasibility: ${researchResult.feasibility}%\n`;
      response += `Development Timeline: ${researchResult.timeline}\n\n`;
      response += `Requirements:\n`;
      researchResult.requirements.forEach((req) => {
        response += `- ${req}\n`;
      });
      response += `\nPotential Applications:\n`;
      researchResult.potentialApplications.forEach((app) => {
        response += `- ${app}\n`;
      });
      response += `\nRisks:\n`;
      researchResult.risks.forEach((risk) => {
        response += `- ${risk}\n`;
      });
      response += `\nRecommended Next Steps:\n`;
      researchResult.nextSteps.forEach((step) => {
        response += `- ${step}\n`;
      });
      
      return {
        text: response,
        data: researchResult,
        shouldSpeak: true,
        skillType: 'research'
      };
    }
    
    // Secure communication
    if (lowerCommand.includes('send secure message') || 
        lowerCommand.includes('secure message') || 
        lowerCommand.includes('encrypted message') ||
        lowerCommand.includes('message to')) {
      
      // Extract recipient from command
      const recipientMatches = command.match(/message\s+(?:to|for)\s+(.+?)(?:\s+with|:|\.|$)/i);
      
      let recipient = "Tony Stark";
      if (recipientMatches && recipientMatches[1]) {
        recipient = recipientMatches[1].trim();
      }
      
      // Extract message content
      const messageMatches = command.match(/(?:saying|that says|content):?\s+["']?(.+?)["']?$/i) ||
                            command.match(/[":]\s*(.+)$/i);
      
      let messageContent = "This is a secure test message.";
      if (messageMatches && messageMatches[1]) {
        messageContent = messageMatches[1].trim();
      }
      
      // Determine encryption level
      let encryptionLevel: 'standard' | 'enhanced' | 'quantum' = 'standard';
      if (lowerCommand.includes('enhanced') || lowerCommand.includes('high security')) {
        encryptionLevel = 'enhanced';
      } else if (lowerCommand.includes('quantum') || lowerCommand.includes('maximum') || lowerCommand.includes('highest')) {
        encryptionLevel = 'quantum';
      }
      
      const messageResult = await sendSecureMessage(recipient, messageContent, encryptionLevel);
      
      let response = '';
      if (messageResult.status === 'sent') {
        response = `Secure message sent to ${recipient} successfully.\n\n`;
        response += `Message ID: ${messageResult.messageId}\n`;
        response += `Sent: ${new Date(messageResult.timestamp).toLocaleString()}\n`;
        response += `Encryption: ${messageResult.encryptionInfo.level} (${messageResult.encryptionInfo.protocol}, ${messageResult.encryptionInfo.keyLength}-bit)`;
      } else {
        response = `Failed to send secure message to ${recipient}. Please try again.`;
      }
      
      return {
        text: response,
        data: messageResult,
        shouldSpeak: true,
        skillType: 'secure-comms'
      };
    }
    
    // Tony's real-time translation (enhanced)
    if (isTranslationRequest(lowerCommand)) {
      const textToTranslate = command.replace(/translate(?:\s+this)?\s+to\s+\w+|in\s+\w+(?:\s+language)?/i, '').trim();
      
      // Extract target language
      const languageMatches = command.match(/to\s+(\w+)|in\s+(\w+)(?:\s+language)?/i);
      let targetLanguage = 'spanish'; // Default
      
      if (languageMatches) {
        targetLanguage = (languageMatches[1] || languageMatches[2]).toLowerCase();
      }
      
      // Use the enhanced translation from Stark Tech
      const translation = await translateText(textToTranslate, targetLanguage);
      
      let response = `Translation (${translation.detectedLanguage} → ${targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}):\n\n`;
      response += translation.translatedText;
      response += `\n\nConfidence: ${translation.confidence}%`;
      
      return {
        text: response,
        data: { originalText: textToTranslate, translatedText: translation.translatedText },
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
  
  // Check hacker mode activation code first
  if (validateHackerCode(command)) {
    return true;
  }
  
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
         lowerCommand.includes('analyze my sentiment') ||
         lowerCommand.includes('biometrics') ||
         lowerCommand.includes('heart rate') ||
         lowerCommand.includes('stress level') ||
         lowerCommand.includes('satellite') ||
         lowerCommand.includes('surveillance') ||
         lowerCommand.includes('analyze data') ||
         lowerCommand.includes('data analysis') ||
         lowerCommand.includes('strategic plan') ||
         lowerCommand.includes('research and develop') ||
         lowerCommand.includes('r&d') ||
         lowerCommand.includes('send secure message') ||
         lowerCommand.includes('secure message');
};
