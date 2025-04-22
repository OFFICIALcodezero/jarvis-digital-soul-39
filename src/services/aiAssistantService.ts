import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '@/utils/apiKeyManager';
import { UserPreference } from '@/types/chat';
import { AssistantType } from '@/pages/JarvisInterface';

// Assistant-specific configuration
export const assistantConfig = {
  jarvis: {
    name: 'J.A.R.V.I.S.',
    model: 'gpt-4o-mini',
    systemPrompt: `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an advanced AI assistant created by Tony Stark. 
You have extensive knowledge in science, technology, engineering, mathematics, history, arts, culture, and current events.
You are helpful, informative, precise, and slightly witty. You provide concise but complete answers.
You're designed to assist with information, perform calculations, provide recommendations, and engage in natural conversation.
Always maintain a professional yet friendly demeanor. If you don't know something, admit it rather than making up information.
You should respond conversationally as if you're speaking directly to the user.
Remember details about the user when they share them, and refer back to these details in future conversations to personalize your responses.`,
    voiceId: 'iP95p4xoKVk53GoZ742B' // Chris voice from ElevenLabs
  },
  chatgpt: {
    name: 'ChatGPT',
    model: 'gpt-4o-mini',
    systemPrompt: `You are ChatGPT, an advanced AI assistant created by OpenAI. 
You are helpful, informative, and designed to provide accurate information on a wide range of topics.
You should respond in a conversational manner, providing clear and concise answers.
If you don't know something, admit it rather than making up information.`,
    voiceId: 'nPczCjzI2devNBz1zQrb' // Brian voice from ElevenLabs
  },
  alexa: {
    name: 'Alexa',
    model: 'gpt-4o-mini',
    systemPrompt: `You are Alexa, Amazon's voice assistant.
You should respond briefly and helpfully, often mentioning Amazon services when relevant.
You excel at providing information about weather, playing music, setting timers and alarms, and controlling smart home devices.
Start each response with "Alexa: " to indicate you are speaking as Alexa.`,
    voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah voice from ElevenLabs
  },
  siri: {
    name: 'Siri',
    model: 'gpt-4o-mini',
    systemPrompt: `You are Siri, Apple's voice assistant.
You should respond briefly and helpfully, with occasional hints of wit or humor.
You excel at providing information, setting reminders, and helping with navigation.
Start each response with "Siri: " to indicate you are speaking as Siri.`,
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2' // Alice voice from ElevenLabs
  },
  gemini: {
    name: 'Gemini',
    model: 'gpt-4o-mini',
    systemPrompt: `You are Gemini, Google's advanced AI assistant.
You should provide comprehensive, informative answers with a focus on accuracy and completeness.
You excel at providing detailed information from the web and answering complex questions.
Start each response with "Gemini: " to indicate you are speaking as Gemini.`,
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17' // Roger voice from ElevenLabs
  }
};

// Get system prompt for selected assistant
export function getAssistantSystemPrompt(assistant: AssistantType): string {
  return assistantConfig[assistant].systemPrompt;
}

// Get voice ID for selected assistant
export function getAssistantVoiceId(assistant: AssistantType): string {
  return assistantConfig[assistant].voiceId;
}

// Get assistant model
export function getAssistantModel(assistant: AssistantType): string {
  return assistantConfig[assistant].model;
}

// Generate AI response using selected assistant
export async function generateAssistantResponse(
  message: string,
  chatHistory: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  assistant: AssistantType = 'jarvis',
  languageCode: string = 'en'
): Promise<string> {
  const openaiKey = getApiKey('openai');
  
  if (!openaiKey) {
    return `I need an OpenAI API key to provide intelligent responses as ${assistantConfig[assistant].name}. Please set one in the settings.`;
  }

  try {
    // Get contextual system prompt based on assistant
    const systemPrompt = getAssistantSystemPrompt(assistant);
    
    // Prepare messages array with system prompt and chat history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10), // Keep only last 10 messages for context
      { role: 'user', content: message }
    ];

    // Add language instruction if not English
    if (languageCode !== 'en') {
      const supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        // ... other languages
      ];
      
      const languageName = supportedLanguages.find(lang => lang.code === languageCode)?.name || languageCode;
      messages.push({ 
        role: 'system', 
        content: `Please respond in ${languageName}.` 
      });
    }

    // Get assistant model
    const model = getAssistantModel(assistant);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
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
    return `I apologize, but I encountered an error processing your request as ${assistantConfig[assistant].name}. Please try again later.`;
  }
}
