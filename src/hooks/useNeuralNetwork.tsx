
import React, { useState, useCallback, useEffect } from 'react';
import { neuralNetworkService } from '@/services/neuralNetworkService';

// Define the interface locally to match the actual structure in the service
interface NeuralNetworkState {
  knowledgeBase: {
    [domain: string]: number;
  };
  iterations: number;
  learningRate: number;
  version: number;
}

export const useNeuralNetwork = () => {
  const [networkState, setNetworkState] = useState<NeuralNetworkState>(neuralNetworkService.getNetworkState());
  const [isTraining, setIsTraining] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);

  // Initial load and periodic updates
  useEffect(() => {
    // Initial state load
    setNetworkState(neuralNetworkService.getNetworkState());
    
    // Update state periodically
    const intervalId = setInterval(() => {
      if (!isTraining) {
        setNetworkState(neuralNetworkService.getNetworkState());
      }
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [isTraining]);

  // Handle evolution mode effects
  useEffect(() => {
    if (!isEvolving) return;
    
    // Create evolutionary pressure
    const evolutionInterval = setInterval(async () => {
      try {
        // Auto-train when in evolution mode
        const result = await neuralNetworkService.trainNetwork();
        
        // Update state after evolution
        setNetworkState(neuralNetworkService.getNetworkState());
        
        console.log('Neural network evolved:', result);
      } catch (error) {
        console.error('Neural network evolution error:', error);
      }
    }, 60000); // Evolve every minute
    
    // Clean up
    return () => clearInterval(evolutionInterval);
  }, [isEvolving]);

  // Train the neural network
  const trainNetwork = useCallback(async () => {
    setIsTraining(true);
    
    try {
      const result = await neuralNetworkService.trainNetwork();
      setNetworkState(neuralNetworkService.getNetworkState());
      return result;
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    } finally {
      setIsTraining(false);
    }
  }, []);

  // Reset the neural network
  const resetNetwork = useCallback(() => {
    neuralNetworkService.resetNetwork();
    setNetworkState(neuralNetworkService.getNetworkState());
  }, []);

  // Toggle evolution mode
  const toggleEvolution = useCallback((enabled: boolean) => {
    setIsEvolving(enabled);
  }, []);

  return {
    networkState,
    isTraining,
    isEvolving,
    trainNetwork,
    resetNetwork,
    toggleEvolution
  };
};

export default useNeuralNetwork;
