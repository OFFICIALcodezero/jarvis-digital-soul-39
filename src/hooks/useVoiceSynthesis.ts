
import { useRef, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '@/utils/apiKeyManager';

export const useVoiceSynthesis = (activeMode: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elevenLabsKey = getApiKey('elevenlabs');
  const [currentVoiceId, setCurrentVoiceId] = useState('CwhRBWXzGAHq8TQ4Fs17'); // Default voice

  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speakText = async (text: string) => {
    if (!elevenLabsKey || (activeMode !== 'voice' && activeMode !== 'face')) {
      return;
    }
    
    try {
      const voiceId = currentVoiceId;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.7,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('ElevenLabs API request failed');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: 'Text-to-Speech Error',
        description: 'Failed to generate speech. Please check your ElevenLabs API key.',
        variant: 'destructive',
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setAudioVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const setVoiceId = (voiceId: string) => {
    setCurrentVoiceId(voiceId);
  };

  return {
    audioRef,
    speakText,
    stopSpeaking,
    setAudioVolume,
    setVoiceId,
  };
};
