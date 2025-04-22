
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Volume2, VolumeX, Zap, Bot, MessageSquare } from 'lucide-react';

interface AudioControlsProps {
  isMicActive?: boolean;
  onMicToggle?: () => void;
  volume: number;
  onVolumeChange?: (value: number[]) => void;
  audioPlaying?: boolean;
  stopSpeaking?: () => void;
  toggleMute?: () => void;
  activeAssistant?: 'jarvis' | 'chatgpt' | 'alexa' | 'siri' | 'gemini';
  onAssistantChange?: (assistant: 'jarvis' | 'chatgpt' | 'alexa' | 'siri' | 'gemini') => void;
  inputMode?: 'voice' | 'text';
  onInputModeChange?: (mode: 'voice' | 'text') => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isMicActive,
  onMicToggle,
  volume,
  onVolumeChange,
  audioPlaying,
  stopSpeaking,
  toggleMute,
  activeAssistant = 'jarvis',
  onAssistantChange,
  inputMode = 'text',
  onInputModeChange
}) => {
  return (
    <div className="flex flex-col gap-3">
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
      
      {onInputModeChange && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onInputModeChange('text')}
            className={`${
              inputMode === 'text' 
                ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
                : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
            } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onInputModeChange('voice')}
            className={`${
              inputMode === 'voice' 
                ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
                : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
            } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
          >
            <Mic className="h-3 w-3 mr-1" />
            Voice
          </Button>
        </div>
      )}
      
      {onAssistantChange && (
        <div className="flex flex-wrap gap-2">
          {['jarvis', 'chatgpt', 'alexa', 'siri', 'gemini'].map((assistant) => (
            <Button
              key={assistant}
              variant="outline"
              size="sm"
              onClick={() => onAssistantChange(assistant as any)}
              className={`${
                activeAssistant === assistant 
                  ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
                  : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
              } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff] text-xs`}
            >
              <Bot className="h-3 w-3 mr-1" />
              {assistant.charAt(0).toUpperCase() + assistant.slice(1)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioControls;
