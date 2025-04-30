import { useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

export interface ApiKeys {
  openAIKey: string;
  elevenLabsKey: string;
}

export interface ApiKeyValidation {
  openAIKeyValid: boolean;
  elevenLabsKeyValid: boolean;
  errors: {
    openAIKey?: string;
    elevenLabsKey?: string;
  };
}

const DEFAULT_OPENAI_KEY = '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';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openAIKey: localStorage.getItem('openAIKey') || DEFAULT_OPENAI_KEY,
    elevenLabsKey: localStorage.getItem('elevenLabsKey') || ''
  });

  // Validate API keys whenever they change
  useEffect(() => {
    const validation = validateApiKeys();
    if (validation.errors.openAIKey || validation.errors.elevenLabsKey) {
      // Only show validation errors if keys are not empty (to avoid initial load errors)
      if (apiKeys.openAIKey && !validation.openAIKeyValid) {
        toast({
          title: "OpenAI API Key Error",
          description: validation.errors.openAIKey,
          variant: "destructive",
        });
      }
      if (apiKeys.elevenLabsKey && !validation.elevenLabsKeyValid) {
        toast({
          title: "ElevenLabs API Key Error",
          description: validation.errors.elevenLabsKey,
          variant: "destructive",
        });
      }
    }
  }, [apiKeys]);

  // Persist API keys to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('openAIKey', apiKeys.openAIKey);
      localStorage.setItem('elevenLabsKey', apiKeys.elevenLabsKey);
    } catch (error) {
      console.error('Failed to save API keys to localStorage:', error);
      toast({
        title: "Storage Error",
        description: "Failed to save API keys. Please check your browser settings.",
        variant: "destructive",
      });
    }
  }, [apiKeys]);

  const updateApiKeys = (keys: Partial<ApiKeys>) => {
    try {
      setApiKeys(prev => {
        const newKeys = { ...prev, ...keys };
        return newKeys;
      });
    } catch (error) {
      console.error('Failed to update API keys:', error);
      toast({
        title: "Update Error",
        description: "Failed to update API keys. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateApiKeys = (): ApiKeyValidation => {
    const validation: ApiKeyValidation = {
      openAIKeyValid: false,
      elevenLabsKeyValid: false,
      errors: {}
    };

    // OpenAI API key validation
    const openAIKeyRegex = /^sk-[a-zA-Z0-9]{48}$/;
    if (!apiKeys.openAIKey) {
      validation.errors.openAIKey = "OpenAI API key is required";
    } else if (!openAIKeyRegex.test(apiKeys.openAIKey)) {
      validation.errors.openAIKey = "Invalid OpenAI API key format. Should start with 'sk-' followed by 48 characters";
    } else {
      validation.openAIKeyValid = true;
    }

    // ElevenLabs API key validation
    const elevenLabsKeyRegex = /^[a-zA-Z0-9]{32}$/;
    if (!apiKeys.elevenLabsKey) {
      validation.errors.elevenLabsKey = "ElevenLabs API key is required";
    } else if (!elevenLabsKeyRegex.test(apiKeys.elevenLabsKey)) {
      validation.errors.elevenLabsKey = "Invalid ElevenLabs API key format. Should be 32 characters long";
    } else {
      validation.elevenLabsKeyValid = true;
    }

    return validation;
  };

  const clearApiKeys = () => {
    try {
      localStorage.removeItem('openAIKey');
      localStorage.removeItem('elevenLabsKey');
      setApiKeys({
        openAIKey: '',
        elevenLabsKey: ''
      });
      toast({
        title: "API Keys Cleared",
        description: "All API keys have been removed from storage.",
      });
    } catch (error) {
      console.error('Failed to clear API keys:', error);
      toast({
        title: "Error",
        description: "Failed to clear API keys. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    apiKeys,
    updateApiKeys,
    validateApiKeys,
    clearApiKeys
  };
};
