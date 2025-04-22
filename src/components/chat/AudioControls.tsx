
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface AudioControlsProps {
  isMicActive: boolean;
  isVoiceEnabled: boolean;
  volume: number;
  onMicToggle: () => void;
  onVoiceToggle: () => void;
  onVolumeChange: (value: number[]) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isMicActive,
  isVoiceEnabled,
  volume,
  onMicToggle,
  onVoiceToggle,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onMicToggle}
        className={`${
          isMicActive 
            ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
            : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
        } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
      >
        {isMicActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onVoiceToggle}
          className={`${
            isVoiceEnabled 
              ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
              : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
          } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
        >
          {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        {isVoiceEnabled && (
          <div className="w-24">
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
              className="[&>span]:bg-[#33c3f0]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
