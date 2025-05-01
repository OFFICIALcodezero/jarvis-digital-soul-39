
import { useState, useEffect } from 'react';

export const useHackerMode = (activationCode: string = 'code zero') => {
  const [isHackerModeActive, setIsHackerModeActive] = useState(false);

  const checkForHackerMode = (message: string) => {
    if (message.toLowerCase().includes(activationCode.toLowerCase())) {
      setIsHackerModeActive(true);
      return true;
    }
    return false;
  };

  const deactivateHackerMode = () => {
    setIsHackerModeActive(false);
  };

  return {
    isHackerModeActive,
    checkForHackerMode,
    deactivateHackerMode
  };
};

export default useHackerMode;
