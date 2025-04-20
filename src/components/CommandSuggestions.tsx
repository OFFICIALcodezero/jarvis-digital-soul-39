
import React from 'react';
import { MessageSquare, Zap, Database, Globe, HeartPulse, Palette } from 'lucide-react';

const CommandSuggestions = () => {
  const commandGroups = [
    {
      title: "Conversation",
      icon: MessageSquare,
      commands: ["Tell me a joke", "What time is it?", "Who created you?"]
    },
    {
      title: "Hacking Module",
      icon: Zap, 
      commands: ["Access the mainframe", "Scan for vulnerabilities", "Decrypt the signal"]
    },
    {
      title: "Knowledge",
      icon: Database,
      commands: ["Who is Elon Musk?", "Explain quantum computing", "Latest tech news"]
    }
  ];

  const handleCommandClick = (command: string) => {
    // Create a custom event that JarvisChat can listen for
    const event = new CustomEvent('jarvis-command', { 
      detail: { command } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="jarvis-panel overflow-hidden">
      <div className="bg-black/60 p-3 border-b border-jarvis/20">
        <h3 className="text-jarvis font-medium">Command Suggestions</h3>
      </div>
      
      <div className="p-4 grid grid-cols-1 gap-4">
        {commandGroups.map((group, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center text-jarvis/80 mb-2">
              <group.icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{group.title}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {group.commands.map((command, cmdIndex) => (
                <div 
                  key={cmdIndex} 
                  className="command-suggestion"
                  onClick={() => handleCommandClick(command)}
                >
                  "{command}"
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandSuggestions;
