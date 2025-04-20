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
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const { openAIKeyValid, elevenLabsKeyValid } = validateApiKeys();
    
    if (!openAIKeyValid || !elevenLabsKeyValid) {
      toast({
        title: "API Key Configuration",
        description: "Please configure your OpenAI and ElevenLabs API keys.",
        variant: "destructive"
      });
    }

    const timeline = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast({
        title: "JARVIS Initializing",
        description: "Loading core systems...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setShowGrid(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoading(false);
      toast({
        title: "JARVIS Activated",
        description: "All systems operational. Welcome back.",
      });
    };
    
    timeline();
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
      <div className="min-h-screen flex items-center justify-center bg-[#001A33] overflow-hidden relative">
        {showGrid && (
          <div className="tech-grid opacity-20"></div>
        )}
        
        <div className="text-center z-10 relative">
          <div className="jarvis-logo text-4xl mb-6 tracking-[0.3em]">J.A.R.V.I.S</div>
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-jarvis/50 border-t-jarvis animate-spin"></div>
          <h2 className="text-jarvis text-2xl font-bold animate-pulse-slow text-glow">Initializing JARVIS...</h2>
          <p className="text-jarvis/70 mt-2">Loading core modules</p>
          
          <div className="mt-6 flex justify-center space-x-2">
            <span className="jarvis-loader" style={{ animationDelay: '0s' }}></span>
            <span className="jarvis-loader" style={{ animationDelay: '0.2s' }}></span>
            <span className="jarvis-loader" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
        
        <div className="hex-grid">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="hex" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-[#001A33] bg-circuit-pattern bg-cover bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-circuit-overlay before:z-0">
      <div className="tech-grid opacity-10"></div>
      
      <div className="hex-grid">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="hex" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col z-10 relative">
        <div className="jarvis-logo text-2xl md:text-3xl mb-4 tracking-wider">J.A.R.V.I.S</div>
        
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

      <div className="scan-line animate-scan"></div>
      <div className="scan-line animate-scan" style={{ animationDelay: '0.5s' }}></div>
      <div className="scan-line animate-scan" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default JarvisCore;
