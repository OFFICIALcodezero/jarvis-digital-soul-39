
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Atom, Terminal, Maximize2, Box, Code } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface QuantumState {
  qubits: number;
  coherence: number;
  entanglement: number;
  algorithmComplexity: number;
  computations: number[];
}

const QuantumAISystem: React.FC = () => {
  const [quantum, setQuantum] = useState<QuantumState>({
    qubits: 16,
    coherence: 87,
    entanglement: 64,
    algorithmComplexity: 55,
    computations: []
  });
  
  const [isComputing, setIsComputing] = useState(false);
  const [computeProgress, setComputeProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulate occasional quantum fluctuations
  useEffect(() => {
    const fluctuationInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isComputing) {
        setQuantum(prev => ({
          ...prev,
          coherence: Math.min(100, Math.max(50, prev.coherence + (Math.random() * 6 - 3))),
          entanglement: Math.min(100, Math.max(40, prev.entanglement + (Math.random() * 4 - 2)))
        }));
      }
    }, 5000);
    
    return () => clearInterval(fluctuationInterval);
  }, [isComputing]);
  
  const initiateQuantumComputation = () => {
    if (isComputing) return;
    
    setIsComputing(true);
    setComputeProgress(0);
    
    const duration = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      
      setComputeProgress(progress);
      
      if (now < endTime) {
        requestAnimationFrame(updateProgress);
      } else {
        completeComputation();
      }
    };
    
    requestAnimationFrame(updateProgress);
  };
  
  const completeComputation = () => {
    // Generate a random computation result
    const result = Math.floor(Math.random() * 1000000);
    
    setQuantum(prev => ({
      ...prev,
      computations: [result, ...prev.computations].slice(0, 5),
      qubits: Math.min(256, prev.qubits + (Math.random() > 0.7 ? 1 : 0)),
      algorithmComplexity: Math.min(100, prev.algorithmComplexity + (Math.random() * 5))
    }));
    
    setIsComputing(false);
    setComputeProgress(100);
    
    toast('Quantum Computation Complete', {
      description: `Result: ${result} | Complexity factor: ${(Math.random() * 5 + 7).toFixed(2)}`
    });
  };
  
  return (
    <Card className={`border-jarvis/30 bg-black/20 ${isExpanded ? 'col-span-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Atom className="mr-2 h-4 w-4" /> Quantum AI System
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-jarvis/10">
              {quantum.qubits} qubits
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quantum State Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Quantum Coherence</span>
              <span className="text-jarvis">{quantum.coherence}%</span>
            </div>
            <Progress value={quantum.coherence} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Entanglement</span>
              <span className="text-jarvis">{quantum.entanglement}%</span>
            </div>
            <Progress value={quantum.entanglement} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Algorithm Complexity</span>
              <span className="text-jarvis">{Math.round(quantum.algorithmComplexity)}%</span>
            </div>
            <Progress value={quantum.algorithmComplexity} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Computation Progress</span>
              <span className="text-jarvis">{Math.round(computeProgress)}%</span>
            </div>
            <Progress value={computeProgress} className="h-2" />
          </div>
        </div>
        
        {/* Computation Controls */}
        <Button 
          onClick={initiateQuantumComputation} 
          disabled={isComputing}
          className="w-full bg-gradient-to-r from-blue-600 to-jarvis hover:from-blue-700 hover:to-jarvis/90"
        >
          {isComputing ? 'Computing...' : 'Initiate Quantum Computation'}
        </Button>
        
        {/* Computation Results */}
        {quantum.computations.length > 0 && (
          <div className="bg-black/40 p-3 rounded-lg border border-jarvis/20">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-3.5 w-3.5 text-jarvis" />
              <h4 className="text-xs font-medium">Computation Results</h4>
            </div>
            <div className="space-y-1 max-h-28 overflow-auto">
              {quantum.computations.map((result, index) => (
                <div key={index} className="text-xs font-mono bg-black/30 p-1.5 rounded flex items-start">
                  <Code className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-blue-400" />
                  <div>
                    <span className="text-blue-400">QResult_{index}: </span>
                    <span>{result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Status Indicators */}
        <div className="flex justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Box className="h-3 w-3 mr-1" />
            <span>Quantum Core: Active</span>
          </div>
          {isComputing && (
            <span className="animate-pulse text-jarvis">
              Processing...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumAISystem;
