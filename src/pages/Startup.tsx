
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StartupSequence from '@/components/StartupSequence';
import { AnimatedGradientBg } from '@/components/ui/animated-gradient-bg';
import { GradientText, ShimmeringText, TypewriterText } from '@/components/ui/animated-text';
import { FloatingParticles } from '@/components/ui/floating-particle';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Startup = () => {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  
  // Simulate loading progress
  useEffect(() => {
    // Progress steps
    const steps = [
      { progress: 15, delay: 600, text: "Initializing core systems..." },
      { progress: 35, delay: 1000, text: "Loading neural networks..." },
      { progress: 60, delay: 1200, text: "Calibrating voice synthesis..." },
      { progress: 85, delay: 800, text: "Establishing secure connections..." },
      { progress: 98, delay: 900, text: "Preparing user interface..." },
      { progress: 100, delay: 500, text: "Systems ready." },
    ];
    
    // Simulate loading
    let currentStep = 0;
    
    const simulateLoading = () => {
      if (currentStep >= steps.length) {
        // Loading complete
        setTimeout(() => {
          setShowEnter(true);
        }, 800);
        return;
      }
      
      const step = steps[currentStep];
      setLoadingProgress(step.progress);
      setLoadingStep(currentStep);
      
      currentStep += 1;
      setTimeout(simulateLoading, step.delay);
    };
    
    // Start the loading simulation
    setTimeout(simulateLoading, 200);
  }, []);
  
  // Automatically redirect after loading
  useEffect(() => {
    if (loadingProgress === 100) {
      const timer = setTimeout(() => {
        navigate('/interface');
      }, 5000); // Auto redirect after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, navigate]);
  
  // Loading steps text
  const loadingTexts = [
    "Initializing core systems...",
    "Loading neural networks...",
    "Calibrating voice synthesis...",
    "Establishing secure connections...",
    "Preparing user interface...",
    "Systems ready."
  ];
  
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-jarvis-deep to-jarvis-midnight">
      <FloatingParticles className="opacity-60" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-purple-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-circuit bg-no-repeat bg-center opacity-10"></div>
      
      {/* Loading container */}
      <motion.div 
        className="relative z-10 w-full max-w-2xl px-6 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-jarvis-purple/20 rounded-full flex items-center justify-center shadow-purple-glow">
              <div className="w-16 h-16 bg-jarvis-purple/30 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-jarvis-purple/80 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-wider">
              <ShimmeringText text="J.A.R.V.I.S" />
            </h1>
            <p className="text-jarvis-purple text-lg">
              Just A Rather Very Intelligent System
            </p>
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 w-full bg-black/20 rounded overflow-hidden">
            <motion.div 
              className="h-full bg-jarvis-purple rounded" 
              style={{ boxShadow: '0 0 10px rgba(155, 135, 245, 0.7)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          
          <div className="mt-4 font-mono text-sm text-jarvis-purple">
            {loadingStep < loadingTexts.length && (
              <TypewriterText text={loadingTexts[loadingStep]} className="min-h-6" />
            )}
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Badge variant="purple" className="animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
            Neural Network Active
          </Badge>
          <Badge variant="purple">Voice Recognition Online</Badge>
          <Badge variant="purple">Security Protocol <span className="text-xs">STARK-117</span></Badge>
          <Badge variant="outline" className="border-jarvis-purple/30 text-jarvis-purple">
            Version 2.0.4
          </Badge>
        </div>
        
        {/* Enter button */}
        {showEnter && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={() => navigate('/interface')}
              className="px-8 py-3 bg-gradient-to-r from-jarvis-purple to-purple-600 rounded-lg text-white font-medium shadow-purple-glow transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Enter System
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Startup;
