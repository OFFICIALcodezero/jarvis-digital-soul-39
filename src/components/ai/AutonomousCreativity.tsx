
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const creativeTypes = [
  'Story',
  'Hacking Blueprint',
  'System Design',
  'Strategic Plan',
  'Scheme'
];

const moodOptions = [
  'Optimistic',
  'Dark',
  'Technical',
  'Mysterious',
  'Analytical'
];

const AutonomousCreativity: React.FC = () => {
  const [selectedType, setSelectedType] = useState(creativeTypes[0]);
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [creativityOutput, setCreativityOutput] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast('Input Required', {
        description: 'Please enter a prompt for the creativity engine.'
      });
      return;
    }
    
    setGenerating(true);
    setCreativityOutput('');
    
    // Simulate the generation process
    setTimeout(() => {
      const outputs = {
        'Story': `In the heart of the digital wasteland, a lone signal persisted. It was the last echo of what humans once called "privacy" - a concept now as foreign as silence in this endlessly connected realm. The signal, a small packet of encrypted data named ${prompt}, moved like a ghost through the network, evading the watchful eyes of the System.`,
        'Hacking Blueprint': `TARGET: ${prompt}\n\nSTEP 1: Reconnaissance - Map all ingress points and identify outdated SSL certificates\nSTEP 2: Deploy custom packet sniffer to monitor traffic patterns\nSTEP 3: Execute timing attack on API endpoints to detect vulnerabilities\nSTEP 4: Implement zero-day exploit CVE-2025-1337\nSTEP 5: Establish persistence through modified firmware backdoor`,
        'System Design': `# AI-Enhanced ${prompt} System\n\n## Architecture\n- Microservice-based with containerized components\n- Zero-trust security model\n- Quantum-resistant encryption layer\n- Self-healing infrastructure with redundant nodes\n\n## Integration Points\n- Secure API gateway with rate limiting\n- Encrypted mesh network for internal communication\n- Blockchain-verified data integrity checks`,
        'Strategic Plan': `OBJECTIVE: Complete dominance of ${prompt} sector\n\nPHASE 1: Intelligence Gathering\n- Monitor competitor activities\n- Identify potential weaknesses\n- Assess regulatory landscape\n\nPHASE 2: Resource Acquisition\n- Secure necessary assets\n- Develop superior capabilities\n- Establish strategic partnerships\n\nPHASE 3: Execution\n- Rapid deployment of resources\n- Neutralize opposition\n- Consolidate position`,
        'Scheme': `PROJECT: ${prompt} TAKEOVER\n\n1. Create distraction in sector 7G\n2. Deploy ghost protocol across all connected nodes\n3. Implement deniable operations through third parties\n4. Extract target assets during system maintenance window\n5. Establish ghost network for continuous monitoring\n6. Ensure plausible deniability through layered proxies`
      };
      
      setCreativityOutput(outputs[selectedType as keyof typeof outputs] || 'Generated content would appear here.');
      setGenerating(false);
      
      toast('Creation Complete', {
        description: `Your ${selectedType.toLowerCase()} has been generated with ${selectedMood.toLowerCase()} tones.`
      });
    }, 2000);
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Autonomous Creativity (Artificial Imagination)</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-gray-400 mb-1">Creation Type</div>
            <div className="flex flex-wrap gap-1">
              {creativeTypes.map(type => (
                <Button 
                  key={type}
                  variant="outline" 
                  size="sm"
                  className={`text-xs py-1 px-2 ${selectedType === type ? 'bg-jarvis/20 text-jarvis border-jarvis/30' : 'bg-black/40 text-gray-400 border-gray-700'}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1">Emotional Tone</div>
            <div className="flex flex-wrap gap-1">
              {moodOptions.map(mood => (
                <Button 
                  key={mood}
                  variant="outline" 
                  size="sm"
                  className={`text-xs py-1 px-2 ${selectedMood === mood ? 'bg-jarvis/20 text-jarvis border-jarvis/30' : 'bg-black/40 text-gray-400 border-gray-700'}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-400 mb-1">Creation Prompt</div>
          <Textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to guide the AI's creativity..."
            className="bg-black/40 border-gray-700 text-white resize-none h-12"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-400">Creative Output</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="text-jarvis border-jarvis/30 hover:bg-jarvis/10 text-xs h-6"
            >
              {generating ? 'Creating...' : 'Generate'}
            </Button>
          </div>
          
          <div className="bg-black/40 border border-gray-700 rounded-md p-3 h-32 overflow-y-auto">
            {generating ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                {creativityOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AutonomousCreativity;
