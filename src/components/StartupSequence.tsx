
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const STARTUP_STEPS = [
  { text: "> Initializing core systems...", delay: 500 },
  { text: "> Loading neural framework...", delay: 600 },
  { text: "> Connecting to satellite network...", delay: 700 },
  { text: "> Activating quantum processors...", delay: 400 },
  { text: "> Initializing Voice Engine...", delay: 600 },
  { text: "> Activating Vision Matrix...", delay: 800 },
  { text: "> Decrypting Access Protocols...", delay: 700 },
  { text: "> Synchronizing global data feeds...", delay: 500 },
  { text: "> Calibrating response algorithms...", delay: 400 },
  { text: "> SYSTEM ONLINE", delay: 1000 },
  { text: "> WELCOME, COMMANDER.", delay: 1000 },
];

const MatrixRain = () => {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute top-0 text-cyan-400 text-xs font-mono animate-matrix-fall"
          style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="my-1">
              {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const StartupSequence: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedSteps, setDisplayedSteps] = useState<string[]>([]);
  const [isStartupComplete, setIsStartupComplete] = useState(false);
  const navigate = useNavigate();

  const processNextStep = useCallback(() => {
    if (currentStepIndex < STARTUP_STEPS.length) {
      const step = STARTUP_STEPS[currentStepIndex];
      setDisplayedSteps(prev => [...prev, step.text]);
      setCurrentStepIndex(prevIndex => prevIndex + 1);
      
      if (currentStepIndex === STARTUP_STEPS.length - 1) {
        setTimeout(() => {
          setIsStartupComplete(true);
          setTimeout(() => {
            navigate('/interface');
          }, 1500);
        }, step.delay);
      }
    }
  }, [currentStepIndex, navigate]);

  useEffect(() => {
    if (currentStepIndex < STARTUP_STEPS.length) {
      const timer = setTimeout(
        processNextStep,
        STARTUP_STEPS[currentStepIndex]?.delay || 500
      );
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, processNextStep]);

  return (
    <div className="bg-black text-cyan-400 h-screen w-screen flex flex-col justify-start items-start overflow-hidden font-mono relative">
      <MatrixRain />
      <div className="z-10 p-8 w-full max-w-4xl mx-auto mt-16 relative">
        {displayedSteps.map((step, index) => (
          <div 
            key={index} 
            className={`text-lg md:text-xl ${
              step.includes("SYSTEM ONLINE") ? "text-2xl font-bold text-cyan-300 mt-4" : 
              step.includes("WELCOME") ? "text-2xl font-bold text-cyan-300" : ""
            } ${Math.random() > 0.9 ? "animate-text-glitch" : ""}`}
          >
            {step}
          </div>
        ))}
        {!isStartupComplete && <div className="h-4 w-3 bg-cyan-400 ml-1 animate-blink inline-block"></div>}
      </div>
      
      <div className={`absolute inset-0 bg-cyan-400 opacity-0 transition-opacity duration-500 z-20 ${isStartupComplete ? "animate-flash" : ""}`}></div>
    </div>
  );
};

export default StartupSequence;
