
// Language service for multilingual support
import { toast } from '@/components/ui/use-toast';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

// Supported languages
export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

// Get language by code
export const getLanguageByCode = (code: string): LanguageOption | undefined => {
  return supportedLanguages.find(lang => lang.code === code);
};

// Detect language from text (simplified implementation)
export const detectLanguage = async (text: string): Promise<string> => {
  // This would typically use a language detection API or library
  // For now, we'll use a very simple approach
  
  try {
    // Basic pattern matching for some common languages
    const lowerText = text.toLowerCase().trim();
    
    if (/^[\u0600-\u06FF\s]+$/.test(lowerText)) return 'ar'; // Arabic
    if (/^[\u0400-\u04FF\s]+$/.test(lowerText)) return 'ru'; // Russian
    if (/^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\s]+$/.test(lowerText)) { 
      // Chinese/Japanese characters
      return /[\u3040-\u309F\u30A0-\u30FF]/.test(lowerText) ? 'ja' : 'zh';
    }
    
    // Simple keyword detection
    const spanishWords = ['hola', 'como', 'estas', 'gracias', 'por', 'favor', 'qué', 'dónde', 'cuándo'];
    const frenchWords = ['bonjour', 'salut', 'merci', 'oui', 'non', 'comment', 'où', 'quand', 'pourquoi'];
    const germanWords = ['hallo', 'guten', 'danke', 'bitte', 'ja', 'nein', 'wie', 'wo', 'wann'];
    const italianWords = ['ciao', 'buongiorno', 'grazie', 'prego', 'sì', 'no', 'come', 'dove', 'quando'];
    const portugueseWords = ['olá', 'como', 'obrigado', 'sim', 'não', 'onde', 'quando', 'por', 'que'];
    
    const words = lowerText.split(/\W+/);
    
    let counts = {
      es: 0, fr: 0, de: 0, it: 0, pt: 0, en: 0
    };
    
    words.forEach(word => {
      if (spanishWords.includes(word)) counts.es++;
      if (frenchWords.includes(word)) counts.fr++;
      if (germanWords.includes(word)) counts.de++;
      if (italianWords.includes(word)) counts.it++;
      if (portugueseWords.includes(word)) counts.pt++;
      // English is default
    });
    
    // Find the language with the highest count
    const detected = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)[0];
    
    // Default to English if no clear matches
    return detected ? detected[0] : 'en';
    
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English on error
  }
};

// Translate text (for a production app, use a translation API)
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    toast({
      title: "Translation Requested",
      description: `Translating to ${getLanguageByCode(targetLanguage)?.name || targetLanguage}...`,
    });
    
    // In a real implementation, we would call a translation API here
    // For now, we'll just pretend to translate
    return `[Translated to ${getLanguageByCode(targetLanguage)?.name || targetLanguage}]: ${text}`;
  } catch (error) {
    console.error('Translation error:', error);
    toast({
      title: "Translation Error",
      description: "Failed to translate the text. Please try again.",
      variant: "destructive"
    });
    return text;
  }
};

// Format language options for UI select component
export const getLanguageSelectOptions = () => {
  return supportedLanguages.map(lang => ({
    value: lang.code,
    label: `${lang.flag || ''} ${lang.name} (${lang.nativeName})`,
  }));
};

// Check if a command is a translation request
export const isTranslationRequest = (command: string): boolean => {
  const lowerCommand = command.toLowerCase();
  
  return lowerCommand.includes('translate to') || 
         lowerCommand.includes('translate this to') ||
         lowerCommand.includes('in spanish') ||
         lowerCommand.includes('in french') ||
         lowerCommand.includes('in german') ||
         lowerCommand.includes('in italian') ||
         lowerCommand.includes('in portuguese') ||
         lowerCommand.includes('in japanese') ||
         lowerCommand.includes('in chinese') ||
         lowerCommand.includes('in russian') ||
         lowerCommand.includes('in arabic');
};

// Extract target language from a translation request
export const extractTargetLanguage = (command: string): string | null => {
  const lowerCommand = command.toLowerCase();
  
  // Check for "translate to [language]" pattern
  const translateMatch = lowerCommand.match(/translate(?:\s+this)?\s+to\s+(\w+)/i);
  if (translateMatch) {
    const langName = translateMatch[1].toLowerCase();
    const lang = supportedLanguages.find(l => 
      l.name.toLowerCase() === langName || 
      l.nativeName.toLowerCase() === langName
    );
    return lang ? lang.code : null;
  }
  
  // Check for "in [language]" pattern
  const inMatch = lowerCommand.match(/in\s+(\w+)(?:\s+language)?/i);
  if (inMatch) {
    const langName = inMatch[1].toLowerCase();
    const lang = supportedLanguages.find(l => 
      l.name.toLowerCase() === langName || 
      l.nativeName.toLowerCase() === langName
    );
    return lang ? lang.code : null;
  }
  
  return null;
};

// Process a translation request
export const processTranslationRequest = async (command: string, text: string): Promise<string> => {
  const targetLang = extractTargetLanguage(command);
  
  if (!targetLang) {
    return "I'm not sure which language you want me to translate to. Please specify a language.";
  }
  
  return await translateText(text, targetLang);
};
