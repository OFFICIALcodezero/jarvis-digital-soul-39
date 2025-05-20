import React from 'react';

interface JarvisCoreProps {
  isActive?: boolean;
}

const JarvisCore: React.FC<JarvisCoreProps> = ({ isActive = false }) => {
  // The existing JarvisCore implementation would be here
  return (
    <div className="jarvis-core">
      {/* Core visualization */}
      <div className={`core-circle ${isActive ? 'active' : 'inactive'}`}>
        <div className="inner-circle"></div>
      </div>
    </div>
  );
};

export default JarvisCore;
