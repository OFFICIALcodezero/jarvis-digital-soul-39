import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JarvisChatMainEnhanced from './JarvisChatMainEnhanced';

// This component is responsible for enhancing the Jarvis interface
// by replacing the standard chat with our enhanced version that includes
// additional hacker tools
const JarvisModeEnhancer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the main Jarvis interface
  const isJarvisInterface = location.pathname === '/jarvis';

  // If we're on the Jarvis interface, return our enhanced version
  if (isJarvisInterface) {
    return (
      <div className="flex flex-col h-full">
        <JarvisChatMainEnhanced />
      </div>
    );
  }

  // Otherwise, return the children as is
  return <>{children}</>;
};

export default JarvisModeEnhancer;
