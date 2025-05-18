
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Paperclip, ChevronUp, ChevronDown, Image } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import HologramEffect from '../ui/hologram-effect';

interface MessageInputProps {
  input?: string;
  setInput?: (value: string) => void;
  handleSendMessage?: () => void;
  onSendMessage?: (text: string) => void;
  isProcessing?: boolean;
  isListening?: boolean;
  isDisabled?: boolean;
  onToggleListen?: () => void;
  audioPlaying?: boolean;
  onToggleMute?: () => void;
  isMuted?: boolean;
  onImageUpload?: () => void;
  hackerMode?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input = '',
  setInput = () => {},
  handleSendMessage,
  onSendMessage,
  isProcessing = false,
  isListening = false,
  isDisabled = false,
  onToggleListen,
  audioPlaying = false,
  onToggleMute,
  isMuted = false,
  onImageUpload,
  hackerMode = false,
}) => {
  const [visualFeedback, setVisualFeedback] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [dotCount, setDotCount] = useState(1);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create visual feedback for voice recognition
  useEffect(() => {
    let interval: number;
    
    if (isListening) {
      setVisualFeedback('listening');
      // Animate the dots when listening
      interval = window.setInterval(() => {
        setDotCount(prev => prev >= 3 ? 1 : prev + 1);
      }, 500);
    } else if (audioPlaying) {
      setVisualFeedback('speaking');
    } else {
      setVisualFeedback('idle');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, audioPlaying]);
  
  useEffect(() => {
    // Focus input when advanced options are closed
    if (!showAdvancedOptions && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAdvancedOptions]);
  
  const listeningText = `Listening${'.'.repeat(dotCount)}`;
  
  const handleSubmit = () => {
    if (isDisabled) return;
    
    if (handleSendMessage) {
      handleSendMessage();
    } else if (onSendMessage && input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className={`p-3 bg-black/30 border-t ${hackerMode ? 'border-red-500/20' : 'border-jarvis/20'} transition-all`}>
      {/* Advanced options panel */}
      {showAdvancedOptions && (
        <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <HologramEffect intensity="low" animated={false}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}
              onClick={onToggleListen}
              disabled={isDisabled}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
          </HologramEffect>
          
          <HologramEffect intensity="low" animated={false}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}
              onClick={onToggleMute}
              disabled={isDisabled}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </HologramEffect>
          
          <HologramEffect intensity="low" animated={false}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}
              onClick={onImageUpload}
              disabled={isDisabled}
            >
              <Image className="h-4 w-4" />
              Generate Image
            </Button>
          </HologramEffect>
          
          <HologramEffect intensity="low" animated={false}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}
              onClick={() => {}}
              disabled={isDisabled}
            >
              <Paperclip className="h-4 w-4" />
              Upload File
            </Button>
          </HologramEffect>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {/* Main input area */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`${
              showAdvancedOptions 
                ? hackerMode ? 'bg-red-950/40 text-red-400' : 'bg-jarvis/10 text-jarvis'
                : hackerMode ? 'text-red-500 hover:bg-red-950/20' : 'text-gray-500 hover:bg-jarvis/10'
            } transition-colors`}
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex-1 relative">
            <HologramEffect intensity="low" animated={isListening}>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 bg-black/40 text-white ${
                  hackerMode 
                    ? 'border-red-500/30 focus-visible:ring-red-500/30 focus-visible:border-red-500/50'
                    : 'border-jarvis/30 focus-visible:ring-jarvis/30 focus-visible:border-jarvis/50'
                } ${
                  isListening ? hackerMode ? 'border-red-500/50 bg-red-950/10' : 'border-jarvis/50 bg-jarvis/5' : ''
                }`}
                placeholder={isListening ? listeningText : "Type your message..."}
                disabled={isProcessing || (isListening && !input) || isDisabled}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </HologramEffect>
            
            {isListening && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <Mic className={`h-4 w-4 ${hackerMode ? 'text-red-400' : 'text-jarvis'} animate-pulse`} />
              </div>
            )}
          </div>
          
          <HologramEffect intensity="low" animated={false}>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${
                input.trim() 
                  ? hackerMode ? 'text-red-400 hover:bg-red-950/20' : 'text-jarvis hover:bg-jarvis/20'
                  : 'text-gray-500'
              }`}
              onClick={handleSubmit}
              disabled={isProcessing || isDisabled || (!input.trim() && !isListening)}
            >
              <Send className="h-5 w-5" />
            </Button>
          </HologramEffect>
        </div>
        
        {/* Status indicators */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div>
            {visualFeedback === 'listening' && (
              <span className="text-green-400">Listening...</span>
            )}
            {visualFeedback === 'speaking' && (
              <span className={hackerMode ? "text-red-400" : "text-jarvis"}>Speaking...</span>
            )}
            {isProcessing && !isListening && !audioPlaying && (
              <span className={hackerMode ? "text-red-400" : "text-jarvis"}>Processing...</span>
            )}
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs ${
            hackerMode 
              ? 'bg-red-950/20 text-red-400' 
              : 'bg-jarvis/10 text-jarvis'
          }`}>
            JARVIS v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
