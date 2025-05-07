
import React, { useEffect } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useJarvisChat } from '@/components/JarvisChatContext';

interface JarvisVoiceCommandsProps {
  isListening: boolean;
  hackerModeActive: boolean;
  onActivateHacker: () => void;
}

const JarvisVoiceCommands: React.FC<JarvisVoiceCommandsProps> = ({ 
  isListening, 
  hackerModeActive,
  onActivateHacker
}) => {
  const { transcript, registerCommand, unregisterCommand } = useVoiceCommands(isListening);
  const { sendMessage } = useJarvisChat();
  
  // Register available voice commands
  useEffect(() => {
    // Command to launch hacker mode
    registerCommand('launch-hacker', {
      pattern: /launch.+hacker|hacker.+mode|enable.+hacker/i,
      handler: () => {
        onActivateHacker();
      },
      feedback: "Hacker mode activated. Security protocols engaged."
    });
    
    // Command to run security scan
    registerCommand('security-scan', {
      pattern: /security\s+scan|run\s+scan|threat\s+scan|check\s+security/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.scan();
        }
        sendMessage("Run a security scan");
      },
      feedback: "Initiating security scan. Checking for threats."
    });
    
    // Command to activate emergency mode
    registerCommand('emergency-mode', {
      pattern: /emergency\s+mode|activate\s+lockdown|security\s+lockdown/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.security) {
          window.JARVIS.security.setEmergencyMode();
        }
        sendMessage("Activate emergency mode");
      },
      feedback: "Emergency mode activated. System locked down. Network connections disabled."
    });
    
    // Command to create system backup
    registerCommand('system-backup', {
      pattern: /create\s+backup|backup\s+system|save\s+system\s+state/i,
      handler: () => {
        if (window.JARVIS && window.JARVIS.system) {
          window.JARVIS.system.backup();
        }
        sendMessage("Create a system backup");
      },
      feedback: "Creating system backup. This will take a few moments."
    });
    
    // Command to check for updates
    registerCommand('check-updates', {
      pattern: /check\s+(for\s+)?updates|update\s+system/i,
      handler: () => {
        sendMessage("Check for system updates");
      },
      feedback: "Checking for system updates."
    });
    
    // Command to scan for nearby objects
    registerCommand('scan-objects', {
      pattern: /scan\s+(for\s+)?objects|detect\s+objects/i,
      handler: () => {
        sendMessage("Scan for objects in my environment");
      },
      feedback: "Initiating object detection scan."
    });
    
    // Clean up commands when component unmounts
    return () => {
      unregisterCommand('launch-hacker');
      unregisterCommand('security-scan');
      unregisterCommand('emergency-mode');
      unregisterCommand('system-backup');
      unregisterCommand('check-updates');
      unregisterCommand('scan-objects');
    };
  }, [registerCommand, unregisterCommand, onActivateHacker, sendMessage]);

  return null; // This is a non-UI component
};

export default JarvisVoiceCommands;
