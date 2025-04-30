
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
  const openAIKey = getApiKey('openai');
  
  useEffect(() => {
    if (!elevenLabsKey && (activeMode === 'voice' || activeMode === 'face')) {
      toast({
        title: "ElevenLabs API Key Required",
        description: "Voice features require an ElevenLabs API key. Please add it in the controls panel.",
        variant: "destructive"
      });
    }
    
    if (!openAIKey) {
      toast({
        title: "OpenAI API Key Required",
        description: "JARVIS requires an OpenAI API key to function properly. Please add it in the controls panel.",
        variant: "destructive"
      });
    }
  }, [elevenLabsKey, openAIKey, activeMode]);
  
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
    
    toast({
      title: "Hacker Mode Activated",
      description: "All systems operational. Security protocols engaged.",
      variant: "default"
    });
  };
  
  const deactivateHackerMode = () => {
    setHackerModeActive(false);
    setMode('chat');
  };

  // Function to handle assistant changes with proper typing
  const handleAssistantChange = (assistant: string) => {
    setActiveAssistant(assistant as AssistantType);
  };
  
  return (
    <div className="relative min-h-screen flex flex-col bg-jarvis-bg text-white overflow-hidden">
      <ArcReactor />
      
      <div className="w-full jarvis-panel flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="text-xl font-bold text-jarvis text-glow mr-2">JARVIS</div>
          <div className="text-xs uppercase bg-jarvis/20 text-jarvis px-2 py-0.5 rounded">
            v1.0
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/images" className="flex items-center text-jarvis hover:text-jarvis/80 transition-colors">
            <Image className="h-4 w-4 mr-1" />
            <span className="text-sm">Image Studio</span>
          </Link>
          <div className="flex items-center text-sm">
            <div className="h-2 w-2 rounded-full mr-2 bg-jarvis"></div>
            <span className="text-jarvis">System Online</span>
          </div>
          {activeAssistant !== 'jarvis' && (
            <div className="flex items-center text-sm">
              <Bot className="h-3 w-3 mr-1 text-jarvis" />
              <span className="text-jarvis capitalize">{activeAssistant} enabled</span>
            </div>
          )}
          {hackerModeActive && (
            <div className="flex items-center text-sm">
              <Terminal className="h-3 w-3 mr-1 text-jarvis" />
              <span className="text-jarvis animate-pulse">HACKER MODE</span>
            </div>
          )}
          <button 
            onClick={toggleMute}
            className="text-jarvis hover:text-jarvis/80 transition-colors"
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
          <div className="glass-morphism p-4 rounded-2xl h-full flex flex-col">
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
              />
            </div>
          </div>
        </div>
        
        <div className="lg:w-2/3 order-1 lg:order-2">
          {hackerModeActive ? (
            <div className="h-full rounded-xl overflow-hidden border border-jarvis/30">
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
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1eaedb]/10 to-transparent z-0"></div>
    </div>
  );
};

export default JarvisInterface;
