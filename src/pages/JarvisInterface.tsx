
import React, { useState, useEffect, useCallback } from 'react';
import VoiceActivation from '../components/VoiceActivation';
import SystemData from '../components/SystemData';
import ControlPanel from '../components/ControlPanel';
import CommandResponse from '../components/CommandResponse';
import { User, Users, Cpu } from 'lucide-react';

const JarvisInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [jarvisResponse, setJarvisResponse] = useState('System ready. Awaiting voice command.');
  const [isJarvisTyping, setIsJarvisTyping] = useState(false);
  const [isHackerMode, setIsHackerMode] = useState(true);
  const [lastCommand, setLastCommand] = useState('');
  
  const [controlOptions, setControlOptions] = useState([
    { id: 'face', label: 'Face Mode', icon: <User className="w-6 h-6" />, active: true },
    { id: 'voice', label: 'Voice Mode', icon: <Users className="w-6 h-6" />, active: true },
    { id: 'hacker', label: 'Hacker Tools', icon: <Cpu className="w-6 h-6" />, active: false },
  ]);

  const toggleOptionActive = useCallback((id: string) => {
    setControlOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, active: !option.active } 
          : option
      )
    );
    
    // Special handling for hacker mode
    if (id === 'hacker') {
      const hackerOption = controlOptions.find(opt => opt.id === 'hacker');
      if (hackerOption) {
        setIsHackerMode(!hackerOption.active);
      }
    }
    
    // Simulating Jarvis responding to the toggle
    const option = controlOptions.find(opt => opt.id === id);
    if (option) {
      const newState = !option.active ? 'activated' : 'deactivated';
      respondToCommand(`${option.label} ${newState}`);
    }
  }, [controlOptions]);

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  const handleCommandReceived = useCallback((command: string) => {
    setLastCommand(command);
    console.log('Command received:', command);
    
    // Start with activating the "listening" animation
    setIsListening(true);
    
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
    } else if (command.includes('thank')) {
      respondToCommand('You\'re welcome, Commander. I\'m here to assist.');
    } else {
      respondToCommand(`Command received: "${command}". Processing your request.`);
    }
  }, [toggleOptionActive]);

  const respondToCommand = useCallback((response: string) => {
    setIsJarvisTyping(true);
    
    // Small delay to simulate Jarvis "thinking"
    setTimeout(() => {
      setJarvisResponse(response);
      
      // Simulate the response being spoken
      speak(response);
      
      setTimeout(() => {
        setIsJarvisTyping(false);
      }, response.length * 30 + 500); // Typing animation duration
    }, 800);
  }, []);

  const speak = useCallback((text: string) => {
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
    }
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    
    // Start listening automatically after a short delay
    const timer = setTimeout(() => {
      setIsListening(true);
      speak("Jarvis online. Voice recognition activated.");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className={`min-h-screen text-white ${
      isHackerMode 
        ? 'bg-[#090C10] bg-grid-pattern' 
        : 'bg-gradient-to-br from-slate-900 to-slate-800'
      }`}>
      
      {/* Circuit background for Hacker Mode */}
      {isHackerMode && (
        <div className="absolute inset-0 bg-circuit-pattern opacity-10 pointer-events-none"></div>
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-slate-800/50 rounded-full px-4 py-2 border border-cyan-500/30 inline-flex items-center backdrop-blur-sm">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              J.A.R.V.I.S
            </span>
            <div className="ml-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          </div>
          
          <VoiceActivation 
            onCommandReceived={handleCommandReceived} 
            isListening={isListening}
            toggleListening={toggleListening}
          />
        </div>
        
        <SystemData />
        
        <div className="mt-6">
          <CommandResponse message={jarvisResponse} isTyping={isJarvisTyping} />
        </div>
        
        <ControlPanel options={controlOptions} onToggle={toggleOptionActive} />
        
        <div className="mt-4 text-center">
          <div className="inline-block bg-slate-800/50 rounded-full px-4 py-2 text-xs text-slate-400 border border-slate-700/50 backdrop-blur-sm">
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
