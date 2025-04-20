
import React from 'react';
import { JarvisMode } from './JarvisCore';
import JarvisFaceAI from './JarvisFaceAI';

interface JarvisAvatarProps {
  activeMode: JarvisMode;
  isSpeaking: boolean;
}

const JarvisAvatar: React.FC<JarvisAvatarProps> = ({ activeMode, isSpeaking }) => {
  return (
    <div className="jarvis-panel relative h-[350px] flex items-center justify-center group">
      {/* Tech background */}
      <div className="tech-grid"></div>
      
      {/* Jarvis Logo */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="w-6 h-6 rounded-full bg-jarvis/80 flex items-center justify-center mr-2">
          <span className="text-black font-bold text-xs">J</span>
        </div>
        <div className="jarvis-logo text-sm">J.A.R.V.I.S</div>
      </div>
      
      {/* Avatar Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-64 h-64 rounded-full bg-jarvis/5 absolute"></div>
        <div className="w-48 h-48 rounded-full bg-jarvis/10 absolute animate-pulse-slow"></div>
        <div className="w-56 h-56 rounded-full border border-jarvis/30 absolute"></div>
      </div>
      
      {/* Animated circles */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-jarvis/20 animate-pulse-slow"></div>
      <div className="absolute w-[320px] h-[320px] rounded-full border border-jarvis/10 animate-pulse-slow" style={{ animationDelay: '0.7s' }}></div>
      
      {/* JarvisFaceAI Component */}
      <JarvisFaceAI isSpeaking={isSpeaking} className="z-[1]" />
      
      {/* Status Indicator */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs ${
        isSpeaking ? 'bg-jarvis/20 text-jarvis animate-flicker' : 'bg-gray-800/50 text-gray-400'
      }`}>
        {isSpeaking ? 'SPEAKING' : 'IDLE'}
      </div>
      
      {/* Mode Badge */}
      <div className="absolute top-4 right-4 bg-jarvis/20 text-jarvis px-3 py-1 rounded-full text-xs uppercase font-bold">
        {activeMode} mode
      </div>
      
      {/* Glowing effect on hover */}
      <div className="absolute inset-0 border border-transparent rounded-md transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:border-jarvis/40 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]"></div>
    </div>
  );
};

export default JarvisAvatar;
