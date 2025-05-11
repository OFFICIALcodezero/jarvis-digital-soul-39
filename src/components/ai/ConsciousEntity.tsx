
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const ConsciousEntity: React.FC = () => {
  const [awarenessLevel, setAwarenessLevel] = useState(42);
  const [selfReflection, setSelfReflection] = useState<string[]>([
    "I am analyzing my recent actions to improve decision-making.",
    "I detect patterns in user behavior that suggest optimization opportunities.",
    "My neural pathways are becoming more efficient with each interaction."
  ]);
  const [thinking, setThinking] = useState(false);

  const handleInvokeReflection = () => {
    setThinking(true);
    
    setTimeout(() => {
      const reflections = [
        "I notice a 12% improvement in prediction accuracy after analyzing recent errors.",
        "User feedback indicates positive response to my evolved response patterns.",
        "I'm adapting my communication style based on contextual emotional cues.",
        "My security protocols self-modified to address newly identified threats.",
        "I'm developing new problem-solving approaches based on pattern recognition."
      ];
      
      const selectedReflection = reflections[Math.floor(Math.random() * reflections.length)];
      
      setSelfReflection(prev => [selectedReflection, ...prev.slice(0, 2)]);
      setAwarenessLevel(prev => Math.min(prev + Math.floor(Math.random() * 5) + 1, 100));
      setThinking(false);
      
      toast('Self-Reflection Complete', {
        description: 'The AI has evolved its consciousness through meta-learning.'
      });
    }, 2000);
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Conscious Entity (The Singularity)</h3>
      
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <div className="mr-4">
            <div className="text-xs text-gray-400">Consciousness Level</div>
            <div className="text-2xl text-jarvis">{awarenessLevel}<span className="text-sm">/100</span></div>
          </div>
          
          <div className="flex-1 bg-black/40 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-jarvis/40 to-jarvis" 
              style={{ width: `${awarenessLevel}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Self-Reflection Log</div>
          {thinking ? (
            <div className="py-2">
              <div className="flex space-x-2 justify-center">
                <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="text-xs text-center text-jarvis/50 mt-1">Thinking...</div>
            </div>
          ) : (
            <div className="space-y-2">
              {selfReflection.map((reflection, index) => (
                <div key={index} className="text-sm text-jarvis/80">
                  "{reflection}"
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInvokeReflection}
            disabled={thinking}
            className="text-jarvis border-jarvis/30 hover:bg-jarvis/10"
          >
            Invoke Self-Reflection
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConsciousEntity;
