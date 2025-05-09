
import React from 'react';
import { Brain, Mic, Sparkles, Cpu, Tv, Satellite } from 'lucide-react';
import { ControlOption } from '@/components/ControlPanel';

interface ControlOptionsProps {
  activeMode: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite';
  hackerModeActive: boolean;
}

export const useControlOptions = ({ activeMode, hackerModeActive }: ControlOptionsProps) => {
  const controlOptions: ControlOption[] = [
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
      icon: <Tv />,
      active: activeMode === 'face' && !hackerModeActive
    },
    {
      id: 'satellite',
      label: 'Satellite Mode',
      icon: <Satellite />,
      active: activeMode === 'satellite' && !hackerModeActive
    },
    {
      id: 'hacker',
      label: 'Hacker Mode',
      icon: <Cpu />,
      active: hackerModeActive
    }
  ];
  
  return controlOptions;
};
