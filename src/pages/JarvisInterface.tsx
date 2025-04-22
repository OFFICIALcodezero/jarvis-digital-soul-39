
import React, { useState, useEffect, useCallback } from 'react';
import VoiceActivation from '../components/VoiceActivation';
import SystemData from '../components/SystemData';
import ControlPanel from '../components/ControlPanel';
import CommandResponse from '../components/CommandResponse';
import JarvisCentralCore from '../components/JarvisCentralCore';
import { User, Mic, Terminal, Brain, Info, Volume2 } from 'lucide-react';

// Sound effect for background ambience
const playAmbientSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      
      // Return a function to stop the sound
      return () => {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        setTimeout(() => oscillator.stop(), 1000);
      };
    }
  } catch (error) {
    console.error("Could not play ambient sound:", error);
  }
  return () => {};
};

const JarvisInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jarvisResponse, setJarvisResponse] = useState('System ready. Awaiting voice command.');
  const [isJarvisTyping, setIsJarvisTyping] = useState(false);
  const [activeMode, setActiveMode] = useState('normal');
  const [lastCommand, setLastCommand] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [controlOptions, setControlOptions] = useState([
    { id: 'normal', label: 'Normal Mode', icon: <Brain className="w-6 h-6" />, active: true },
    { id: 'voice', label: 'Voice Mode', icon: <Mic className="w-6 h-6" />, active: false },
    { id: 'face', label: 'Face Mode', icon: <User className="w-6 h-6" />, active: false },
    { id: 'hacker', label: 'Hacker Mode', icon: <Terminal className="w-6 h-6" />, active: false },
  ]);

  // Play ambient background sound
  useEffect(() => {
    if (soundEnabled) {
      const stopSound = playAmbientSound();
      return () => stopSound();
    }
  }, [soundEnabled]);

  const toggleOptionActive = useCallback((id: string) => {
    setControlOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, active: true } 
          : { ...option, active: false }
      )
    );
    
    setActiveMode(id);
    
    // Simulating Jarvis responding to the mode change
    const option = controlOptions.find(opt => opt.id === id);
    if (option) {
      respondToCommand(`${option.label} activated`);
    }
  }, [controlOptions]);

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    
    if (!isListening) {
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  }, [isListening]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const handleCommandReceived = useCallback((command: string) => {
    setLastCommand(command);
    console.log('Command received:', command);
    
    // Start with activating the "processing" animation
    setIsProcessing(true);
    
    // Simple responses to demo commands
    if (command.includes('hello') || command.includes('hi there')) {
      respondToCommand('Hello Commander. How may I assist you today?');
    } else if (command.includes('time')) {
      const time = new Date().toLocaleTimeString();
      respondToCommand(`The current time is ${time}`);
    } else if (command.includes('weather')) {
      respondToCommand('Current weather is 72°F and clear in your location.');
    } else if (command.includes('status') || command.includes('system')) {
      respondToCommand('All systems are operational. CPU usage at 32%. Memory allocation stable.');
    } else if (command.includes('hacker mode')) {
      toggleOptionActive('hacker');
    } else if (command.includes('face mode')) {
      toggleOptionActive('face');
    } else if (command.includes('voice mode')) {
      toggleOptionActive('voice');
    } else if (command.includes('normal mode')) {
      toggleOptionActive('normal');
    } else if (command.includes('thank')) {
      respondToCommand('You\'re welcome, Commander. I\'m here to assist.');
    } else {
      respondToCommand(`Command received: "${command}". Processing your request.`);
    }
    
    setTimeout(() => setIsProcessing(false), 1000);
  }, [toggleOptionActive]);

  const respondToCommand = useCallback((response: string) => {
    setIsJarvisTyping(true);
    
    // Small delay to simulate Jarvis "thinking"
    setTimeout(() => {
      setJarvisResponse(response);
      
      // Simulate the response being spoken
      setIsSpeaking(true);
      speak(response);
      
      setTimeout(() => {
        setIsJarvisTyping(false);
        setTimeout(() => setIsSpeaking(false), 500);
      }, response.length * 30 + 500); // Typing animation duration
    }, 800);
  }, []);

  const speak = useCallback((text: string) => {
    if (!soundEnabled) return;
    
    // Using browser's built-in TTS as a fallback until ElevenLabs is integrated
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 0.9;
      
      // Try to use a deeper voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Male') || voice.name.includes('Daniel')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      
      // Reset speaking state when done
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    }
  }, [soundEnabled]);

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    
    // Start JARVIS greeting after a short delay
    const timer = setTimeout(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        respondToCommand("JARVIS online. Digital intelligence activated. How may I assist you today?");
      }, 2000);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [respondToCommand]);

  return (
    <div className="min-h-screen text-white bg-midnight">
      {/* Circuit grid background */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none"></div>
      
      {/* Animated particles background */}
      <div className="particle-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(30, 174, 219, 0.7)`,
              animationDuration: `${20 + Math.random() * 30}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo and Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="jarvis-panel rounded-full px-4 py-2 inline-flex items-center">
            <span className="text-xl font-bold holographic-text">
              J.A.R.V.I.S
            </span>
            <div className="ml-2 w-2 h-2 rounded-full bg-jarvis animate-pulse"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Sound toggle */}
            <button 
              onClick={toggleSound}
              className={`relative p-2.5 rounded-full ${
                soundEnabled ? 'bg-jarvis/20' : 'bg-gray-800/50'
              } transition-colors duration-300`}
            >
              <Volume2 className={`w-5 h-5 ${soundEnabled ? 'text-jarvis' : 'text-gray-400'}`} />
            </button>
            
            {/* Voice activation */}
            <VoiceActivation 
              onCommandReceived={handleCommandReceived} 
              isListening={isListening}
              toggleListening={toggleListening}
            />
          </div>
        </div>
        
        {/* System Data Panels */}
        <SystemData />
        
        {/* Central Core Area */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
          <JarvisCentralCore 
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            activeMode={activeMode}
          />
        </div>
        
        {/* Command Response Display */}
        <div className="mb-4">
          <CommandResponse message={jarvisResponse} isTyping={isJarvisTyping} />
        </div>
        
        {/* Control Panel */}
        <ControlPanel options={controlOptions} onToggle={toggleOptionActive} />
        
        {/* Last Command Display */}
        <div className="mt-2 text-center">
          <div className="inline-block jarvis-panel rounded-full px-4 py-2 text-xs text-gray-400">
            {lastCommand 
              ? `Last command: "${lastCommand}"` 
              : 'Say "Hey Jarvis" followed by a command'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisInterface;
