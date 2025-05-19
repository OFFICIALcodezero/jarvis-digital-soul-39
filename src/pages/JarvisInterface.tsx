
import React, { useState, useEffect } from 'react';
import JarvisHeader from '@/components/interface/JarvisHeader';
import JarvisMainLayout from '@/components/interface/JarvisMainLayout';
import JarvisControlBar from '@/components/interface/JarvisControlBar';
import JarvisBackground from '@/components/interface/JarvisBackground';
import { useControlOptions } from '@/components/interface/JarvisControlOptions';
import { useJarvisSystem } from '@/hooks/useJarvisSystem';
import { useIsMobile } from '@/hooks/use-mobile';
import JarvisCore from '@/components/JarvisCore';
import JarvisVoiceCommands from '@/components/JarvisVoiceCommands';
import VoiceCommandIntegration from '@/features/VoiceCommandIntegration';
import HologramScreen from '@/components/hologram/HologramScreen';
import JarvisVisualizer from '@/components/JarvisVisualizer';
import ActivityLogWidget from '@/components/widgets/ActivityLogWidget';
import { toast } from 'sonner';
import { WeatherContextProvider } from '@/features/WeatherContext';

export type AssistantType = 'jarvis';

const JarvisInterface = () => {
  const {
    mode,
    activeMode,
    isSpeaking,
    setIsSpeaking,
    isListening,
    isProcessing,
    activeAssistant,
    inputMode,
    setInputMode,
    hackerOutput,
    setHackerOutput,
    isMuted,
    hackerModeActive,
    handleToggleMode,
    toggleMute,
    handleMessageCheck,
    activateHackerMode,
    deactivateHackerMode,
    toggleListening,
    handleAssistantChange,
  } = useJarvisSystem();
  
  const isMobile = useIsMobile();
  
  const [isHologramOpen, setIsHologramOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'online' | 'standby'>('initializing');
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  // Get control options based on current state
  const controlOptions = useControlOptions({ 
    activeMode, 
    hackerModeActive 
  });

  // Simulate boot sequence
  useEffect(() => {
    setSystemStatus('initializing');
    
    const timer = setTimeout(() => {
      setSystemStatus('online');
      toast("J.A.R.V.I.S. Online", {
        description: "All systems operational",
        position: "bottom-right"
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const openHologram = () => {
    setIsHologramOpen(true);
  };
  
  // Function to handle chat commands
  const handleChatCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for activity log commands
    if (lowerMessage.includes('show activity log') || 
        lowerMessage.includes('open activity log')) {
      setShowActivityLog(true);
      return true;
    }
    
    // Check for hologram commands
    if (lowerMessage.includes('open hologram') || 
        lowerMessage.includes('show hologram') || 
        lowerMessage.includes('activate hologram') ||
        lowerMessage.includes('hologram interface')) {
      openHologram();
      return true;
    }
    
    // Pass to default message handler
    return handleMessageCheck(message);
  };
  
  if (systemStatus === 'initializing') {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-jarvis-bg text-white">
        <JarvisBackground hackerModeActive={false} />
        
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-6 holographic-text tracking-wide">J.A.R.V.I.S</h1>
          <p className="text-jarvis mb-8">Just A Rather Very Intelligent System</p>
          
          <div className="max-w-md mx-auto">
            <div className="h-1 w-full bg-black/20 rounded">
              <div className="h-full bg-jarvis rounded" style={{ 
                width: '60%',
                boxShadow: '0 0 10px rgba(51, 195, 240, 0.7)'
              }}></div>
            </div>
            
            <div className="mt-4 font-mono text-sm text-jarvis">
              <p>Initializing system protocols...</p>
              <p>Loading neural network framework...</p>
              <p>Establishing secure connections...</p>
              <p className="animate-pulse">Activating user interface...</p>
            </div>
          </div>
          
          <JarvisVisualizer className="mt-8 max-w-md mx-auto" />
        </div>
      </div>
    );
  }
  
  return (
    <WeatherContextProvider>
      <div className={`relative min-h-screen flex flex-col ${hackerModeActive ? 'hacker-mode' : 'bg-jarvis-bg'} text-white overflow-hidden`}>
        <JarvisBackground hackerModeActive={hackerModeActive} />
        
        {/* Core components responsible for system functionality */}
        <JarvisCore />
        <JarvisVoiceCommands 
          isListening={isListening} 
          hackerModeActive={hackerModeActive}
          onActivateHacker={activateHackerMode}
          onOpenHologram={openHologram}
        />
        <VoiceCommandIntegration isActive={isListening} />
        
        <JarvisHeader 
          hackerModeActive={hackerModeActive} 
          activeAssistant={activeAssistant} 
          toggleMute={toggleMute} 
          isMuted={isMuted} 
        />

        <JarvisMainLayout 
          // Only pass the properties defined in CustomLayoutWrapperProps
          extraWidgets={
            showActivityLog ? (
              <div className="mt-4">
                <ActivityLogWidget maxItems={12} />
                <div className="flex justify-end mt-2">
                  <button 
                    className="text-xs text-jarvis underline"
                    onClick={() => setShowActivityLog(false)}
                  >
                    Hide Activity Log
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex justify-end">
                <button 
                  className="text-xs text-jarvis underline"
                  onClick={() => setShowActivityLog(true)}
                >
                  Show Activity Log
                </button>
              </div>
            )
          }
        >
          {/* Pass the remaining properties to children components that need them */}
          <div className="flex-1">
            {mode === 'chat' && (
              <div className="chat-interface-container flex-1">
                {/* Chat interface components would go here */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-jarvis">J.A.R.V.I.S. INTERFACE</h2>
                    <p className="text-gray-300">
                      {isListening ? "Listening for commands..." : "Ready for input"}
                    </p>
                    <JarvisVisualizer className="mt-8 max-w-md mx-auto" />
                  </div>
                </div>
              </div>
            )}
            
            {mode === 'hacker' && (
              <div className="hacker-interface-container flex-1 p-4">
                <pre className="font-mono text-green-400 bg-black/70 p-4 rounded h-full overflow-auto">
                  {hackerOutput}
                </pre>
              </div>
            )}
          </div>
        </JarvisMainLayout>
        
        <JarvisControlBar 
          controlOptions={controlOptions} 
          onToggle={handleToggleMode} 
        />
        
        {/* Hologram screen */}
        <HologramScreen 
          isOpen={isHologramOpen} 
          onClose={() => setIsHologramOpen(false)} 
        />
      </div>
    </WeatherContextProvider>
  );
};

export default JarvisInterface;
