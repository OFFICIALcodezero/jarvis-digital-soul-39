
import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '@/utils/apiKeyManager';

// Supported languages and their codes
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
];

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Default system prompt to give Jarvis personality and knowledge
const DEFAULT_SYSTEM_PROMPT = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an advanced AI assistant created by Tony Stark. 
You have extensive knowledge in science, technology, engineering, mathematics, history, arts, culture, and current events.
You are helpful, informative, precise, and slightly witty. You provide concise but complete answers.
You're designed to assist with information, perform calculations, provide recommendations, and engage in natural conversation.
Always maintain a professional yet friendly demeanor. If you don't know something, admit it rather than making up information.`;

export async function generateAIResponse(
  message: string, 
  chatHistory: ChatMessage[],
  languageCode: string = 'en'
): Promise<string> {
  const openaiKey = getApiKey('openai');
  
  if (!openaiKey) {
    return "I need an OpenAI API key to provide intelligent responses. Please set one in the settings.";
  }

  try {
    // Prepare messages array with system prompt and chat history
    const messages = [
      { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
      ...chatHistory.slice(-10), // Keep only last 10 messages for context
      { role: 'user', content: message }
    ];

    // Add language instruction if not English
    if (languageCode !== 'en') {
      const languageName = supportedLanguages.find(lang => lang.code === languageCode)?.name || languageCode;
      messages.push({ 
        role: 'system', 
        content: `Please respond in ${languageName}.` 
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a capable but efficient model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Unknown error occurred');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    toast({
      title: 'AI Response Error',
      description: error instanceof Error ? error.message : 'Failed to generate a response',
      variant: 'destructive'
    });
    return "I apologize, but I encountered an error processing your request. Please try again later.";
  }
}
