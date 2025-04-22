
import React, { useState, useEffect } from 'react';
import { generateAssistantResponse } from '@/services/aiAssistantService';
import { Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
}

const fakeCommands = {
  'scan': () => ({
    output: `Scanning network...\n[====================] 100%\nFound devices:\n- Server01 (192.168.1.101)\n- WorkStation02 (192.168.1.102)\n- PrinterXZ (192.168.1.103)\nScan complete.`,
    delay: 2000
  }),
  'decrypt': (target?: string) => ({
    output: target 
      ? `Attempting to decrypt ${target}...\n[===============     ] 75%\nDecryption failed: Advanced encryption detected`
      : 'Usage: decrypt <target>',
    delay: 3000
  }),
  'trace': (ip?: string) => ({
    output: ip
      ? `Initiating trace on ${ip}...\nRouting through proxy servers...\nLocation: Antarctica\nISP: Penguin Networks\nTrace complete.`
      : 'Usage: trace <ip-address>',
    delay: 2500
  }),
  'help': () => ({
    output: `Available commands:\n- scan : Scan local network\n- decrypt <target> : Attempt decryption\n- trace <ip> : Trace IP location\n- system : System status\n- matrix : Enter the matrix\n- help : Show this help`,
    delay: 0
  }),
  'system': () => ({
    output: `J.A.R.V.I.S. System Status:\nCPU: 42% utilized\nRAM: 13.37 GB free\nNetwork: ACTIVE\nSecurity Level: MAXIMUM\nQuantum Core: STABLE`,
    delay: 1000
  }),
  'matrix': () => ({
    output: `Entering the Matrix...\n\n01001010 01000001 01010010\n01010110 01001001 01010011\n\nConnection established. Welcome to the desert of the real.`,
    delay: 1500
  })
};

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const appendOutput = (text: string) => {
    setHackerOutput(prev => `${prev}\n${text}`);
  };

  const handleFakeCommand = async (command: string, args: string[]) => {
    const cmd = command.toLowerCase();
    if (fakeCommands[cmd]) {
      setIsProcessing(true);
      const { output, delay } = fakeCommands[cmd](args[0]);
      await new Promise(resolve => setTimeout(resolve, delay));
      appendOutput(output);
      setIsProcessing(false);
      return true;
    }
    return false;
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    appendOutput(`\n> ${command}`);
    
    try {
      const [cmd, ...args] = command.split(' ');
      const isFakeCommand = await handleFakeCommand(cmd, args);
      
      if (!isFakeCommand) {
        const messages = [{ role: 'user' as const, content: command }];
        const response = await generateAssistantResponse(
          command,
          messages,
          'jarvis',
          'en'
        );
        appendOutput(`\n${response}`);
      }
      
      appendOutput('\n> Ready for next command...');
    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Command Error",
        description: "Failed to process command. Please try again.",
        variant: "destructive"
      });
      appendOutput('\n[ERROR] Command processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    await handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (!hackerOutput) {
      setHackerOutput('J.A.R.V.I.S. Hacker Interface v1.0.0\n> System initialized\n> Awaiting commands...');
    }
  }, [hackerOutput, setHackerOutput]);

  return (
    <div className="flex-1 flex flex-col h-full bg-black/90">
      <div className="flex-1 p-4 font-mono text-jarvis overflow-auto">
        <pre className="whitespace-pre-wrap">{hackerOutput}</pre>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-jarvis/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-jarvis" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/50 border-jarvis/30 text-jarvis font-mono"
            placeholder={isProcessing ? "Processing..." : "Type 'help' for commands..."}
            disabled={isProcessing}
          />
        </div>
      </form>
    </div>
  );
};

export default HackerMode;
