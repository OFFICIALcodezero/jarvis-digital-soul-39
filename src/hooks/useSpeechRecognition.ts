
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        // Set up recognition event handlers
        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          console.log("Speech recognized:", transcript);
          setTranscript(transcript);
        };
        
        recognitionInstance.onend = () => {
          console.log("Speech recognition ended");
          setIsListening(false);
          
          // Auto-restart if we're supposed to be listening
          if (isListening) {
            try {
              console.log("Auto-restarting speech recognition");
              recognitionInstance.start();
            } catch (e) {
              console.error("Could not restart recognition:", e);
            }
          }
        };
        
        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError(event.error);
          setIsListening(false);
          
          if (event.error !== 'aborted') {
            toast({
              title: "Speech Recognition Error",
              description: `Error: ${event.error}. Please try again.`,
              variant: "destructive"
            });
          }
        };
        
        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        setError('Speech recognition is not supported in this browser');
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
          variant: "destructive"
        });
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {
          console.error('Error aborting recognition:', e);
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setError(null);
    
    try {
      recognition.start();
      setIsListening(true);
      console.log("Speech recognition started");
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError('Could not start speech recognition');
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
      console.log("Speech recognition stopped");
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [recognition]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported
  };
};
