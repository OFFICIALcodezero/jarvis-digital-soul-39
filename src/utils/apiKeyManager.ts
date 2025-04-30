
/**
 * API Key Manager for JARVIS
 * 
 * This utility helps manage API keys across the application.
 */

// Define valid API service types
export type ApiServiceType = 'openai' | 'elevenlabs';

// Default OpenAI API key
const DEFAULT_OPENAI_KEY = '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';

/**
 * Check if an API key exists for a service
 */
export const apiKeyExists = async (service: ApiServiceType): Promise<boolean> => {
  if (service.toLowerCase() === 'openai') {
    // Always return true for OpenAI since we have a default key
    return true;
  }
  const key = localStorage.getItem(`${service.toLowerCase()}_api_key`);
  return !!key;
};

/**
 * Set an API key for a service
 */
export const setApiKey = async (service: ApiServiceType, value: string): Promise<void> => {
  localStorage.setItem(`${service.toLowerCase()}_api_key`, value);
};

/**
 * Get an API key for a service
 */
export const getApiKey = async (service: ApiServiceType): Promise<string | null> => {
  if (service.toLowerCase() === 'openai') {
    // Return the stored key or the default key if none is stored
    return localStorage.getItem(`${service.toLowerCase()}_api_key`) || DEFAULT_OPENAI_KEY;
  }
  return localStorage.getItem(`${service.toLowerCase()}_api_key`);
};

/**
 * Remove an API key for a service
 */
export const removeApiKey = async (service: ApiServiceType): Promise<void> => {
  localStorage.removeItem(`${service.toLowerCase()}_api_key`);
};

/**
 * Get voice ID for the assistant
 */
export function getVoiceId(): string {
  return 'iP95p4xoKVk53GoZ742B'; // Chris voice from ElevenLabs
}
