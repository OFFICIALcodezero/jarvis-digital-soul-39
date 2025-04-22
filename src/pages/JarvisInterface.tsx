
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

const JarvisInterface = () => {
  const [mode, setMode] = useState<'chat' | 'hacker'>('chat');
  const { isMobile } = useIsMobile();
  
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 z-10">
        {/* Central Core */}
        <div className="lg:w-1/3 order-2 lg:order-1">
          <div className="glass-morphism p-4 rounded-2xl h-full flex flex-col">
            <JarvisCentralCore />
            <div className="mt-4">
              <div className="relative flex justify-center">
                <button className="relative flex items-center justify-center w-12 h-12 rounded-full jarvis-panel border border-jarvis transition-all duration-300 group">
                  <div className="absolute inset-0 rounded-full bg-jarvis/30 animate-pulse"></div>
                </button>
              </div>
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
              <ChatMode />
            </TabsContent>
            <TabsContent value="hacker" className="h-[calc(100%-40px)]">
              <HackerMode />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="p-4 z-10">
        <ControlPanel />
      </div>
      
      {/* Lower background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1eaedb]/10 to-transparent z-0"></div>
    </div>
  );
};

export default JarvisInterface;
