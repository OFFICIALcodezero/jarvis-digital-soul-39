
import { useState, useEffect, useCallback } from 'react';
import { 
  neuralNetworkService, 
  NeuralNetworkState, 
  Strategy, 
  HackingTask, 
  TrainingResult 
} from '@/services/neuralNetworkService';

export interface UseNeuralNetworkOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseNeuralNetworkReturn {
  networkState: NeuralNetworkState;
  strategies: Strategy[];
  taskHistory: HackingTask[];
  isTraining: boolean;
  isExecutingTask: boolean;
  trainNetwork: () => Promise<TrainingResult>;
  executeTask: (task: Omit<HackingTask, 'id' | 'status' | 'startTime' | 'endTime'>) => Promise<HackingTask>;
  resetNetwork: () => void;
  toggleEvolution: (enabled: boolean) => void;
}

export const useNeuralNetwork = (options: UseNeuralNetworkOptions = {}): UseNeuralNetworkReturn => {
  const { 
    autoRefresh = true, 
    refreshInterval = 10000 
  } = options;
  
  const [networkState, setNetworkState] = useState<NeuralNetworkState>(
    neuralNetworkService.getNetworkState()
  );
  const [strategies, setStrategies] = useState<Strategy[]>(
    neuralNetworkService.getStrategies()
  );
  const [taskHistory, setTaskHistory] = useState<HackingTask[]>(
    neuralNetworkService.getTaskHistory()
  );
  const [isTraining, setIsTraining] = useState(false);
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  
  // Refresh data from service
  const refreshData = useCallback(() => {
    setNetworkState(neuralNetworkService.getNetworkState());
    setStrategies(neuralNetworkService.getStrategies());
    setTaskHistory(neuralNetworkService.getTaskHistory());
  }, []);
  
  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshData]);
  
  // Train the network
  const trainNetwork = async (): Promise<TrainingResult> => {
    setIsTraining(true);
    try {
      const result = await neuralNetworkService.trainNetwork();
      refreshData();
      return result;
    } finally {
      setIsTraining(false);
    }
  };
  
  // Execute a task
  const executeTask = async (
    taskData: Omit<HackingTask, 'id' | 'status' | 'startTime' | 'endTime'>
  ): Promise<HackingTask> => {
    setIsExecutingTask(true);
    try {
      const task: HackingTask = {
        id: `task-${Date.now()}`,
        status: 'pending',
        ...taskData
      };
      
      const result = await neuralNetworkService.executeHackingTask(task);
      refreshData();
      return result;
    } finally {
      setIsExecutingTask(false);
    }
  };
  
  // Reset the network
  const resetNetwork = () => {
    neuralNetworkService.resetNetwork();
    refreshData();
  };
  
  // Toggle evolution mode
  const toggleEvolution = (enabled: boolean) => {
    neuralNetworkService.toggleEvolution(enabled);
  };
  
  return {
    networkState,
    strategies,
    taskHistory,
    isTraining,
    isExecutingTask,
    trainNetwork,
    executeTask,
    resetNetwork,
    toggleEvolution
  };
};
