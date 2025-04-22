
import React, { useState, useEffect } from 'react';
import { generateAssistantResponse } from '@/services/aiAssistantService';
import { Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

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
      const messages = [{ role: 'user' as const, content: command }];
      const response = await generateAssistantResponse(
        command,
        messages,
        'jarvis',
        'en'
      );
      
      appendOutput(`\n${response}`);
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
            placeholder={isProcessing ? "Processing..." : "Enter command..."}
            disabled={isProcessing}
          />
        </div>
      </form>
    </div>
  );
};

export default HackerMode;
