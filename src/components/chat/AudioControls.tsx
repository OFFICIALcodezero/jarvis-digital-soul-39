import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface AudioControlsProps {
  isMicActive?: boolean;
  onMicToggle?: () => void;
  volume: number;
  onVolumeChange?: (value: number[]) => void;
  audioPlaying?: boolean;
  stopSpeaking?: () => void;
  toggleMute?: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isMicActive,
  onMicToggle,
  volume,
  onVolumeChange,
  audioPlaying,
  stopSpeaking,
  toggleMute
}) => {
  return (
    <div className="flex items-center gap-3">
      {onMicToggle && (
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
      )}
      
      <div className="flex items-center gap-3">
        {toggleMute && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="bg-transparent border-[#33c3f0]/30 text-[#8a8a9b] hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        )}
        
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
      </div>
    </div>
  );
};

export default AudioControls;
