
import React, { useState, useEffect, useRef } from 'react';

interface CommandResponseProps {
  message: string;
  isTyping: boolean;
}

const CommandResponse: React.FC<CommandResponseProps> = ({ message, isTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const messageRef = useRef(message);
  const typingSpeed = 30; // milliseconds per character
  
  useEffect(() => {
    // Reset typing animation when message changes
    if (message !== messageRef.current) {
      setDisplayedText('');
      setCharIndex(0);
      messageRef.current = message;
    }
  }, [message]);
  
  useEffect(() => {
    if (!isTyping || charIndex >= messageRef.current.length) return;
    
    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + messageRef.current.charAt(charIndex));
      setCharIndex(prev => prev + 1);
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [charIndex, isTyping]);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30 min-h-[120px] backdrop-blur-sm">
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
        <h3 className="text-cyan-300 font-medium">JARVIS RESPONSE</h3>
      </div>
      
      <div className="text-slate-200 font-mono leading-relaxed">
        {displayedText}
        {isTyping && charIndex < messageRef.current.length && (
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-blink"></span>
        )}
      </div>
    </div>
  );
};

export default CommandResponse;
