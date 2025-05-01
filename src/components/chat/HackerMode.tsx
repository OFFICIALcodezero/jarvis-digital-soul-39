
import React, { useState, useEffect, useRef } from 'react';
import { generateAssistantResponse } from '@/services/aiAssistantService';
import { Terminal, Code, Database, Shield, Wifi, Server, Lock, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  scanNetwork, 
  attemptDecrypt, 
  traceIP, 
  getSystemStatus, 
  simulateMatrix, 
  handleKeylogger, 
  performNetworkScan,
  scanPorts,
  simulatePasswordCrack,
  simulateSQLInjection,
  simulateXSS,
  simulateWebcamCheck,
  getHackerModeHelp,
  simulatePhishing,
  simulateRansomware,
  simulateSocialEngineering,
  simulateWirelessAttack,
  simulateDarkwebScan,
  performBinaryAnalysis,
  simulateDoS,
  simulateForensicAnalysis,
  simulateAIPersonaGeneration
} from '@/services/hackerModeService';

export interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
  onDeactivate?: () => void;
}

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput, onDeactivate }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const appendOutput = (text: string) => {
    setHackerOutput(prev => `${prev}\n${text}`);
  };
  
  // Scroll to the end of output when content changes
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hackerOutput]);

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setActiveCommand(command.split(' ')[0].toLowerCase());
    appendOutput(`\n> ${command}`);
    
    try {
      const [cmd, ...args] = command.split(' ');
      const lowerCmd = cmd.toLowerCase();
      
      // Handle deactivation
      if (lowerCmd === 'deactivate') {
        appendOutput('\nDeactivating hacker mode...');
        setTimeout(() => {
          if (onDeactivate) {
            onDeactivate();
          }
        }, 1000);
        setIsProcessing(false);
        return;
      }
      
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
        
        case 'ports':
          const portTarget = args[0];
          const portsResult = await scanPorts(portTarget);
          appendOutput(`\n${portsResult}`);
          break;
          
        case 'crack':
          const hash = args[0];
          const crackResult = await simulatePasswordCrack(hash);
          appendOutput(`\n${crackResult}`);
          break;
          
        case 'sqli':
          const sqliTarget = args[0];
          const sqliResult = await simulateSQLInjection(sqliTarget);
          appendOutput(`\n${sqliResult}`);
          break;
          
        case 'xss':
          const xssTarget = args[0];
          const xssResult = await simulateXSS(xssTarget);
          appendOutput(`\n${xssResult}`);
          break;
          
        case 'webcam':
          const webcamResult = await simulateWebcamCheck();
          appendOutput(`\n${webcamResult}`);
          break;
        
        // New commands for enhanced hacking tools
        case 'phish':
          const phishTarget = args[0];
          const phishResult = await simulatePhishing(phishTarget);
          appendOutput(`\n${phishResult}`);
          break;
          
        case 'ransomware':
          const ranTarget = args[0];
          const ranResult = await simulateRansomware(ranTarget);
          appendOutput(`\n${ranResult}`);
          break;
          
        case 'social':
          const socialTarget = args[0];
          const socialResult = await simulateSocialEngineering(socialTarget);
          appendOutput(`\n${socialResult}`);
          break;
          
        case 'wifi':
          const ssid = args[0];
          const wifiResult = await simulateWirelessAttack(ssid);
          appendOutput(`\n${wifiResult}`);
          break;
          
        case 'darkweb':
          const query = args.join(' ');
          const darkwebResult = await simulateDarkwebScan(query);
          appendOutput(`\n${darkwebResult}`);
          break;
          
        case 'binary':
          const file = args[0];
          const binaryResult = await performBinaryAnalysis(file);
          appendOutput(`\n${binaryResult}`);
          break;
          
        case 'dos':
          const dosTarget = args[0];
          const dosResult = await simulateDoS(dosTarget);
          appendOutput(`\n${dosResult}`);
          break;
          
        case 'forensic':
          const evidence = args[0];
          const forensicResult = await simulateForensicAnalysis(evidence);
          appendOutput(`\n${forensicResult}`);
          break;
          
        case 'persona':
          const personaTarget = args.join(' ');
          const personaResult = await simulateAIPersonaGeneration(personaTarget);
          appendOutput(`\n${personaResult}`);
          break;
          
        case 'help':
          const helpText = await getHackerModeHelp();
          appendOutput(`\n${helpText}`);
          break;
          
        case 'clear':
          setHackerOutput('J.A.R.V.I.S. Hacker Interface v1.0.0\n> System initialized\n> Type "help" for commands...');
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
      setActiveCommand(null);
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
      setHackerOutput('J.A.R.V.I.S. Hacker Interface v1.0.0\n> System initialized\n> Type "help" for commands...');
    }
  }, [hackerOutput, setHackerOutput]);

  const handleQuickCommand = (command: string) => {
    if (isProcessing) return;
    setInput(command);
    setTimeout(() => {
      handleCommand(command);
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black/95 text-jarvis overflow-hidden">
      <div className="p-4 border-b border-jarvis/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-jarvis" />
          <span className="font-mono text-lg">J.A.R.V.I.S. HACKER INTERFACE</span>
        </div>
        <div className="flex space-x-2 items-center">
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-jarvis' : 'text-jarvis/40'}`} />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/10"
            onClick={() => onDeactivate && onDeactivate()}
          >
            Deactivate
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 bg-black border-r border-jarvis/20 flex flex-col items-center py-4 space-y-6">
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'scan' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('scan')}
            title="Network Scan"
          >
            <Wifi className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'decrypt' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('decrypt password')}
            title="Decrypt"
          >
            <Lock className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'system' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('system')}
            title="System Status"
          >
            <Server className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'matrix' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('matrix')}
            title="Matrix Effect"
          >
            <Code className="w-5 h-5" />
          </div>
          <div 
            className={`p-2 rounded-md hover:bg-jarvis/10 cursor-pointer ${activeCommand === 'help' ? 'bg-jarvis/10 text-jarvis' : 'text-jarvis/60'}`}
            onClick={() => handleQuickCommand('help')}
            title="Help"
          >
            <Shield className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={terminalRef}
            className="flex-1 p-4 font-mono text-jarvis overflow-auto terminal-window"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(30, 174, 219, 0.03), rgba(30, 174, 219, 0.03) 1px, transparent 1px, transparent 2px)'
            }}
          >
            <pre className="whitespace-pre-wrap">{hackerOutput}</pre>
            <div ref={outputEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-jarvis/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-jarvis" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/70 border-jarvis/30 text-jarvis font-mono focus-visible:ring-jarvis/30"
                placeholder={isProcessing ? "Processing..." : "Type command..."}
                disabled={isProcessing}
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={isProcessing || !input.trim()} 
                variant="outline" 
                className="bg-black/70 border-jarvis/30 text-jarvis hover:bg-jarvis/10"
              >
                Execute
              </Button>
            </div>
          </form>
        </div>
        
        <div className="w-48 border-l border-jarvis/20 bg-black/70 p-3 hidden md:block">
          <div className="text-xs uppercase text-jarvis/50 mb-2 font-mono">Quick Commands</div>
          <div className="space-y-1.5">
            {['scan', 'system', 'phish users', 'darkweb passwords', 'wifi home', 'binary malware.exe', 'help', 'clear'].map((cmd) => (
              <Button
                key={cmd}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
                onClick={() => handleQuickCommand(cmd)}
                disabled={isProcessing}
              >
                {cmd}
              </Button>
            ))}
          </div>
          
          <div className="text-xs uppercase text-jarvis/50 mt-4 mb-2 font-mono">System Status</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-jarvis/60">CPU:</span>
              <span className="text-jarvis">42%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-jarvis/60">RAM:</span>
              <span className="text-jarvis">1.3 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-jarvis/60">Network:</span>
              <span className="text-jarvis">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerMode;
