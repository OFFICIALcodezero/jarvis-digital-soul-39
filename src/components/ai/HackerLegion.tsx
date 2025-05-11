
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface Agent {
  id: string;
  name: string;
  specialty: string;
  status: 'active' | 'standby' | 'offline';
  progressValue: number;
}

const HackerLegion: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'agent-1', name: 'Shadow', specialty: 'Reconnaissance', status: 'active', progressValue: 78 },
    { id: 'agent-2', name: 'Phantom', specialty: 'Malware Analysis', status: 'standby', progressValue: 0 },
    { id: 'agent-3', name: 'Specter', specialty: 'Web Scraping', status: 'active', progressValue: 45 },
    { id: 'agent-4', name: 'Ghost', specialty: 'Infrastructure', status: 'offline', progressValue: 0 },
  ]);
  
  const [deploying, setDeploying] = useState(false);
  
  const handleActivateAll = () => {
    setDeploying(true);
    
    setTimeout(() => {
      setAgents(agents.map(agent => ({
        ...agent,
        status: 'active',
        progressValue: agent.status === 'active' ? agent.progressValue : Math.floor(Math.random() * 30) + 10
      })));
      
      setDeploying(false);
      toast('Legion Deployed', {
        description: 'All hacker agents are now active and coordinating tasks.'
      });
    }, 1500);
  };
  
  const handleDeactivateAll = () => {
    setAgents(agents.map(agent => ({
      ...agent,
      status: 'standby',
      progressValue: 0
    })));
    
    toast('Legion Recalled', {
      description: 'All hacker agents have been put on standby.'
    });
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Hacker Legion (Distributed Intelligence Network)</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Active Agents</div>
            <div className="text-lg text-jarvis">{agents.filter(a => a.status === 'active').length}/{agents.length}</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Network Security</div>
            <div className="text-lg text-jarvis">96%</div>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Agent Network</div>
          <div className="space-y-2">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.specialty}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {agent.status === 'active' && (
                    <div className="w-20 bg-black/60 h-1 rounded overflow-hidden">
                      <div 
                        className="bg-jarvis h-full" 
                        style={{ width: `${agent.progressValue}%` }}
                      ></div>
                    </div>
                  )}
                  <Badge 
                    className={`
                      ${agent.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        agent.status === 'standby' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'}
                    `}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeactivateAll}
            disabled={!agents.some(a => a.status === 'active')}
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            Recall All Agents
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleActivateAll}
            disabled={deploying || agents.every(a => a.status === 'active')}
            className="text-jarvis border-jarvis/30 hover:bg-jarvis/10"
          >
            {deploying ? 'Deploying...' : 'Deploy Legion'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HackerLegion;
