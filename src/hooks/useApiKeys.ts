
import { useState, useEffect } from 'react';

interface ApiKeys {
  openAIKey: string;
  elevenLabsKey: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openAIKey: localStorage.getItem('openAIKey') || '',
    elevenLabsKey: localStorage.getItem('elevenLabsKey') || ''
  });

  useEffect(() => {
    localStorage.setItem('openAIKey', apiKeys.openAIKey);
    localStorage.setItem('elevenLabsKey', apiKeys.elevenLabsKey);
  }, [apiKeys]);

  const updateApiKeys = (keys: Partial<ApiKeys>) => {
    setApiKeys(prev => ({ ...prev, ...keys }));
  };

  const validateApiKeys = () => {
    const openAIKeyRegex = /^sk-[a-zA-Z0-9]{48}$/;
    const elevenLabsKeyRegex = /^[a-zA-Z0-9]{32}$/;

    return {
      openAIKeyValid: openAIKeyRegex.test(apiKeys.openAIKey),
      elevenLabsKeyValid: elevenLabsKeyRegex.test(apiKeys.elevenLabsKey)
    };
  };

  return {
    apiKeys,
    updateApiKeys,
    validateApiKeys
  };
};
