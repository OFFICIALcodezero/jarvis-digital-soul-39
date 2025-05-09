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
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);
  
  // Keep track of attempts to retry recognition
  const attemptsRef = useRef(0);
  const maxAttempts = 3;
  
  // Use refs to maintain instance across renders
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  // Timeout for inactivity detection
  const silenceTimeoutRef = useRef<number | null>(null);
  // Timer for maximum listening duration
  const maxListeningTimeoutRef = useRef<number | null>(null);
  
  // Flag to prevent multiple simultaneous instances
  const isProcessingRef = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        
        // Only create the recognition instance once
        if (!recognitionRef.current) {
          // Create and configure recognition instance
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          
          // Increase speech detection sensitivity for ambient noise
          if ('speechSettings' in recognitionRef.current) {
            try {
              (recognitionRef.current as any).speechSettings = {
                sensitivity: 'high',
                continuous: true,
                interimResults: true
              };
            } catch (e) {
              console.log('Advanced speech settings not supported');
            }
          }
          
          // Set up recognition event handlers
          recognitionRef.current.onresult = (event) => {
            // Reset silence detection timer whenever we get results
            resetSilenceDetection();
            
            let currentTranscript = '';
            let isFinal = false;
            
            // Build the complete transcript from all results
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript + ' ';
              if (event.results[i].isFinal) {
                isFinal = true;
              }
            }
            
            currentTranscript = currentTranscript.trim();
            console.log("Speech recognized:", currentTranscript, "isFinal:", isFinal);
            setTranscript(currentTranscript);
            
            // Reset attempt counter when we get successful results
            attemptsRef.current = 0;
          };
          
          recognitionRef.current.onend = () => {
            console.log("Speech recognition ended");
            
            // Clear the processing flag
            isProcessingRef.current = false;
            
            // Only auto-restart if we're supposed to be listening and haven't exceeded max attempts
            if (isListening && attemptsRef.current < maxAttempts) {
              try {
                attemptsRef.current++;
                console.log(`Auto-restarting speech recognition (attempt ${attemptsRef.current})`);
                
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                
                // Add a small delay before restarting
                timeoutRef.current = window.setTimeout(() => {
                  if (recognitionRef.current && isListening) {
                    try {
                      // Mark as processing during restart
                      isProcessingRef.current = true;
                      recognitionRef.current.start();
                      
                      // Reset silence detection
                      resetSilenceDetection();
                    } catch (e) {
                      console.error("Could not restart recognition:", e);
                      setIsListening(false);
                      isProcessingRef.current = false;
                    }
                  }
                }, 1000);
              } catch (e) {
                console.error("Could not restart recognition:", e);
                setIsListening(false);
              }
            } else if (attemptsRef.current >= maxAttempts) {
              // If we've tried too many times, stop listening
              console.log("Maximum restart attempts reached");
              setIsListening(false);
              toast({
                title: "Voice Recognition Paused",
                description: "Having trouble hearing you. Please try again.",
                variant: "default"
              });
            } else {
              setIsListening(false);
            }
          };
          
          recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            
            // Don't show UI errors for aborted recognition
            if (event.error !== 'aborted') {
              setError(event.error);
            }
            
            if (event.error === 'not-allowed') {
              setHasMicrophonePermission(false);
              toast({
                title: "Microphone Access Denied",
                description: "Please allow microphone access to use voice features.",
                variant: "destructive"
              });
              setIsListening(false);
            } else if (event.error === 'no-speech') {
              // Handle silence gracefully - don't show error to user
              console.log("No speech detected");
            } else if (event.error !== 'aborted') {
              toast({
                title: "Speech Recognition Error",
                description: `Error: ${event.error}. Please try again.`,
                variant: "default"
              });
            }
            
            // Clear processing flag on error
            isProcessingRef.current = false;
          };
        }
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
    
    // Check for microphone permission on startup
    checkMicrophonePermission();

    return () => {
      // Clean up
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      if (maxListeningTimeoutRef.current) {
        clearTimeout(maxListeningTimeoutRef.current);
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
  }, [isListening]);

  // Check for microphone permissions
  const checkMicrophonePermission = useCallback(async () => {
    try {
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasMicrophonePermission(permissionStatus.state === 'granted');
        
        permissionStatus.onchange = () => {
          setHasMicrophonePermission(permissionStatus.state === 'granted');
        };
      } else {
        // Fallback for browsers that don't support permissions API
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setHasMicrophonePermission(true);
          })
          .catch(() => {
            setHasMicrophonePermission(false);
          });
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
    }
  }, []);

  // Reset silence detection timer
  const resetSilenceDetection = () => {
    // Clear any existing timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Set a new timeout for silence detection - 10 seconds of no speech
    silenceTimeoutRef.current = window.setTimeout(() => {
      if (isListening) {
        console.log("Silence detected after 10 seconds");
        // Don't immediately stop, just pause and notify
        toast({
          title: "Still listening",
          description: "Waiting for voice input...",
          variant: "default"
        });
      }
    }, 10000);
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    // Prevent starting multiple instances
    if (isProcessingRef.current) {
      console.log("Already processing speech recognition request");
      return;
    }
    
    // Check for microphone permission first
    if (hasMicrophonePermission === false) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access in your browser settings.",
        variant: "destructive"
      });
      return;
    }
    
    setError(null);
    
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Reset attempts
      attemptsRef.current = 0;
      
      // Clear transcript when starting fresh
      setTranscript('');
      
      // Mark as processing during start
      isProcessingRef.current = true;
      
      recognitionRef.current.start();
      setIsListening(true);
      console.log("Speech recognition started");
      
      // Set up silence detection
      resetSilenceDetection();
      
      // Set maximum listening time (2 minutes)
      if (maxListeningTimeoutRef.current) {
        clearTimeout(maxListeningTimeoutRef.current);
      }
      
      maxListeningTimeoutRef.current = window.setTimeout(() => {
        if (isListening) {
          console.log("Maximum listening time reached (2 minutes)");
          stopListening();
          toast({
            title: "Voice Recognition Paused",
            description: "Listening timeout reached. Please restart if needed.",
            variant: "default"
          });
        }
      }, 120000); // 2 minutes
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      setError('Could not start speech recognition');
      setIsListening(false);
      isProcessingRef.current = false;
      
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  }, [hasMicrophonePermission]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      if (maxListeningTimeoutRef.current) {
        clearTimeout(maxListeningTimeoutRef.current);
        maxListeningTimeoutRef.current = null;
      }
      
      recognitionRef.current.abort();
      setIsListening(false);
      isProcessingRef.current = false;
      console.log("Speech recognition stopped");
    } catch (error) {
      console.error('Error stopping recognition:', error);
      setIsListening(false);
      isProcessingRef.current = false;
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
