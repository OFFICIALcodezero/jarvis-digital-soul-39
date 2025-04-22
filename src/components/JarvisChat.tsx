import React, { useState, useEffect } from 'react';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { JarvisChatProps } from '@/types/chat';
import HackerMode from './chat/HackerMode';
import ChatLayout from './chat/ChatLayout';
import FaceRecognition from './FaceRecognition';
import { useChatLogic } from '@/hooks/useChatLogic';

const JarvisChat: React.FC<JarvisChatProps> = ({ 
  activeMode, 
  setIsSpeaking, 
  isListening: parentIsListening,
  activeAssistant,
  setActiveAssistant,
  inputMode,
  setInputMode
}) => {
  const [hackerOutput, setHackerOutput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(false);

  const {
    messages,
    input,
    setInput,
    isTyping,
    currentTypingText,
    isProcessing,
    selectedLanguage,
    setSelectedLanguage,
    chatEndRef,
    processUserMessage,
    scrollToBottom,
  } = useChatLogic(activeMode, setIsSpeaking, activeAssistant, inputMode);

  const { speakText, stopSpeaking, setAudioVolume, isPlaying, voices, selectedVoice, setSelectedVoice } = useVoiceSynthesis(activeMode);

  useEffect(() => {
    scrollToBottom();
  }, [messages, hackerOutput, currentTypingText]);

  useEffect(() => {
    setAudioVolume(volume / 100);
  }, [volume, setAudioVolume]);

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 80);
  };

  const getSuggestions = (): string[] => {
    return [
      "What can you help me with?",
      "Tell me a joke",
      "What's the weather like today?",
      "Explain quantum computing"
    ];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const result = await processUserMessage(input);
    setInput('');
    
    if (result?.shouldSpeak) {
      setAudioPlaying(true);
      setIsSpeaking(true);
      await speakText(result.text);
      setAudioPlaying(false);
      setIsSpeaking(false);
    }
  };

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript 
  } = useSpeechRecognition();

  useEffect(() => {
    if ((activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      if (parentIsListening && !isListening) {
        startListening();
      } else if (!parentIsListening && isListening) {
        stopListening();
      }
    }
  }, [activeMode, parentIsListening, isListening, startListening, stopListening, inputMode]);

  useEffect(() => {
    if (transcript && (activeMode === 'voice' || activeMode === 'face' || inputMode === 'voice')) {
      setInput(transcript);
      clearTranscript();
      handleSendMessage();
    }
  }, [transcript]);

  useEffect(() => {
    if (activeMode === 'face') {
      setFaceRecognitionActive(true);
    } else {
      setFaceRecognitionActive(false);
    }
  }, [activeMode]);

  if (activeMode === 'hacker') {
    return <HackerMode hackerOutput={hackerOutput} setHackerOutput={setHackerOutput} />;
  }

  return (
    <div className="jarvis-panel flex-1 flex flex-col h-full">
      <div className="p-3 bg-black/60 border-b border-jarvis/20">
        <h2 className="text-jarvis font-medium">
          {activeAssistant.toUpperCase()} Chat Interface
        </h2>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {activeMode === 'face' && (
          <div className="md:w-[320px] p-3 bg-black/30 border-r border-jarvis/20">
            <FaceRecognition 
              isActive={faceRecognitionActive}
              toggleActive={() => setFaceRecognitionActive(!faceRecognitionActive)}
              onFaceDetected={() => {}}
              onFaceNotDetected={() => {}}
            />
          </div>
        )}
        
        <ChatLayout
          messages={messages}
          input={input}
          setInput={setInput}
          isTyping={isTyping}
          currentTypingText={currentTypingText}
          isProcessing={isProcessing}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          audioPlaying={audioPlaying}
          volume={volume}
          onVolumeChange={(values: number[]) => setVolume(values[0])}
          stopSpeaking={stopSpeaking}
          toggleMute={toggleMute}
          isListening={isListening}
          activeAssistant={activeAssistant}
          inputMode={inputMode}
          setInputMode={setInputMode}
          handleSendMessage={handleSendMessage}
          getSuggestions={getSuggestions}
        />
      </div>
    </div>
  );
};

export default JarvisChat;
