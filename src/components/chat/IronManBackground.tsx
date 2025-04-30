
import React from 'react';

interface IronManBackgroundProps {
  isGlowing?: boolean;
}

const IronManBackground: React.FC<IronManBackgroundProps> = ({ isGlowing }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className={`w-full h-full ${isGlowing ? 'animate-pulse' : ''}`}>
        <img 
          src="/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png" 
          alt="Iron Man" 
          className={`w-full h-full object-contain ${isGlowing ? 'ironman-glow' : ''}`}
          style={{
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            zIndex: 0
          }}
        />
      </div>
    </div>
  );
};

export default IronManBackground;
