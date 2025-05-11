
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NeuralNetworkBrain from './NeuralNetworkBrain';

interface NeuralNetworkPanelProps {
  className?: string;
}

const NeuralNetworkPanel: React.FC<NeuralNetworkPanelProps> = ({ className }) => {
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
          Neural Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NeuralNetworkBrain />
      </CardContent>
    </Card>
  );
};

export default NeuralNetworkPanel;
