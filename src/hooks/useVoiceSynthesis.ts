
import { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '@/utils/apiKeyManager';
import { getAssistantVoiceId } from '@/services/aiAssistantService';
import { AssistantType } from '@/pages/JarvisInterface';

export const useVoiceSynthesis = (activeMode: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elevenLabsKey = getApiKey('elevenlabs');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoiceId, setCurrentVoiceId] = useState('CwhRBWXzGAHq8TQ4Fs17'); // Default Roger voice
  
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speakText = useCallback(async (text: string, assistantType: AssistantType = 'jarvis') => {
    if (!elevenLabsKey) {
      toast({
        title: "API Key Required",
        description: "ElevenLabs API key is required for voice synthesis. Please set it in the settings.",
        variant: "destructive"
      });
      return;
    }
    
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
    }
    
    try {
      // Get the appropriate voice ID for the selected assistant
      const voiceId = getAssistantVoiceId(assistantType);
      
      // Update for SSML compatibility by wrapping in <speak> tags if not already present
      const formattedText = text.startsWith('<speak>') ? text : `<speak>${text}</speak>`;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey,
        },
        body: JSON.stringify({
          text: formattedText,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.75,
            style: 0.15,
            use_speaker_boost: true
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('ElevenLabs API error:', errorData);
        throw new Error(errorData.detail?.message || 'Error generating speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setIsPlaying(true);
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: 'Text-to-Speech Error',
        description: 'Failed to generate speech. Please check your ElevenLabs API key.',
        variant: 'destructive',
      });
      setIsPlaying(false);
    }
  }, [elevenLabsKey]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const setAudioVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const setVoiceId = useCallback((voiceId: string) => {
    setCurrentVoiceId(voiceId);
  }, []);

  return {
    audioRef,
    speakText,
    stopSpeaking,
    setAudioVolume,
    setVoiceId,
    isPlaying
  };
};
