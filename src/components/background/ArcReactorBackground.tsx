
import React from 'react';

const ArcReactorBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1]">
      <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] animate-spin-slow opacity-20">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[40px] border-[#33C3F0]/20 rounded-full" />
        
        {/* Inner Rings */}
        <div className="absolute inset-[80px] border-[20px] border-[#33C3F0]/30 rounded-full animate-pulse" />
        <div className="absolute inset-[120px] border-[10px] border-[#33C3F0]/40 rounded-full animate-spin-reverse" />
        
        {/* Core */}
        <div className="absolute inset-[160px] bg-gradient-to-r from-[#33C3F0]/50 to-[#1EAEDB]/50 rounded-full animate-pulse">
          {/* Inner Core Elements */}
          <div className="absolute inset-[40px] border-[15px] border-[#33C3F0]/60 rounded-full" />
          <div className="absolute inset-[80px] bg-[#33C3F0]/70 rounded-full shadow-[0_0_60px_#33C3F0]" />
        </div>

        {/* Decorative Lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#33C3F0]/0 to-[#33C3F0]/30"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '0 50%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArcReactorBackground;
