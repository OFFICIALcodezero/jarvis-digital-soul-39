import React, { useState, useEffect } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import JarvisAvatar from './JarvisAvatar';
import JarvisChat from './JarvisChat';
import JarvisControls from './JarvisControls';
import JarvisStatusBar from './JarvisStatusBar';
import { Headphones, Brain, Mic, Terminal } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

export type JarvisMode = 'normal' | 'voice' | 'face' | 'hacker';

const JarvisCore = () => {
  const { apiKeys, updateApiKeys, validateApiKeys } = useApiKeys();
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<JarvisMode>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const { openAIKeyValid, elevenLabsKeyValid } = validateApiKeys();
    
    if (!openAIKeyValid || !elevenLabsKeyValid) {
      toast({
        title: "API Key Configuration",
        description: "Please configure your OpenAI and ElevenLabs API keys.",
        variant: "destructive"
      });
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "JARVIS Initialized",
        description: "All systems operational. Welcome back.",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [apiKeys]);

  const modeIcons = {
    normal: Brain,
    voice: Mic,
    face: Headphones,
    hacker: Terminal
  };

  const modeNames = {
    normal: "Normal Mode",
    voice: "Voice Mode",
    face: "Face Mode",
    hacker: "Hacker Mode"
  };

  const handleSetMode = (mode: JarvisMode) => {
    setActiveMode(mode);
    toast({
      title: `Switching to ${modeNames[mode]}`,
      description: `JARVIS is now operating in ${modeNames[mode]}.`,
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jarvis-dark">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-jarvis/50 border-t-jarvis animate-spin"></div>
          <h2 className="text-jarvis text-2xl font-bold animate-pulse-slow">Initializing JARVIS...</h2>
          <p className="text-jarvis/70 mt-2">Loading core systems</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-[#001A33] bg-circuit-pattern bg-cover bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-circuit-overlay before:z-0">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col z-10 relative">
        
        <JarvisStatusBar 
          activeMode={activeMode} 
          isSpeaking={isSpeaking} 
          isListening={isListening} 
          modeIcons={modeIcons} 
          modeNames={modeNames}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 mt-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <JarvisAvatar activeMode={activeMode} isSpeaking={isSpeaking} />
            <JarvisControls 
              activeMode={activeMode} 
              setActiveMode={handleSetMode} 
              isListening={isListening} 
              setIsListening={setIsListening}
              apiKeys={apiKeys}
              updateApiKeys={updateApiKeys}
            />
          </div>
          
          <div className="lg:col-span-2 flex flex-col">
            <JarvisChat 
              activeMode={activeMode} 
              setIsSpeaking={setIsSpeaking} 
              isListening={isListening}
              apiKey={apiKeys.openAIKey}
              elevenLabsKey={apiKeys.elevenLabsKey}
            />
          </div>
        </div>
      </div>

      {/* Decorative scan lines */}
      <div className="scan-line animate-scan"></div>
      <div className="scan-line animate-scan" style={{ animationDelay: '0.5s' }}></div>
      <div className="scan-line animate-scan" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default JarvisCore;
