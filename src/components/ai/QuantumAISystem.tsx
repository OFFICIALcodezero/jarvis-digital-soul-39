
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const QuantumAISystem: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quantumState, setQuantumState] = useState({
    qubits: 8,
    superposition: 'stable',
    algorithmEfficiency: 78,
    lastScan: new Date().toISOString(),
    vulnerabilitiesFound: 3
  });

  useEffect(() => {
    if (processing) {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress(prev => {
            const increment = Math.floor(Math.random() * 10) + 5;
            return Math.min(prev + increment, 100);
          });
        } else {
          setProcessing(false);
          toast('Quantum Scan Complete', {
            description: `Analyzed ${Math.floor(Math.random() * 1000) + 500} potential attack vectors in quantum space.`
          });
          setQuantumState(prev => ({
            ...prev,
            vulnerabilitiesFound: prev.vulnerabilitiesFound + Math.floor(Math.random() * 3),
            lastScan: new Date().toISOString()
          }));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [processing, progress]);

  const handleRunQuantumScan = () => {
    setProcessing(true);
    setProgress(0);
    toast('Quantum Scan Initiated', {
      description: 'Running Grover\'s algorithm on target infrastructure.'
    });
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Quantum AI System (Q.A.S.)</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Active Qubits</div>
            <div className="text-lg text-jarvis">{quantumState.qubits}</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Superposition</div>
            <div className="text-lg text-jarvis">{quantumState.superposition}</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Algorithm Efficiency</div>
            <div className="text-lg text-jarvis">{quantumState.algorithmEfficiency}%</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Vulnerabilities</div>
            <div className="text-lg text-jarvis">{quantumState.vulnerabilitiesFound}</div>
          </div>
        </div>
        
        {processing && (
          <div className="space-y-2">
            <div className="text-xs text-jarvis">Running Quantum Scan</div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-400 text-right">{progress}%</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Last scan: {new Date(quantumState.lastScan).toLocaleString()}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRunQuantumScan}
            disabled={processing}
            className="text-jarvis border-jarvis/30 hover:bg-jarvis/10"
          >
            Run Quantum Scan
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuantumAISystem;
