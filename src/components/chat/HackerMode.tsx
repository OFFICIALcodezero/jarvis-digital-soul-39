
import React from 'react';

export interface HackerModeProps {
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
}

const HackerMode: React.FC<HackerModeProps> = ({ hackerOutput, setHackerOutput }) => {
  return (
    <div className="jarvis-panel flex-1 bg-black/20 overflow-auto font-mono text-jarvis p-4">
      <pre className="whitespace-pre-wrap">{hackerOutput || "// JARVIS Hacker Mode initialized.\n// Ready for command input..."}</pre>
    </div>
  );
};

export default HackerMode;
