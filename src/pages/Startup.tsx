
import React, { useEffect } from 'react';
import StartupSequence from '../components/StartupSequence';

const Startup: React.FC = () => {
  useEffect(() => {
    // Preload the interface page
    const preloadInterface = new Image();
    preloadInterface.src = '/assets/circuit-pattern.png';
  }, []);

  return <StartupSequence />;
};

export default Startup;
