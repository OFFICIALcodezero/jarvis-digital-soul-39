
import React from 'react';
import ArcReactor from '@/components/background/ArcReactor';

interface JarvisBackgroundProps {
  hackerModeActive: boolean;
}

const JarvisBackground: React.FC<JarvisBackgroundProps> = ({ hackerModeActive }) => {
  return (
    <>
      {/* Apply hacker background effects if in hacker mode */}
      {hackerModeActive && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 hacker-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10"></div>
        </div>
      )}
      
      <ArcReactor />
      
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${hackerModeActive ? 'from-red-900/10' : 'from-[#1eaedb]/10'} to-transparent z-0`}></div>
    </>
  );
};

export default JarvisBackground;
