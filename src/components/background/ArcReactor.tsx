
import React from 'react';

const ArcReactor: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-[800px] h-[800px] opacity-10">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-[#33c3f0]/30 animate-spin-slow"></div>
        
        {/* Middle ring with glow */}
        <div className="absolute inset-[15%] rounded-full border-4 border-[#1eaedb]/40 animate-pulse backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1eaedb]/5 to-[#33c3f0]/5"></div>
        </div>
        
        {/* Inner core */}
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-r from-[#1eaedb]/20 to-[#33c3f0]/20 animate-pulse">
          <div className="absolute inset-[20%] rounded-full bg-[#1eaedb]/10 animate-glow-strong"></div>
        </div>
        
        {/* Energy particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#33c3f0]/30 rounded-full animate-float"
              style={{
                left: `${50 + Math.cos(i * Math.PI / 6) * 45}%`,
                top: `${50 + Math.sin(i * Math.PI / 6) * 45}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArcReactor;
