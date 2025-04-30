
import React from 'react';
import { cn } from '@/lib/utils';

interface IronManBackgroundProps {
  isGlowing: boolean;
}

const IronManBackground: React.FC<IronManBackgroundProps> = ({ isGlowing }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
      <div 
        className={cn(
          "relative w-64 h-64 md:w-80 md:h-80 transition-all duration-1000", 
          isGlowing && "animate-pulse"
        )}
      >
        <img 
          src="/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png" 
          alt="Iron Man" 
          className="w-full h-full object-contain"
        />
        {isGlowing && (
          <div className={cn(
            "absolute inset-0 bg-transparent",
            "before:content-[''] before:absolute before:inset-0",
            "before:bg-[#B30000] before:opacity-20 before:blur-xl before:rounded-full",
            "after:content-[''] after:absolute after:inset-12",
            "after:bg-[#33C3F0] after:opacity-30 after:blur-3xl after:rounded-full",
            "animate-reactor-glow"
          )}/>
        )}
      </div>
    </div>
  );
};

export default IronManBackground;
