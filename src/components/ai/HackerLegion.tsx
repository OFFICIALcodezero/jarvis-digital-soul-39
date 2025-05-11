
import React, { useState, useEffect } from 'react';
import { Network, Shield, Database, Globe } from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';

interface Agent {
  id: string;
  type: 'recon' | 'exploit' | 'data' | 'defense';
  status: 'idle' | 'active' | 'complete' | 'failed';
  task?: string;
  progress?: number;
}

const HackerLegion: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  
  useEffect(() => {
    const entityState = enhancedAIService.getEntityState('hacker-legion');
    if (entityState) {
      setIsActive(entityState.active);
    }
    
    // Initialize with some agents
    if (entityState?.active) {
      setAgents([
        { id: 'agent-1', type: 'recon', status: 'idle' },
        { id: 'agent-2', type: 'exploit', status: 'idle' },
        { id: 'agent-3', type: 'data', status: 'idle' }
      ]);
    }
  }, []);
  
  const activateHackerLegion = () => {
    const success = enhancedAIService.activateEntity('hacker-legion');
    if (success) {
      setIsActive(true);
      setAgents([
        { id: 'agent-1', type: 'recon', status: 'idle' },
        { id: 'agent-2', type: 'exploit', status: 'idle' },
        { id: 'agent-3', type: 'data', status: 'idle' }
      ]);
    }
  };
  
  const deployAgents = async () => {
    if (!taskInput.trim() || isDeploying) return;
    
    setIsDeploying(true);
    
    // Update agents to active state
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'active',
      task: taskInput,
      progress: 0
    })));
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'active' && typeof agent.progress === 'number') {
          const newProgress = Math.min(100, (agent.progress + Math.random() * 5));
          return {
            ...agent,
            progress: newProgress,
            status: newProgress >= 100 ? 'complete' : 'active'
          };
        }
        return agent;
      }));
    }, 300);
    
    try {
      // Deploy agents via service
      const result = await enhancedAIService.deployAgents(taskInput, 3);
      
      if (result.success) {
        // Add any new agents
        const newAgentIds = result.agents;
        
        toast("Agents Deployed Successfully", {
          description: `${newAgentIds.length} agents deployed for task: ${taskInput}`
        });
        
        // Clear the input
        setTaskInput('');
      }
    } catch (error) {
      toast("Deployment Failed", {
        description: "Unable to deploy hacker legion agents",
        variant: "destructive"
      });
      
      // Set some agents to failed state
      setAgents(prev => prev.map((agent, idx) => 
        idx % 2 === 0 ? { ...agent, status: 'failed' } : agent
      ));
    } finally {
      // Clear the interval after a reasonable time
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsDeploying(false);
      }, 5000);
    }
  };
  
  const entityState = enhancedAIService.getEntityState('hacker-legion');
  
  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'recon': return <Globe className="h-4 w-4 text-blue-400" />;
      case 'exploit': return <Shield className="h-4 w-4 text-red-400" />;
      case 'data': return <Database className="h-4 w-4 text-green-400" />;
      case 'defense': return <Shield className="h-4 w-4 text-yellow-400" />;
      default: return <Network className="h-4 w-4 text-jarvis" />;
    }
  };
  
  const getAgentTypeLabel = (type: Agent['type']) => {
    switch (type) {
      case 'recon': return 'Reconnaissance';
      case 'exploit': return 'Exploit Development';
      case 'data': return 'Data Extraction';
      case 'defense': return 'Defense Analysis';
      default: return type;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-jarvis">
          <Network className="h-5 w-5" />
          <span className="font-semibold">Hacker Legion</span>
        </div>
        
        <div>
          {!isActive ? (
            <Button 
              size="sm" 
              onClick={activateHackerLegion}
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
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Network className="h-4 w-4 text-jarvis" />
              <span>Deploy Legion Agents</span>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter task for legion agents..."
                className="flex-1 bg-black/20 border-jarvis/20 text-sm"
              />
              <Button
                onClick={deployAgents}
                disabled={!taskInput.trim() || isDeploying}
                className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
              >
                Deploy
              </Button>
            </div>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md border border-jarvis/10">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Network className="h-4 w-4 text-jarvis" />
              <span>Active Agents</span>
              <span className="bg-jarvis/20 text-jarvis text-xs px-2 py-0.5 rounded-full ml-2">
                {agents.length}
              </span>
            </div>
            
            <div className="space-y-2">
              {agents.length === 0 ? (
                <div className="text-xs text-gray-400 italic">No agents deployed</div>
              ) : (
                agents.map(agent => (
                  <div key={agent.id} className="bg-black/30 p-2 rounded border border-jarvis/10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.type)}
                        <span className="text-xs">{getAgentTypeLabel(agent.type)}</span>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        agent.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                        agent.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                        agent.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </div>
                    </div>
                    
                    {agent.task && (
                      <div className="text-xs text-gray-400 mb-1">Task: {agent.task}</div>
                    )}
                    
                    {agent.status === 'active' && typeof agent.progress === 'number' && (
                      <Progress value={agent.progress} className="h-1 bg-black/50" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <div>Version {entityState?.version}</div>
            <div className="mx-2">•</div>
            <div>Development Progress: {entityState?.progress}%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default HackerLegion;
