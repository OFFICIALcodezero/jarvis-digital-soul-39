
import React, { useState, useEffect } from 'react';
import { generateAssistantResponse } from '@/services/aiAssistantService';
import { Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  scanNetwork, 
  attemptDecrypt, 
  traceIP, 
  getSystemStatus, 
  simulateMatrix, 
  handleKeylogger, 
  performNetworkScan 
} from '@/services/hackerModeService';

export interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
}

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const appendOutput = (text: string) => {
    setHackerOutput(prev => `${prev}\n${text}`);
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    appendOutput(`\n> ${command}`);
    
    try {
      const [cmd, ...args] = command.split(' ');
      const lowerCmd = cmd.toLowerCase();
      
      // Handle commands with real functionality
      switch(lowerCmd) {
        case 'scan':
          const scanResult = await scanNetwork();
          appendOutput(`\n${scanResult}`);
          break;
          
        case 'decrypt':
          const target = args[0];
          const decryptResult = await attemptDecrypt(target);
          appendOutput(`\n${decryptResult}`);
          break;
          
        case 'trace':
          const ip = args[0];
          const traceResult = await traceIP(ip);
          appendOutput(`\n${traceResult}`);
          break;
          
        case 'system':
          const sysStatus = await getSystemStatus();
          appendOutput(`\n${sysStatus}`);
          break;
          
        case 'matrix':
          const matrixOutput = await simulateMatrix();
          appendOutput(`\n${matrixOutput}`);
          break;
          
        case 'keylogger':
          const operation = args[0]?.toLowerCase();
          if (operation !== 'start' && operation !== 'stop') {
            appendOutput('\nUsage: keylogger <start|stop>');
          } else {
            const keyloggerResult = await handleKeylogger(operation);
            appendOutput(`\n${keyloggerResult}`);
          }
          break;
          
        case 'netscan':
          const range = args[0];
          if (!range) {
            appendOutput('\nUsage: netscan <ip-range>\nExample: netscan 192.168.1.0/24');
          } else {
            const scanResult = await performNetworkScan(range);
            appendOutput(`\n${scanResult}`);
          }
          break;
          
        case 'help':
          appendOutput(`
Available commands:
- scan : Scan local network
- decrypt <target> : Attempt ethical decryption simulation
- trace <ip> : Trace IP geolocation (ethical use only)
- system : System status
- matrix : Enter the matrix (visual effect)
- keylogger <start|stop> : Simulate keyboard input monitoring
- netscan <ip-range> : Ethical network scanning simulation
- help : Show this help`);
          break;
          
        default:
          // For unrecognized commands, use AI assistant
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
