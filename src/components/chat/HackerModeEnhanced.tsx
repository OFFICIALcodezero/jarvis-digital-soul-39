
import React, { useEffect, useState } from 'react';
import { hackerModeLines } from '../../services/hackerModeService';
import HackingTools from './HackingTools';

interface HackerModeProps {
  isActive: boolean;
}

const HackerModeEnhanced: React.FC<HackerModeProps> = ({ isActive }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setLines([]);
      setShowTools(false);
      return;
    }

    // Display hacker text first, then show tools
    const addLines = async () => {
      const newLines: string[] = [];
      
      for (const line of hackerModeLines) {
        newLines.push(line);
        setLines([...newLines]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      
      // Add additional lines for tools initialization
      const toolInitLines = [
        ">> INITIALIZING ADVANCED HACKING SUITE",
        ">> LOADING MODULES...",
        ">> NETWORK SCANNER: READY",
        ">> VULNERABILITY SCANNER: READY",
        ">> PASSWORD CRACKER: READY",
        ">> DATABASE BREACHER: READY",
        ">> FIREWALL BYPASS: READY",
        ">> REVERSE SHELL: READY",
        ">> ADVANCED HACKING SUITE LOADED",
        ">> EXECUTE? [Y/N]",
        ">> Y",
        ">> EXECUTING..."
      ];
      
      for (const line of toolInitLines) {
        newLines.push(line);
        setLines([...newLines]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      // Show tools after text animation completes
      setShowTools(true);
    };

    addLines();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="font-mono text-xs text-green-400 bg-black/80 p-4 rounded-md border border-green-500/30 overflow-auto max-h-[600px] animate-fade-in">
      <div className="mb-4">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <HackingTools active={showTools} />
    </div>
  );
};

export default HackerModeEnhanced;
