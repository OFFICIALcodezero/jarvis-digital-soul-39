
import { getApiKey } from '../utils/apiKeyManager';

// Interface for the completion request
export interface CompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

// Interface for the completion response
export interface CompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// OpenAI completion function
export const createCompletion = async (
  request: CompletionRequest
): Promise<CompletionResponse> => {
  try {
    const apiKey = await getApiKey('OpenAI');
    
    if (!apiKey) {
      console.error('OpenAI API key not set. Please set it in settings.');
      return {
        text: "I'm unable to respond because my API key hasn't been set. Please go to Settings and set your OpenAI API key.",
      };
    }

    // This is a mock implementation - in a real application, you would call the OpenAI API
    console.log('Using API key to call OpenAI API:', apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3));
    
    // Simulating a successful response
    return {
      text: `This is a simulated response. In a real implementation, this would be a response from the OpenAI API using your API key (starting with ${apiKey.substring(0, 3)}...)`,
      usage: {
        promptTokens: request.prompt.length / 4,
        completionTokens: 50,
        totalTokens: request.prompt.length / 4 + 50,
      },
    };
  } catch (error) {
    console.error('Error creating completion:', error);
    return {
      text: "I encountered an error while processing your request. Please check your API key and try again.",
    };
  }
};
