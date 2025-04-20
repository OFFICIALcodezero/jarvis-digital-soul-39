/**
 * API Key Manager for JARVIS
 * 
 * This utility helps manage API keys across the application.
 * It provides default keys while allowing for custom keys.
 */

// Define valid API service types
export type ApiServiceType = 'openai' | 'elevenlabs';

// Default API keys provided by the owner
const DEFAULT_API_KEYS: Record<ApiServiceType, string> = {
  // Add your default API keys here
  openai: "sk-default-openai-key-provided-by-owner",
  elevenlabs: "default-elevenlabs-key-provided-by-owner", // Ensure this is a valid ElevenLabs API key
};

// Local storage keys
const STORAGE_PREFIX = 'jarvis_api_';

// Get API key with fallback to default
export function getApiKey(service: ApiServiceType): string {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  const userKey = localStorage.getItem(storageKey);
  
  // Return user key if available, otherwise default key
  return userKey || DEFAULT_API_KEYS[service];
}

// Set custom API key
export function setApiKey(service: ApiServiceType, key: string): void {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  localStorage.setItem(storageKey, key);
}

// Check if using default or custom key
export function isUsingDefaultKey(service: ApiServiceType): boolean {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  return !localStorage.getItem(storageKey);
}

// Reset to default key
export function resetToDefaultKey(service: ApiServiceType): void {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  localStorage.removeItem(storageKey);
}

// Get all API service names
export function getAvailableServices(): ApiServiceType[] {
  return Object.keys(DEFAULT_API_KEYS) as ApiServiceType[];
}
