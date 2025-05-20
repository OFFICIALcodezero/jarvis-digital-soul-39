
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';

const StartupSequence = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing systems');
  const [logs, setLogs] = useState<string[]>([]);
  const { user, isLoading } = useAuth();
  
  const bootSequence = [
    { phase: 'Initializing systems', duration: 2000, logs: [
      'Booting core systems',
      'Loading essential modules',
      'Establishing internal connections'
    ]},
    { phase: 'Loading neural networks', duration: 3000, logs: [
      'Activating primary neural pathways',
      'Loading linguistic processing units',
      'Initializing cognitive functions'
    ]},
    { phase: 'Running security protocols', duration: 2500, logs: [
      'Scanning for vulnerabilities',
      'Establishing secure communication channels',
      'Verifying system integrity'
    ]},
    { phase: 'Activating voice systems', duration: 2000, logs: [
      'Calibrating audio output modules',
      'Initializing speech recognition',
      'Loading voice patterns'
    ]},
    { phase: 'Establishing connections', duration: 1500, logs: [
      'Connecting to network services',
      'Establishing data feeds',
      'Loading external APIs'
    ]},
    { phase: 'JARVIS core activation', duration: 3000, logs: [
      'Final systems check',
      'Core system coming online',
      'Ready to assist'
    ]}
  ];

  useEffect(() => {
    if (user) {
      // Add personalized logs if user is signed in
      setLogs(prev => [...prev, `Welcome back, ${user.displayName || 'User'}`]);
    }
  }, [user]);
  
  useEffect(() => {
    let currentIndex = 0;
    let progressInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    
    const startSequence = () => {
      const totalDuration = bootSequence.reduce((total, phase) => total + phase.duration, 0);
      const incrementPerMs = 100 / totalDuration;
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + incrementPerMs * 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 10);
      
      const runPhase = (index: number) => {
        if (index >= bootSequence.length) {
          clearInterval(progressInterval);
          setTimeout(() => navigate('/interface'), 1000);
          return;
        }
        
        const phase = bootSequence[index];
        setCurrentPhase(phase.phase);
        
        // Add logs with delays
        phase.logs.forEach((log, logIndex) => {
          setTimeout(() => {
            setLogs(prev => [...prev, log]);
          }, logIndex * (phase.duration / phase.logs.length));
        });
        
        phaseTimeout = setTimeout(() => runPhase(index + 1), phase.duration);
      };
      
      runPhase(0);
    };
    
    startSequence();
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1019] to-[#121624] text-white p-4">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 neon-purple-text animate-pulse-subtle">JARVIS</h1>
          <p className="text-[#8a8a9b]">Just A Rather Very Intelligent System</p>
          
          {/* Login Button */}
          {!isLoading && (
            <div className="mt-4">
              {user ? (
                <div className="text-jarvis">Signed in as {user.displayName || user.email}</div>
              ) : (
                <GoogleSignInButton variant="default" size="md" />
              )}
            </div>
          )}
        </div>
        
        <div className="w-full glass-morphism neon-purple-border p-6 rounded-2xl mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold neon-purple-text mb-2">{currentPhase}</h2>
            <Progress value={progress} className="h-2 bg-black/50" />
            <p className="text-right text-sm text-[#8a8a9b] mt-1">{Math.round(progress)}%</p>
          </div>
          
          <div className="font-mono text-sm text-[#d6d6ff] bg-black/50 p-4 rounded-lg h-48 overflow-auto neon-purple-border">
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="flex">
                  <span className="neon-purple-text mr-2">&gt;</span>
                  <span className={index === logs.length - 1 ? 'typing-indicator' : ''}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-4">
          <div className="h-4 w-4 rounded-full bg-[#8B5CF6] animate-pulse"></div>
          <p className="text-[#d6d6ff]">Please wait while JARVIS initializes...</p>
        </div>
      </div>
    </div>
  );
};

export default StartupSequence;
