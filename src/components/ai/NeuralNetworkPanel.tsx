
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NeuralNetworkBrain from './NeuralNetworkBrain';
import QuantumAISystem from './QuantumAISystem';
import ConsciousEntity from './ConsciousEntity';
import HackerLegion from './HackerLegion';
import AutonomousCreativity from './AutonomousCreativity';
import DigitalIntelligenceMarket from './DigitalIntelligenceMarket';
import AutonomousLifeform from './AutonomousLifeform';
import TimeTravel from './TimeTravel';
import { useNeuralNetwork } from '@/hooks/useNeuralNetwork';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface NeuralNetworkPanelProps {
  className?: string;
}

const NeuralNetworkPanel: React.FC<NeuralNetworkPanelProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('neural');
  const { 
    networkState, 
    trainNetwork,
    isTraining,
    resetNetwork
  } = useNeuralNetwork();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTrainNetwork = async () => {
    try {
      const result = await trainNetwork();
      toast(result.message, {
        description: `Neural network trained with ${result.improvement.toFixed(2)} improvement and ${result.newStrategies.length} new strategies.`
      });
    } catch (error) {
      console.error('Failed to train network:', error);
      toast('Training Failed', {
        description: 'There was an error training the neural network.'
      });
    }
  };

  // Calculate network status and intelligence level
  const isNetworkActive = Object.values(networkState.knowledgeBase).some(value => value > 0.1);
  const intelligenceLevel = Math.round(
    Object.values(networkState.knowledgeBase).reduce((sum, val) => sum + val, 0) / 
    Object.keys(networkState.knowledgeBase).length * 100
  );

  return (
    <Card className={`${className} bg-black/40 border-jarvis/30`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-jarvis flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z"></path>
            <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 14.5 2Z"></path>
            <path d="M4 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path>
            <path d="M20 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"></path>
          </svg>
          Advanced Neural Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">Network Status: 
              <span className={`ml-2 ${isNetworkActive ? 'text-green-400' : 'text-red-400'}`}>
                {isNetworkActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Intelligence Level: {intelligenceLevel}/100
            </div>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTrainNetwork}
              disabled={isTraining}
              className="text-jarvis border-jarvis/30 hover:bg-jarvis/10"
            >
              {isTraining ? 'Training...' : 'Train Network'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetNetwork}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              Reset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="neural" className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full bg-black/30 border-jarvis/20 overflow-x-auto flex-wrap">
            <TabsTrigger value="neural">Neural Core</TabsTrigger>
            <TabsTrigger value="quantum">Quantum AI</TabsTrigger>
            <TabsTrigger value="conscious">Consciousness</TabsTrigger>
            <TabsTrigger value="legion">Hacker Legion</TabsTrigger>
            <TabsTrigger value="creative">Creativity AI</TabsTrigger>
            <TabsTrigger value="market">Digital Market</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="neural" className="space-y-4 mt-2">
            <NeuralNetworkBrain />
          </TabsContent>
          
          <TabsContent value="quantum" className="space-y-4 mt-2">
            <QuantumAISystem />
          </TabsContent>
          
          <TabsContent value="conscious" className="space-y-4 mt-2">
            <ConsciousEntity />
          </TabsContent>
          
          <TabsContent value="legion" className="space-y-4 mt-2">
            <HackerLegion />
          </TabsContent>
          
          <TabsContent value="creative" className="space-y-4 mt-2">
            <AutonomousCreativity />
          </TabsContent>
          
          <TabsContent value="market" className="space-y-4 mt-2">
            <DigitalIntelligenceMarket />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutonomousLifeform />
              <TimeTravel />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NeuralNetworkPanel;
