
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <p className="animate-fade-in">
        {text}
      </p>
    </div>
  );
};

export const GradientText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span className={cn("bg-gradient-to-r from-purple-400 via-jarvis to-purple-600 bg-clip-text text-transparent", className)}>
      {text}
    </span>
  );
};
