
import React from 'react';

const ArcReactor: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#33C3F0]/5 blur-[100px]"></div>
        
        {/* Middle glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#33C3F0]/10 blur-[50px]"></div>
        
        {/* Inner rings */}
        <div className="relative w-[150px] h-[150px] flex items-center justify-center">
          {/* Spinning outer ring */}
          <div className="absolute w-full h-full rounded-full border-2 border-[#33C3F0]/30 animate-spin-slow"></div>
          
          {/* Middle ring */}
          <div className="absolute w-[120px] h-[120px] rounded-full border border-[#33C3F0]/40"></div>
          
          {/* Inner ring */}
          <div className="absolute w-[90px] h-[90px] rounded-full border border-[#33C3F0]/50"></div>
          
          {/* Core */}
          <div className="absolute w-[60px] h-[60px] rounded-full bg-[#33C3F0]/20 reactor-glow">
            <div className="absolute inset-[15px] rounded-full bg-[#33C3F0]/30"></div>
            <div className="absolute inset-[25px] rounded-full bg-white/90"></div>
          </div>
        </div>
        
        {/* Pulsing particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#33C3F0]/70 rounded-full"
            style={{
              top: `${Math.sin(i * Math.PI / 4) * 100 + 150}px`,
              left: `${Math.cos(i * Math.PI / 4) * 100 + 150}px`,
              animation: `pulse-reactor ${1 + i * 0.2}s infinite ease-in-out ${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ArcReactor;
