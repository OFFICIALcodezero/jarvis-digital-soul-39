
import React, { useState, useRef, useEffect } from 'react';
import P5Sketch from './P5Sketch';
import ThreeScene from './ThreeScene';
import { X } from 'lucide-react';

interface HologramScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const HologramScreen: React.FC<HologramScreenProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'p5' | 'three'>('p5');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-jarvis/30">
        <h2 className="text-xl font-semibold text-jarvis">JARVIS Hologram Interface</h2>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg overflow-hidden border border-jarvis/30">
            <button 
              onClick={() => setActiveTab('p5')}
              className={`px-4 py-2 ${activeTab === 'p5' ? 'bg-jarvis/20 text-jarvis' : 'bg-black/40 text-gray-400'}`}
            >
              P5.js
            </button>
            <button 
              onClick={() => setActiveTab('three')}
              className={`px-4 py-2 ${activeTab === 'three' ? 'bg-jarvis/20 text-jarvis' : 'bg-black/40 text-gray-400'}`}
            >
              Three.js
            </button>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-black/40"
            aria-label="Close hologram"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'p5' ? (
          <P5Sketch />
        ) : (
          <ThreeScene />
        )}
      </div>
    </div>
  );
};

export default HologramScreen;
