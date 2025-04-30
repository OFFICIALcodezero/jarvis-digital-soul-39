
import React from 'react';

const IronManBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center z-0">
      <div className="w-full h-full flex items-center justify-center relative">
        <img 
          src="/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png" 
          alt="Iron Man" 
          className="w-full h-full object-contain"
          style={{
            maxHeight: '95vh',
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
