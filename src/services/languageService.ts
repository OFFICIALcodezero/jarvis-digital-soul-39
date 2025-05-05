
import { toast } from '@/components/ui/use-toast';

export interface Language {
  code: string;
  name: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ko', name: 'Korean' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'el', name: 'Greek' }
];

// Common translation request patterns
const translationPatterns = [
  /translate\s+(this|that)?\s*to\s+(\w+)/i,
  /translate\s+(this|that)?\s*into\s+(\w+)/i,
  /say\s+(this|that)?\s*in\s+(\w+)/i,
  /how\s+do\s+you\s+say\s+(.*)\s+in\s+(\w+)/i,
  /in\s+(\w+)\s+language/i
];

// Check if a message is a translation request
export const isTranslationRequest = (message: string): boolean => {
  return translationPatterns.some(pattern => pattern.test(message));
};

// Extract the target language from a translation request
export const extractTargetLanguage = (message: string): string | null => {
  for (const pattern of translationPatterns) {
    const match = message.match(pattern);
    if (match && match[2]) {
      // Try to map the language name to a language code
      const languageName = match[2].toLowerCase();
      const language = supportedLanguages.find(
        lang => lang.name.toLowerCase() === languageName || lang.code.toLowerCase() === languageName
      );
      
      return language ? language.code : null;
    }
  }
  
  return null;
};

// Process a translation request
export const processTranslationRequest = async (
  message: string, 
  textToTranslate: string
): Promise<string> => {
  try {
    const targetLanguage = extractTargetLanguage(message);
    
    if (!targetLanguage) {
      return "I couldn't determine which language to translate to. Please specify the target language clearly.";
    }
    
    // Get the text to translate
    let text = textToTranslate || message.replace(/translate\s+(this|that)?\s*(to|into|in)\s+\w+/i, '').trim();
    
    // If the text is empty, ask for clarification
    if (!text) {
      return "What would you like me to translate?";
    }
    
    // Use translation API to translate the text
    const translatedText = await translateText(text, targetLanguage);
    
    // Get language name for the response
    const language = supportedLanguages.find(lang => lang.code === targetLanguage);
    const languageName = language ? language.name : targetLanguage;
    
    return `"${text}" in ${languageName} is: "${translatedText}"`;
  } catch (error) {
    console.error("Translation error:", error);
    return "I encountered an error while translating. Please try again.";
  }
};

// Function to translate text using an API
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // For this implementation we'll just simulate a translation
  // In a real application, you would use a translation API like Google Translate
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple translation simulation
  if (targetLanguage === 'es') {
    return text
      .replace(/hello/gi, 'hola')
      .replace(/goodbye/gi, 'adiós')
      .replace(/thank you/gi, 'gracias')
      .replace(/please/gi, 'por favor')
      .replace(/how are you/gi, '¿cómo estás?')
      .replace(/good morning/gi, 'buenos días')
      .replace(/good afternoon/gi, 'buenas tardes')
      .replace(/good evening/gi, 'buenas noches')
      .replace(/what is your name/gi, '¿cómo te llamas?');
  } else if (targetLanguage === 'fr') {
    return text
      .replace(/hello/gi, 'bonjour')
      .replace(/goodbye/gi, 'au revoir')
      .replace(/thank you/gi, 'merci')
      .replace(/please/gi, 's\'il vous plaît')
      .replace(/how are you/gi, 'comment allez-vous?')
      .replace(/good morning/gi, 'bonjour')
      .replace(/good afternoon/gi, 'bon après-midi')
      .replace(/good evening/gi, 'bonsoir')
      .replace(/what is your name/gi, 'comment vous appelez-vous?');
  }
  
  // For other languages just return the original text with a placeholder
  return `[${text} translated to ${targetLanguage}]`;
};

// Detect the language of a text
export const detectLanguage = async (text: string): Promise<string> => {
  // In a real application, you would use a language detection API
  // This is a simplified simulation
  
  // Default to English
  let detectedLanguage = 'en';
  
  const lowerText = text.toLowerCase();
  
  // Very basic language detection based on common words
  if (/hola|buenos días|cómo estás|gracias|por favor|qué|cómo/.test(lowerText)) {
    detectedLanguage = 'es';
  } else if (/bonjour|merci|comment|s'il vous plaît|oui|non|je suis/.test(lowerText)) {
    detectedLanguage = 'fr';
  } else if (/guten tag|danke|bitte|wie geht es dir|ja|nein|ich bin/.test(lowerText)) {
    detectedLanguage = 'de';
  } else if (/ciao|buongiorno|grazie|per favore|come stai|sì|no|io sono/.test(lowerText)) {
    detectedLanguage = 'it';
  }
  
  return detectedLanguage;
};
