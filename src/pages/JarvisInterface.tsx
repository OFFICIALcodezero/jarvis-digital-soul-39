
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArcReactor from '@/components/background/ArcReactor';
import ChatInterface from '@/components/ChatInterface';
import JarvisCore from '@/components/JarvisCore';
import JarvisFaceAI from '@/components/JarvisFaceAI';
import JarvisChat from '@/components/JarvisChat';
import JarvisStatusBar from '@/components/JarvisStatusBar';
import JarvisControls from '@/components/JarvisControls';
import ControlPanel from '@/components/ControlPanel';
import JarvisCentralCore from '@/components/JarvisCentralCore';
import VoiceActivation from '@/components/VoiceActivation';
import ChatMode from '@/components/chat/ChatMode';
import HackerMode from '@/components/chat/HackerMode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mic, Brain, Sparkles, Cpu, Bot, Volume2, VolumeX, Image, Terminal } from 'lucide-react';
import { getApiKey } from '@/utils/apiKeyManager';
import { toast } from '@/components/ui/use-toast';
import { validateHackerCode } from '@/services/hackerModeService';

export type AssistantType = 'jarvis';

const JarvisInterface = () => {
  const [mode, setMode] = useState<'chat' | 'hacker'>('chat');
  const [activeMode, setActiveMode] = useState<'normal' | 'voice' | 'face'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<AssistantType>('jarvis');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [hackerOutput, setHackerOutput] = useState<string>('');
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hackerModeActive, setHackerModeActive] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  const elevenLabsKey = getApiKey('elevenlabs');
  const groqKey = getApiKey('groq');
  
  useEffect(() => {
    if (!elevenLabsKey && (activeMode === 'voice' || activeMode === 'face')) {
      toast({
        title: "ElevenLabs API Key Required",
        description: "Voice features require an ElevenLabs API key. Please add it in the controls panel.",
        variant: "destructive"
      });
    }
    
    if (!groqKey) {
      toast({
        title: "Groq API Key Required",
        description: "JARVIS requires a Groq API key to function properly. Please add it in the controls panel.",
        variant: "destructive"
      });
    }
  }, [elevenLabsKey, groqKey, activeMode]);
  
  // Helper function to play a sound
  const playSound = (type: 'activation' | 'deactivation' | 'processing' | 'alert') => {
    try {
      const audio = new Audio();
      
      switch (type) {
        case 'activation':
          audio.src = 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3';
          break;
        case 'deactivation':
          audio.src = 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3';
          break;
        case 'processing':
          audio.src = 'https://assets.mixkit.co/active_storage/sfx/590/590-preview.mp3';
          break;
        case 'alert':
          audio.src = 'https://assets.mixkit.co/active_storage/sfx/1084/1084-preview.mp3';
          break;
      }
      
      if (!isMuted) {
        audio.volume = volume;
        audio.play().catch(err => console.log('Audio play error:', err));
      }
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  };
  
  const controlOptions = [
    {
      id: 'normal',
      label: 'Normal Mode',
      icon: <Brain />,
      active: activeMode === 'normal' && !hackerModeActive
    },
    {
      id: 'voice',
      label: 'Voice Mode',
      icon: <Mic />,
      active: activeMode === 'voice' && !hackerModeActive
    },
    {
      id: 'face',
      label: 'Face Mode',
      icon: <Sparkles />,
      active: activeMode === 'face' && !hackerModeActive
    },
    {
      id: 'images',
      label: 'Image Generator',
      icon: <Image />,
      active: false
    }
  ];

  // Add hacker mode to control options only if it's active
  if (hackerModeActive) {
    controlOptions.push({
      id: 'hacker',
      label: 'Hacker Mode',
      icon: <Terminal />,
      active: hackerModeActive
    });
  }

  const handleToggleMode = (id: string) => {
    if (id === 'hacker') {
      setMode('hacker');
      return;
    }
    
    if (id === 'images') {
      // Navigate to image generation page
      window.location.href = '/images';
      return;
    }
    
    setActiveMode(id as 'normal' | 'voice' | 'face');
    setMode('chat');
    setHackerModeActive(false);
    
    if (id === 'voice' || id === 'face') {
      setInputMode('voice');
      
      if (!elevenLabsKey) {
        toast({
          title: "ElevenLabs API Key Required",
          description: "Voice features require an ElevenLabs API key. Please add it in the controls panel.",
          variant: "destructive"
        });
      }
    } else {
      setInputMode('text');
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(prev => isMuted ? prev : 0);
  };
  
  // Handle message input to check for code activation
  const handleMessageCheck = (message: string) => {
    if (validateHackerCode(message)) {
      activateHackerMode();
      return true;
    }
    return false;
  };
  
  const activateHackerMode = () => {
    setHackerModeActive(true);
    setMode('hacker');
    setHackerOutput('J.A.R.V.I.S. Hacker Interface v2.0 Activated\n> Security protocols bypassed\n> Entering secure terminal...\n> Authentication successful\n> Type "help" for available commands');
    
    // Play activation sound
    playSound('activation');
    
    toast({
      title: "Hacker Mode Activated",
      description: "All systems operational. Security protocols engaged.",
      variant: "default"
    });
  };
  
  const deactivateHackerMode = () => {
    setHackerModeActive(false);
    setMode('chat');
    
    // Play deactivation sound
    playSound('deactivation');
    
    toast({
      title: "Hacker Mode Deactivated",
      description: "Returning to standard interface.",
      variant: "default"
    });
  };

  // Function to handle assistant changes with proper typing
  const handleAssistantChange = (assistant: string) => {
    setActiveAssistant(assistant as AssistantType);
  };
  
  return (
    <div className={`relative min-h-screen flex flex-col ${hackerModeActive ? 'hacker-mode' : 'bg-jarvis-bg'} text-white overflow-hidden`}>
      {/* Apply hacker background effects if in hacker mode */}
      {hackerModeActive && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 hacker-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10"></div>
        </div>
      )}
      
      <ArcReactor />
      
      <div className={`w-full jarvis-panel flex items-center justify-between p-3 ${hackerModeActive ? 'border-red-500/20' : 'border-jarvis/20'}`}>
        <div className="flex items-center">
          <div className={`text-xl font-bold ${hackerModeActive ? 'hacker-text' : 'text-jarvis text-glow'} mr-2`}>JARVIS</div>
          <div className={`text-xs uppercase ${hackerModeActive ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'} px-2 py-0.5 rounded`}>
            {hackerModeActive ? 'v2.0 SECURE' : 'v2.0'}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/images" className={`flex items-center ${hackerModeActive ? 'text-red-400 hover:text-red-300' : 'text-jarvis hover:text-jarvis/80'} transition-colors`}>
            <Image className="h-4 w-4 mr-1" />
            <span className="text-sm">Image Studio</span>
          </Link>
          <div className="flex items-center text-sm">
            <div className={`h-2 w-2 rounded-full mr-2 ${hackerModeActive ? 'bg-red-500 animate-pulse' : 'bg-jarvis'}`}></div>
            <span className={hackerModeActive ? 'text-red-400' : 'text-jarvis'}>System Online</span>
          </div>
          {activeAssistant !== 'jarvis' && (
            <div className="flex items-center text-sm">
              <Bot className={`h-3 w-3 mr-1 ${hackerModeActive ? 'text-red-400' : 'text-jarvis'}`} />
              <span className={`${hackerModeActive ? 'text-red-400' : 'text-jarvis'} capitalize`}>{activeAssistant} enabled</span>
            </div>
          )}
          {hackerModeActive && (
            <div className="flex items-center text-sm">
              <Terminal className="h-3 w-3 mr-1 text-red-400" />
              <span className="text-red-400 animate-pulse">HACKER MODE</span>
            </div>
          )}
          <button 
            onClick={toggleMute}
            className={hackerModeActive ? 'text-red-400 hover:text-red-300 transition-colors' : 'text-jarvis hover:text-jarvis/80 transition-colors'}
          >
            {isMuted ? 
              <VolumeX className="h-4 w-4" /> : 
              <Volume2 className="h-4 w-4" />
            }
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 z-10">
        <div className="lg:w-1/3 order-2 lg:order-1">
          <div className={`${hackerModeActive ? 'bg-black/40 border-red-500/20' : 'glass-morphism'} p-4 rounded-2xl h-full flex flex-col`}>
            <JarvisCentralCore 
              isSpeaking={isSpeaking}
              isListening={isListening}
              isProcessing={isProcessing}
              activeMode={hackerModeActive ? 'hacker' : activeMode}
            />
            <div className="mt-4">
              <VoiceActivation 
                isListening={isListening}
                toggleListening={() => setIsListening(!isListening)}
                isSpeaking={isSpeaking}
                hackerMode={hackerModeActive}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:w-2/3 order-1 lg:order-2">
          {hackerModeActive && mode === 'hacker' ? (
            <div className="h-full rounded-xl overflow-hidden border border-red-500/30">
              <HackerMode 
                hackerOutput={hackerOutput}
                setHackerOutput={setHackerOutput}
                onDeactivate={deactivateHackerMode}
              />
            </div>
          ) : (
            <JarvisChat 
              activeMode={activeMode}
              setIsSpeaking={setIsSpeaking}
              isListening={isListening}
              activeAssistant={activeAssistant}
              setActiveAssistant={handleAssistantChange}
              inputMode={inputMode}
              setInputMode={setInputMode}
              onMessageCheck={handleMessageCheck}
              hackerModeActive={hackerModeActive} 
              hackerOutput={hackerOutput}
              setHackerOutput={setHackerOutput}
              onDeactivateHacker={deactivateHackerMode}
            />
          )}
        </div>
      </div>
      
      <div className="p-4 z-10">
        <ControlPanel 
          options={controlOptions}
          onToggle={handleToggleMode}
        />
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${hackerModeActive ? 'from-red-900/10' : 'from-[#1eaedb]/10'} to-transparent z-0`}></div>
    </div>
  );
};

export default JarvisInterface;
