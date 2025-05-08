
import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useJarvisChat } from '@/components/JarvisChatContext';
import { toast } from '@/components/ui/use-toast';

interface VoiceCommandIntegrationProps {
  isActive: boolean;
}

const VoiceCommandIntegration: React.FC<VoiceCommandIntegrationProps> = ({ 
  isActive
}) => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    clearTranscript,
    isSupported 
  } = useSpeechRecognition();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const { sendMessage, isSpeaking } = useJarvisChat();
  
  // Start/stop listening based on active status
  useEffect(() => {
    if (isActive && !isListening && isSupported) {
      startListening();
      console.log("Voice recognition started");
    } else if (!isActive && isListening) {
      stopListening();
      console.log("Voice recognition stopped");
    }
    
    return () => {
      if (isListening) {
        stopListening();
        console.log("Voice recognition cleanup");
      }
    };
  }, [isActive, isListening, startListening, stopListening, isSupported]);
  
  // Process transcript when it changes
  useEffect(() => {
    if (!transcript || transcript === lastProcessedTranscript || isSpeaking) return;
    
    // Check for wake word "Jarvis"
    const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(transcript);
    
    if (hasWakeWord) {
      console.log("Wake word detected:", transcript);
      
      // Process command
      sendMessage(transcript);
      setLastProcessedTranscript(transcript);
      clearTranscript();
      
      // Notify user
      toast({
        title: "Voice Command Detected",
        description: `Processing: "${transcript}"`,
      });
    }
  }, [transcript, lastProcessedTranscript, sendMessage, clearTranscript, isSpeaking]);
  
  return null; // This is a non-visual component
};

export default VoiceCommandIntegration;
