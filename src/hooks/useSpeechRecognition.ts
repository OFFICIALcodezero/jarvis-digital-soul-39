
/**
 * Custom hook for speech recognition
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  language?: string;
  interimResults?: boolean;
}

interface SpeechRecognitionHook {
  listening: boolean;  // Changed from isListening to listening for consistency
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  resetTranscript: () => void; // Added resetTranscript property
  error: string | null;
  isSupported: boolean;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Check if speech recognition is supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Create a ref for the recognition instance
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure options
    recognitionRef.current.continuous = options.continuous ?? true;
    recognitionRef.current.interimResults = options.interimResults ?? true;
    recognitionRef.current.lang = options.language ?? 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };
    
    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      
      console.log('Speech recognized:', currentTranscript);
      setTranscript(currentTranscript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
    };
    
    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options.continuous, options.interimResults, options.language, isSupported]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err instanceof Error && err.message.includes('already started')) {
        // If already started, stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      } else {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  }, [isSupported]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);
  
  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Reset transcript - added this function to match the interface
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    listening: isListening, // Changed to match the interface
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    resetTranscript, // Added to match the interface
    error,
    isSupported
  };
};

export default useSpeechRecognition;
