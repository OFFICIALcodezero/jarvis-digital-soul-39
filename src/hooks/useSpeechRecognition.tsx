
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to the SpeechRecognition instance
  const recognitionRef = React.useRef<any>(null);
  
  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Create a new recognition instance
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Configure the recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Set up event handlers
    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };
    
    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setError(`Recognition error: ${event.error}`);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: 'Microphone Access Denied',
          description: 'Please allow microphone access to use voice commands.',
          variant: 'destructive'
        });
      }
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      console.log('Speech recognized:', transcript);
      setTranscript(previous => previous + ' ' + transcript);
    };
    
    // Clean up
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);
  
  // Start listening function
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported.');
      return;
    }
    
    setError(null);
    try {
      recognitionRef.current.start();
      console.log('Started listening');
    } catch (err) {
      // If already started, stop and restart
      if ((err as any)?.message?.includes('already started')) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
          }, 100);
        } catch (stopErr) {
          console.error('Error restarting recognition:', stopErr);
        }
      } else {
        console.error('Error starting recognition:', err);
        setError('Could not start speech recognition.');
      }
    }
  }, []);
  
  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Stopped listening');
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
  }, []);
  
  // Clear transcript function
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
    error
  };
}

export default useSpeechRecognition;
