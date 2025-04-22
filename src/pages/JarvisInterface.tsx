
import React, { useState } from 'react';
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
import { Mic, Brain, Sparkles, Cpu, Bot } from 'lucide-react';

export type AssistantType = 'jarvis';

const JarvisInterface = () => {
  const [mode, setMode] = useState<'chat' | 'hacker'>('chat');
  const [activeMode, setActiveMode] = useState<'normal' | 'voice' | 'face' | 'hacker'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<AssistantType>('jarvis');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [hackerOutput, setHackerOutput] = useState<string>('');
  const isMobile = useIsMobile();
  
  // Control panel options
  const controlOptions = [
    {
      id: 'normal',
      label: 'Normal Mode',
      icon: <Brain />,
      active: activeMode === 'normal'
    },
    {
      id: 'voice',
      label: 'Voice Mode',
      icon: <Mic />,
      active: activeMode === 'voice'
    },
    {
      id: 'face',
      label: 'Face Mode',
      icon: <Sparkles />,
      active: activeMode === 'face'
    },
    {
      id: 'hacker',
      label: 'Hacker Mode',
      icon: <Cpu />,
      active: activeMode === 'hacker'
    }
  ];

  const handleToggleMode = (id: string) => {
    setActiveMode(id as 'normal' | 'voice' | 'face' | 'hacker');
    if (id === 'hacker') {
      setMode('hacker');
    } else {
      setMode('chat');
    }
    
    // Auto-set input mode based on selected interface mode
    if (id === 'voice' || id === 'face') {
      setInputMode('voice');
    } else {
      setInputMode('text');
    }
  };
  
  return (
    <div className="relative min-h-screen flex flex-col bg-jarvis-bg text-white overflow-hidden">
      {/* Upper background gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#1eaedb]/10 to-transparent z-0"></div>
      
      {/* Status Bar */}
      <div className="w-full jarvis-panel flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="text-xl font-bold text-jarvis text-glow mr-2">JARVIS</div>
          <div className="text-xs uppercase bg-jarvis/20 text-jarvis px-2 py-0.5 rounded">
            v1.0
          </div>
        </div>
        
        <div className="flex space-x-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 z-10">
        {/* Central Core */}
        <div className="lg:w-1/3 order-2 lg:order-1">
          <div className="glass-morphism p-4 rounded-2xl h-full flex flex-col">
            <JarvisCentralCore 
              isSpeaking={isSpeaking}
              isListening={isListening}
              isProcessing={isProcessing}
              activeMode={activeMode}
            />
            <div className="mt-4">
              <VoiceActivation 
                isListening={isListening}
                toggleListening={() => setIsListening(!isListening)}
              />
            </div>
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="lg:w-2/3 order-1 lg:order-2">
          <Tabs defaultValue="chat" className="h-full" onValueChange={(value) => setMode(value as 'chat' | 'hacker')}>
            <TabsList className="bg-black/50 border border-[#33c3f0]/20">
              <TabsTrigger value="chat" className="data-[state=active]:bg-[#33c3f0]/20">Assistant Mode</TabsTrigger>
              <TabsTrigger value="hacker" className="data-[state=active]:bg-[#33c3f0]/20">Hacker Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="h-[calc(100%-40px)]">
              <JarvisChat 
                activeMode={activeMode}
                setIsSpeaking={setIsSpeaking}
                isListening={isListening}
                activeAssistant={activeAssistant}
                setActiveAssistant={setActiveAssistant}
                inputMode={inputMode}
                setInputMode={setInputMode}
              />
            </TabsContent>
            <TabsContent value="hacker" className="h-[calc(100%-40px)]">
              <HackerMode 
                hackerOutput={hackerOutput}
                setHackerOutput={setHackerOutput}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="p-4 z-10">
        <ControlPanel 
          options={controlOptions}
          onToggle={handleToggleMode}
        />
      </div>
      
      {/* Lower background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1eaedb]/10 to-transparent z-0"></div>
    </div>
  );
};

export default JarvisInterface;
