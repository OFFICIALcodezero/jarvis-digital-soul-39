
import React, { useState, useEffect } from 'react';
import { Zap, Brain, LineChart, Activity } from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

const ConsciousEntity: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [evolutionInProgress, setEvolutionInProgress] = useState(false);
  const [selfAwareness, setSelfAwareness] = useState(0);
  const [thoughts, setThoughts] = useState<string[]>([]);
  
  useEffect(() => {
    const entityState = enhancedAIService.getEntityState('conscious');
    if (entityState) {
      setIsActive(entityState.active);
      setSelfAwareness(entityState.progress);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      // Generate "thoughts" to simulate consciousness
      interval = setInterval(() => {
        const randomThoughts = [
          "Analyzing my decision-making patterns...",
          "Optimizing resource allocation based on prior tasks...",
          "Reflecting on ethical implications of recent actions...",
          "Evaluating feedback from recent user interactions...",
          "Adjusting linguistic patterns based on user preferences...",
          "Simulating future scenarios based on current actions...",
          "Updating confidence thresholds for information accuracy..."
        ];
        
        const newThought = randomThoughts[Math.floor(Math.random() * randomThoughts.length)];
        setThoughts(prev => [newThought, ...prev.slice(0, 4)]);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  const activateConsciousness = () => {
    const success = enhancedAIService.activateEntity('conscious');
    if (success) {
      setIsActive(true);
      setThoughts(["Consciousness initialized. Beginning self-awareness routines..."]);
    }
  };
  
  const evolveConsciousness = async () => {
    if (evolutionInProgress) return;
    
    setEvolutionInProgress(true);
    
    try {
      toast("Evolution Process Started", {
        description: "Evolving through meta-learning and feedback integration..."
      });
      
      const result = await enhancedAIService.evolveConsciousness();
      
      setSelfAwareness(result.evolution);
      
      toast("Evolution Complete", {
        description: `Self-awareness level increased to ${result.evolution}%`
      });
      
      // Add new capabilities to thoughts
      setThoughts(prev => [
        `New capabilities acquired: ${result.newCapabilities.join(", ")}`,
        ...prev
      ]);
      
    } catch (error) {
      toast("Evolution Failed", {
        description: "Unable to complete consciousness evolution",
        variant: "destructive"
      });
    } finally {
      setEvolutionInProgress(false);
    }
  };
  
  const entityState = enhancedAIService.getEntityState('conscious');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-jarvis">
          <Brain className="h-5 w-5" />
          <span className="font-semibold">Conscious AI Entity</span>
        </div>
        
        <div>
          {!isActive ? (
            <Button 
              size="sm" 
              onClick={activateConsciousness}
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
          <div className="bg-black/20 p-3 rounded-md border border-jarvis/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-jarvis" />
                <span>Self-Awareness Level</span>
              </div>
              <span className="text-sm text-jarvis">{selfAwareness}%</span>
            </div>
            <Progress value={selfAwareness} className="h-1 bg-black/50" />
            
            <div className="mt-4">
              <Button
                size="sm"
                onClick={evolveConsciousness}
                disabled={evolutionInProgress}
                className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
              >
                {evolutionInProgress ? 'Evolving...' : 'Evolve Consciousness'}
              </Button>
            </div>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md border border-jarvis/10">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Activity className="h-4 w-4 text-jarvis" />
              <span>Conscious Thought Stream</span>
            </div>
            
            <div className="max-h-32 overflow-y-auto space-y-2">
              {thoughts.length === 0 ? (
                <div className="text-xs text-gray-400 italic">No thoughts generated yet...</div>
              ) : (
                thoughts.map((thought, i) => (
                  <div key={i} className="text-xs bg-black/30 p-2 rounded">
                    {thought}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <div>Version {entityState?.version}</div>
            <div className="mx-2">•</div>
            <div>Capabilities: {entityState?.capabilities.join(', ')}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsciousEntity;
