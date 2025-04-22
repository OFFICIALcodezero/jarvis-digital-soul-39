
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const STARTUP_STEPS = [
  { text: "> Initializing JARVIS systems...", delay: 500 },
  { text: "> Loading neural network framework...", delay: 600 },
  { text: "> Connecting to satellite network...", delay: 700 },
  { text: "> Calibrating quantum processors...", delay: 400 },
  { text: "> Initializing voice interface...", delay: 600 },
  { text: "> Activating holographic matrix...", delay: 800 },
  { text: "> Running security protocols...", delay: 700 },
  { text: "> Synchronizing global data feeds...", delay: 500 },
  { text: "> Activating response algorithms...", delay: 400 },
  { text: "> Starting core reactor...", delay: 600 },
  { text: "> SYSTEM ONLINE", delay: 1000 },
  { text: "> WELCOME BACK, COMMANDER.", delay: 1000 },
];

const MatrixRain = () => {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute top-0 text-jarvis text-xs font-mono animate-matrix-fall"
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
  const [showPulse, setShowPulse] = useState(false);
  const navigate = useNavigate();

  const processNextStep = useCallback(() => {
    if (currentStepIndex < STARTUP_STEPS.length) {
      const step = STARTUP_STEPS[currentStepIndex];
      setDisplayedSteps(prev => [...prev, step.text]);
      setCurrentStepIndex(prevIndex => prevIndex + 1);
      
      // Show the reactor core pulse when we reach "Starting core reactor"
      if (step.text.includes("Starting core reactor")) {
        setShowPulse(true);
      }
      
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

  // Play startup sound
  useEffect(() => {
    // Create an audio element for startup sound
    const audio = new Audio();
    audio.volume = 0.3;
    
    // This would be replaced with an actual sound file
    try {
      // Try to use AudioContext to create a synthesized startup sound
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2);
      }
    } catch (error) {
      console.error("Could not play synthesized startup sound:", error);
    }
  }, []);

  return (
    <div className="bg-midnight text-jarvis h-screen w-screen flex flex-col justify-start items-start overflow-hidden font-mono relative">
      <MatrixRain />
      
      {/* Core reactor pulse - when activated */}
      {showPulse && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-20 h-20 rounded-full bg-jarvis/20 animate-ping-slow"></div>
          <div className="absolute inset-0 w-10 h-10 mt-5 ml-5 rounded-full bg-jarvis/40 animate-pulse"></div>
        </div>
      )}
      
      <div className="z-10 p-8 w-full max-w-4xl mx-auto mt-16 relative">
        {displayedSteps.map((step, index) => (
          <div 
            key={index} 
            className={`text-lg md:text-xl ${
              step.includes("SYSTEM ONLINE") ? "text-2xl font-bold text-jarvisLight mt-4" : 
              step.includes("WELCOME") ? "text-2xl font-bold text-jarvisLight" : ""
            } ${Math.random() > 0.9 ? "animate-text-glitch" : ""}`}
          >
            {step}
          </div>
        ))}
        {!isStartupComplete && <div className="h-4 w-3 bg-jarvis ml-1 animate-blink inline-block"></div>}
      </div>
      
      <div className={`absolute inset-0 bg-jarvis opacity-0 transition-opacity duration-500 z-20 ${isStartupComplete ? "animate-flash" : ""}`}></div>
    </div>
  );
};

export default StartupSequence;
