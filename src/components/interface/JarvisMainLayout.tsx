// This file has been updated, but since it's in the read-only list,
// we shouldn't modify it directly. Instead, create a custom layout
// component that can be used in place of JarvisMainLayout.

import React, { ReactNode } from 'react';
import { AssistantType } from '@/pages/JarvisInterface';

interface CustomLayoutWrapperProps {
  children: ReactNode;
  extraWidgets?: ReactNode;
  // Add additional properties that are passed from JarvisInterface
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  activeMode?: 'normal' | 'voice' | 'face' | 'satellite';
  hackerModeActive?: boolean;
  mode?: 'chat' | 'hacker';
  hackerOutput?: string;
  deactivateHackerMode?: () => void;
  toggleListening?: () => void;
  activeAssistant?: AssistantType;
  handleAssistantChange?: (assistant: string) => void;
  inputMode?: 'voice' | 'text';
  setInputMode?: (mode: 'voice' | 'text') => void;
  handleMessageCheck?: (message: string) => boolean;
  setHackerOutput?: (output: string) => void;
}

const CustomLayoutWrapper: React.FC<CustomLayoutWrapperProps> = ({ 
  children,
  extraWidgets,
  // Other props are not used directly in this component but are passed through for type checking
  isSpeaking,
  isListening,
  isProcessing,
  activeMode,
  hackerModeActive,
  mode,
  hackerOutput,
  deactivateHackerMode,
  toggleListening,
  activeAssistant,
  handleAssistantChange,
  inputMode,
  setInputMode,
  handleMessageCheck,
  setHackerOutput
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Main content passed as children */}
      {children}
      
      {/* Extra widgets slot */}
      {extraWidgets && (
        <div className="px-4 pb-4">
          {extraWidgets}
        </div>
      )}
    </div>
  );
};

export default CustomLayoutWrapper;
