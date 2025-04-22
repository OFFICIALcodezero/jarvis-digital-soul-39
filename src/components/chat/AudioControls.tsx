
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Square } from 'lucide-react';

interface AudioControlsProps {
  volume: number;
  setVolume: (volume: number) => void;
  audioPlaying: boolean;
  stopSpeaking: () => void;
  toggleMute: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  volume,
  setVolume,
  audioPlaying,
  stopSpeaking,
  toggleMute,
}) => {
  return (
    <div className="p-2 flex items-center justify-end space-x-2 border-t border-jarvis/10">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
        onClick={toggleMute}
      >
        {volume === 0 ? (
          <VolumeX className="h-4 w-4 mr-1" />
        ) : (
          <Volume className="h-4 w-4 mr-1" />
        )}
        {volume === 0 ? 'Unmute' : 'Mute'}
      </Button>
      
      {audioPlaying && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
          onClick={stopSpeaking}
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </Button>
      )}
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">Volume:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-jarvis"
        />
      </div>
    </div>
  );
};

export default AudioControls;
