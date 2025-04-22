
import React from 'react';
import { ToggleLeft, ToggleRight, User, Users, Cpu } from 'lucide-react';

interface ControlOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

interface ControlPanelProps {
  options: ControlOption[];
  onToggle: (id: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ options, onToggle }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onToggle(option.id)}
          className={`
            group relative flex flex-col items-center justify-center 
            w-20 h-20 md:w-24 md:h-24 rounded-lg p-2
            transition-all duration-300 hover:scale-105
            border border-cyan-500/30 backdrop-blur-sm
            ${option.active 
              ? 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_15px_rgba(30,174,219,0.3)]' 
              : 'bg-slate-800/50 text-slate-400'
            }
          `}
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex items-center justify-center h-10">
            {option.icon}
          </div>
          
          <div className="mt-2 text-xs text-center">
            {option.label}
          </div>
          
          <div className="absolute bottom-2 right-2">
            {option.active ? (
              <ToggleRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ControlPanel;
