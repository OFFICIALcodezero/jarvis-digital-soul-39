
import React from 'react';
import { Brain, Mic, Sparkles, Terminal, Image } from 'lucide-react';

interface ControlOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

interface UseControlOptionsProps {
  activeMode: 'normal' | 'voice' | 'face';
  hackerModeActive: boolean;
}

export const useControlOptions = ({ activeMode, hackerModeActive }: UseControlOptionsProps) => {
  const controlOptions = [
    {
      id: 'normal',
      label: 'Normal Mode',
      icon: <Brain />,
      active: activeMode === 'normal' && !hackerModeActive
    },
    {
      id: 'voice',
      label: 'Voice Mode',
      icon: <Mic />,
      active: activeMode === 'voice' && !hackerModeActive
    },
    {
      id: 'face',
      label: 'Face Mode',
      icon: <Sparkles />,
      active: activeMode === 'face' && !hackerModeActive
    },
    {
      id: 'images',
      label: 'Image Generator',
      icon: <Image />,
      active: false
    }
  ];

  // Add hacker mode to control options only if it's active
  const allOptions = hackerModeActive 
    ? [
        ...controlOptions,
        {
          id: 'hacker',
          label: 'Hacker Mode',
          icon: <Terminal />,
          active: hackerModeActive
        }
      ]
    : controlOptions;

  return allOptions;
};
