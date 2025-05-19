
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StartupSequence from '@/components/StartupSequence';
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg';

const Startup = () => {
  const navigate = useNavigate();
  
  return (
    <AnimatedGradientBg>
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <StartupSequence />
      </div>
    </AnimatedGradientBg>
  );
};

export default Startup;
