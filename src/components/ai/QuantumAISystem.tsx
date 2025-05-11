
import React, { useState, useEffect } from 'react';
import { Atom, Search, Database, Sparkles } from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

const QuantumAISystem: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string | null>(null);
  const [algorithmProgress, setAlgorithmProgress] = useState(0);
  const [results, setResults] = useState<any | null>(null);
  
  useEffect(() => {
    const quantumState = enhancedAIService.getEntityState('quantum');
    if (quantumState) {
      setIsActive(quantumState.active);
    }
  }, []);
  
  const activateQuantumAI = () => {
    const success = enhancedAIService.activateEntity('quantum');
    if (success) {
      setIsActive(true);
    }
  };
  
  const runAlgorithm = async (algorithm: string) => {
    setCurrentAlgorithm(algorithm);
    setAlgorithmProgress(0);
    setResults(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setAlgorithmProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const result = await enhancedAIService.runQuantumAlgorithm(
        algorithm,
        { size: 'large', complexity: 'high' }
      );
      
      setResults(result);
      toast('Quantum Algorithm Complete', {
        description: `${algorithm} executed successfully`
      });
    } catch (error) {
      toast('Algorithm Error', {
        description: `Failed to execute ${algorithm}`,
        variant: 'destructive'
      });
    }
  };
  
  const quantumState = enhancedAIService.getEntityState('quantum');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-jarvis">
          <Atom className="h-5 w-5" />
          <span className="font-semibold">Quantum AI System</span>
        </div>
        
        <div>
          {!isActive ? (
            <Button 
              size="sm" 
              onClick={activateQuantumAI}
              className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
            >
              Activate
            </Button>
          ) : (
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Active
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div 
              className="bg-black/30 p-3 rounded-md border border-jarvis/20 cursor-pointer hover:bg-black/40 transition-colors"
              onClick={() => runAlgorithm("Grover's Search Algorithm")}
            >
              <div className="flex items-center gap-2 mb-1">
                <Search className="h-4 w-4 text-jarvis" />
                <span className="text-sm">Grover's Search Algorithm</span>
              </div>
              <p className="text-xs text-gray-400">Quantum search algorithm with quadratic speedup</p>
            </div>
            
            <div 
              className="bg-black/30 p-3 rounded-md border border-jarvis/20 cursor-pointer hover:bg-black/40 transition-colors"
              onClick={() => runAlgorithm("Shor's Factoring Algorithm")}
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-jarvis" />
                <span className="text-sm">Shor's Factoring Algorithm</span>
              </div>
              <p className="text-xs text-gray-400">Quantum integer factorization algorithm</p>
            </div>
            
            <div 
              className="bg-black/30 p-3 rounded-md border border-jarvis/20 cursor-pointer hover:bg-black/40 transition-colors"
              onClick={() => runAlgorithm("Quantum Neural Network")}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-jarvis" />
                <span className="text-sm">Quantum Neural Network</span>
              </div>
              <p className="text-xs text-gray-400">AI-enhanced quantum pattern recognition</p>
            </div>
          </div>
          
          {currentAlgorithm && (
            <div className="mt-4 bg-black/20 p-3 rounded-md border border-jarvis/10">
              <div className="text-sm mb-2">Executing: {currentAlgorithm}</div>
              <Progress value={algorithmProgress} className="h-1 bg-black/50" />
              
              {algorithmProgress === 100 && results && (
                <div className="mt-3 text-green-400 text-xs font-mono">
                  <div>Result: {results.result}</div>
                  <div>Speed: {results.processingSpeed}</div>
                  <div>Accuracy: {results.accuracyImprovement}</div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <div>Version {quantumState?.version}</div>
            <div className="mx-2">•</div>
            <div>Development Progress: {quantumState?.progress}%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuantumAISystem;
