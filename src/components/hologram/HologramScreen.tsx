
import React, { useState, useRef, useEffect } from 'react';
import P5Sketch from './P5Sketch';
import ThreeScene from './ThreeScene';
import { X } from 'lucide-react';
import HologramEffect from '@/components/ui/hologram-effect';
import JarvisVisualizer from '@/components/JarvisVisualizer';

interface HologramScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const HologramScreen: React.FC<HologramScreenProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'p5' | 'three'>('p5');
  const containerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Show introduction animation when opened
  useEffect(() => {
    if (isOpen) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
      {showIntro ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <HologramEffect>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-wider mb-4">JARVIS HOLOGRAM</h1>
              <div className="text-xl">Initializing Interface...</div>
              <JarvisVisualizer className="mt-6" />
            </div>
          </HologramEffect>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-4 border-b border-jarvis/30 bg-black/40">
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
          
          <div className="flex-1 overflow-hidden relative" ref={containerRef}>
            <div className="absolute inset-0">
              {activeTab === 'p5' ? (
                <P5Sketch />
              ) : (
                <ThreeScene />
              )}
            </div>
            
            {/* Overlay hologram effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Scan lines */}
              <div className="absolute inset-0 bg-scan-lines"></div>
              
              {/* Edge glow */}
              <div className="absolute inset-0 border border-jarvis/30" 
                   style={{ boxShadow: 'inset 0 0 20px rgba(51, 195, 240, 0.3)' }}>
              </div>
              
              {/* Corner elements for HUD feel */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-jarvis/50"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-jarvis/50"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-jarvis/50"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-jarvis/50"></div>
              
              {/* Status indicators */}
              <div className="absolute bottom-4 left-4">
                <JarvisVisualizer isActive={true} amplitude={10} className="w-40" />
              </div>
              
              {/* Coordinates display */}
              <div className="absolute top-4 right-4 text-xs text-jarvis font-mono flex flex-col items-end">
                <div>COORDINATES: 34.05°N / 118.25°W</div>
                <div className="mt-1">SYSTEM: OPERATIONAL</div>
                <div className="mt-1">RENDER ENGINE: {activeTab === 'p5' ? 'P5.JS' : 'THREE.JS'}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HologramScreen;
