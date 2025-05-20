
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
import JarvisCentralCore from '@/components/JarvisCentralCore';
import { GlassCard } from '@/components/ui/dynamic-grid';
import { motion } from 'framer-motion';
import { ShimmeringText } from '@/components/ui/animated-text';

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
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-jarvis-deep to-jarvis-midnight text-white">
        <JarvisBackground hackerModeActive={false} />
        
        <motion.div 
          className="relative z-10 text-center max-w-lg mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 tracking-wider">
            <ShimmeringText text="J.A.R.V.I.S" />
          </h1>
          <p className="text-jarvis-purple mb-8">Just A Rather Very Intelligent System</p>
          
          <div className="max-w-md mx-auto">
            <div className="h-1 w-full bg-black/20 rounded">
              <motion.div 
                className="h-full bg-jarvis-purple rounded" 
                style={{ boxShadow: '0 0 10px rgba(155, 135, 245, 0.7)' }}
                initial={{ width: '0%' }}
                animate={{ width: '60%' }}
                transition={{ duration: 1.5 }}
              ></motion.div>
            </div>
            
            <div className="mt-4 font-mono text-sm text-jarvis-purple">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Initializing system protocols...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Loading neural network framework...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Establishing secure connections...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="animate-pulse"
              >
                Activating user interface...
              </motion.p>
            </div>
          </div>
          
          <div className="mt-8">
            <JarvisVisualizer className="max-w-md mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Prepare extra widgets content for JarvisMainLayout
  const extraWidgetsContent = showActivityLog ? (
    <div className="mt-4">
      <GlassCard>
        <ActivityLogWidget maxItems={12} />
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => setShowActivityLog(false)}
            className="text-xs text-jarvis-purple hover:text-jarvis-purple/80 transition-colors underline"
          >
            Hide Activity Log
          </button>
        </div>
      </GlassCard>
    </div>
  ) : (
    <div className="mt-4 flex justify-end">
      <button 
        onClick={() => setShowActivityLog(true)}
        className="text-xs text-jarvis-purple hover:text-jarvis-purple/80 transition-colors underline"
      >
        Show Activity Log
      </button>
    </div>
  );
  
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

        <JarvisMainLayout extraWidgets={extraWidgetsContent}>
          {/* Pass the remaining properties to children components that need them */}
          <div className="flex-1">
            {mode === 'chat' && (
              <div className="chat-interface-container flex-1">
                {/* Central core visualization */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <JarvisCentralCore 
                    isSpeaking={isSpeaking} 
                    isListening={isListening} 
                    isProcessing={isProcessing} 
                    activeMode={activeMode}
                  />
                  
                  <motion.div 
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      <ShimmeringText text="J.A.R.V.I.S. INTERFACE" />
                    </h2>
                    <p className="text-gray-300">
                      {isListening ? "Listening for commands..." : "Ready for input"}
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
            
            {mode === 'hacker' && (
              <div className="hacker-interface-container flex-1 p-4">
                <GlassCard className="h-full">
                  <pre className="font-mono text-green-400 p-4 h-full overflow-auto">
                    {hackerOutput}
                  </pre>
                </GlassCard>
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
