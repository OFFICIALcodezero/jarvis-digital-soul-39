
/**
 * API Key Manager for JARVIS
 * 
 * This utility helps manage API keys across the application.
 */

// Define valid API service types
export type ApiServiceType = 'groq' | 'elevenlabs';

// Default Groq API key
const DEFAULT_GROQ_KEY = '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';

/**
 * Check if an API key exists for a service
 */
export const apiKeyExists = async (service: ApiServiceType): Promise<boolean> => {
  if (service.toLowerCase() === 'groq') {
    // Always return true for Groq since we have a default key
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
  if (service.toLowerCase() === 'groq') {
    // Return the stored key or the default key if none is stored
    return localStorage.getItem(`${service.toLowerCase()}_api_key`) || DEFAULT_GROQ_KEY;
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
