
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particle';
import { ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  primaryActionLabel: string;
  primaryActionOnClick: () => void;
  secondaryActionLabel?: string;
  secondaryActionOnClick?: () => void;
  visual?: React.ReactNode;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryActionLabel,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
  visual,
  className
}) => {
  return (
    <section className={cn(
      "relative min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 overflow-hidden",
      className
    )}>
      <FloatingParticles />
      
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-6 z-10">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-xl text-gray-300">
              {subtitle}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-gradient-to-r from-jarvis to-purple-600 hover:from-jarvis/90 hover:to-purple-600/90 text-white border-none px-8 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={primaryActionOnClick}
            >
              <span>{primaryActionLabel}</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            {secondaryActionLabel && secondaryActionOnClick && (
              <Button 
                variant="outline"
                className="border-jarvis text-jarvis hover:bg-jarvis/10 px-8 py-6 text-lg rounded-lg"
                onClick={secondaryActionOnClick}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end items-center">
          {visual}
        </div>
      </div>
      
      {/* Decorative bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};
