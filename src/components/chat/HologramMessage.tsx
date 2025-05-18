
import React, { useEffect, useState } from 'react';
import HologramEffect from '@/components/ui/hologram-effect';
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from '@/types/chat';
import { Mic } from 'lucide-react';

interface HologramMessageProps {
  message: Message;
  isUser: boolean;
  isTyping?: boolean;
  isSpeaking?: boolean;
  currentTypingText?: string;
  showTimestamp?: boolean;
  hackerMode?: boolean;
}

const HologramMessage: React.FC<HologramMessageProps> = ({
  message,
  isUser,
  isTyping = false,
  isSpeaking = false,
  currentTypingText = '',
  showTimestamp = true,
  hackerMode = false
}) => {
  const [speechWaves, setSpeechWaves] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    // Generate wave animation for speaking
    if (isSpeaking && !isUser) {
      intervalId = setInterval(() => {
        setSpeechWaves(prev => prev.map(() => Math.random() * 15));
      }, 150);
    }
    
    return () => clearInterval(intervalId);
  }, [isSpeaking, isUser]);

  const displayText = isTyping ? currentTypingText : message.content;
  const messageColor = hackerMode ? '#ff3333' : '#33C3F0';
  const userMessageColor = hackerMode ? '#ff5555' : '#9b87f5';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
          <HologramEffect
            intensity={isUser ? 'low' : 'medium'}
            color={isUser ? userMessageColor : messageColor}
            animated={!isUser && (isTyping || isSpeaking)}
            pulseRate={isSpeaking ? 1 : 1.5}
            className={`rounded-lg overflow-hidden border ${
              hackerMode 
                ? isUser ? 'border-red-500/30' : 'border-red-700/50'
                : isUser ? 'border-purple-500/30' : 'border-jarvis/30'
            }`}
          >
            <div className="p-3">
              <div className="relative">
                <div className="text-white">
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse"></span>
                  )}
                </div>
                
                {/* Voice waves for speaking effect */}
                {isSpeaking && !isUser && (
                  <div className="absolute right-0 top-0 -mt-1 flex items-center gap-[2px] text-jarvis">
                    <Mic className="w-3 h-3 mr-1 animate-pulse" />
                    {speechWaves.map((height, i) => (
                      <div
                        key={i}
                        className="w-[3px] bg-current rounded-full transition-all duration-150"
                        style={{ height: `${height + 3}px` }}
                      />
                    ))}
                  </div>
                )}
                
                {showTimestamp && message.timestamp && (
                  <div className="text-xs opacity-60 mt-1 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            </div>
          </HologramEffect>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HologramMessage;
