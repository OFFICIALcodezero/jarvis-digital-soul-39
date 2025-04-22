
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, Trash } from 'lucide-react';

interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: (output: string) => void;
}

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput }) => {
  const [hackerCommand, setHackerCommand] = useState('');

  const handleHackerCommandSubmit = () => {
    if (!hackerCommand.trim()) return;
    
    setHackerOutput(`
[+] Executing: ${hackerCommand}
[+] Processing command...
[+] Command executed with code: 0
[+] Operation completed successfully
    `);
    
    setHackerCommand('');
  };

  const clearHackerConsole = () => {
    setHackerOutput('');
  };

  return (
    <div className="jarvis-panel flex-1 flex flex-col">
      <div className="p-2 bg-black/60 flex items-center justify-between">
        <div className="text-jarvis text-sm terminal-text">JARVIS Terminal</div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-jarvis hover:bg-jarvis/20" 
            onClick={clearHackerConsole}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-black/80 font-mono text-jarvis text-sm overflow-y-auto">
        <div className="terminal-text text-jarvis/80">
          <p>J.A.R.V.I.S v1.0 - Terminal Interface</p>
          <p>Copyright (c) Stark Industries</p>
          <p className="mb-4">Type 'help' for available commands</p>
          {hackerOutput && (
            <pre className="whitespace-pre-wrap text-xs">{hackerOutput}</pre>
          )}
        </div>
      </div>
      
      <div className="p-2 bg-black/60 flex">
        <div className="text-jarvis mr-2 terminal-text">$</div>
        <Input
          value={hackerCommand}
          onChange={(e) => setHackerCommand(e.target.value)}
          className="flex-1 bg-transparent border-none text-jarvis terminal-text text-sm focus-visible:ring-0"
          placeholder="Enter command..."
          onKeyDown={(e) => e.key === 'Enter' && handleHackerCommandSubmit()}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-jarvis hover:bg-jarvis/20 ml-2" 
          onClick={handleHackerCommandSubmit}
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HackerMode;
