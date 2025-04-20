
/**
 * API Key Manager for JARVIS
 * 
 * This utility helps manage API keys across the application.
 * It provides default keys while allowing for custom keys.
 */

// Default API keys provided by the owner
const DEFAULT_API_KEYS = {
  // Add your default API keys here
  openai: "sk-default-openai-key-provided-by-owner",
  elevenlabs: "default-elevenlabs-key-provided-by-owner",
  // Add other API services as needed
};

// Local storage keys
const STORAGE_PREFIX = 'jarvis_api_';

// Get API key with fallback to default
export function getApiKey(service: keyof typeof DEFAULT_API_KEYS): string {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  const userKey = localStorage.getItem(storageKey);
  
  // Return user key if available, otherwise default key
  return userKey || DEFAULT_API_KEYS[service];
}

// Set custom API key
export function setApiKey(service: keyof typeof DEFAULT_API_KEYS, key: string): void {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  localStorage.setItem(storageKey, key);
}

// Check if using default or custom key
export function isUsingDefaultKey(service: keyof typeof DEFAULT_API_KEYS): boolean {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  return !localStorage.getItem(storageKey);
}

// Reset to default key
export function resetToDefaultKey(service: keyof typeof DEFAULT_API_KEYS): void {
  const storageKey = `${STORAGE_PREFIX}${service}`;
  localStorage.removeItem(storageKey);
}

// Get all API service names
export function getAvailableServices(): string[] {
  return Object.keys(DEFAULT_API_KEYS);
}
