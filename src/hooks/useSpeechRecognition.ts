
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  // Use refs to maintain instance across renders
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        
        // Create and configure recognition instance
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        // Set up recognition event handlers
        recognitionRef.current.onresult = (event) => {
          let currentTranscript = '';
          
          // Build the complete transcript from all results
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          
          currentTranscript = currentTranscript.trim();
          console.log("Speech recognized:", currentTranscript);
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onend = () => {
          console.log("Speech recognition ended");
          
          // Only auto-restart if we're supposed to be listening
          if (isListening) {
            try {
              console.log("Auto-restarting speech recognition");
              timeoutRef.current = window.setTimeout(() => {
                recognitionRef.current?.start();
              }, 500);
            } catch (e) {
              console.error("Could not restart recognition:", e);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError(event.error);
          
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice features.",
              variant: "destructive"
            });
            setIsListening(false);
          } else if (event.error !== 'aborted') {
            toast({
              title: "Speech Recognition Error",
              description: `Error: ${event.error}. Please try again.`,
              variant: "destructive"
            });
          }
        };
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
      // Clean up
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error aborting recognition:', e);
        }
      }
      
      console.log("Voice recognition cleanup");
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setError(null);
    
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Clear transcript when starting fresh
      setTranscript('');
      
      recognitionRef.current.start();
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
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      recognitionRef.current.stop();
      setIsListening(false);
      console.log("Speech recognition stopped");
    } catch (error) {
      console.error('Error stopping recognition:', error);
      setIsListening(false);
    }
  }, []);

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
