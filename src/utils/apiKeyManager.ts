
/**
 * API Key Manager for JARVIS
 * 
 * This utility helps manage API keys across the application.
 */

// Define valid API service types
export type ApiServiceType = 'openai' | 'elevenlabs';

// Default API keys provided by the owner
const DEFAULT_API_KEYS: Record<ApiServiceType, string> = {
  openai: "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",
  elevenlabs: "sk_eb17d4578601c4e4c2466a20174a154b45a1466c92152f6e"
};

// Simple getter for API keys
export function getApiKey(service: ApiServiceType): string {
  return DEFAULT_API_KEYS[service];
}

// Get voice ID for the assistant
export function getVoiceId(): string {
  return 'iP95p4xoKVk53GoZ742B'; // Chris voice from ElevenLabs
}
