
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Wifi, Globe, Search, Code, Database, Activity } from 'lucide-react';

interface Tool {
  name: string;
  icon: React.ElementType;
  description: string;
}

const tools: Tool[] = [
  { 
    name: 'IP Tracker', 
    icon: Wifi, 
    description: 'Track and analyze IP addresses'
  },
  { 
    name: 'DNS Lookup', 
    icon: Globe, 
    description: 'Retrieve DNS records for a domain'
  },
  { 
    name: 'WHOIS', 
    icon: Database, 
    description: 'Domain registration details'
  },
  { 
    name: 'Port Scanner', 
    icon: Search, 
    description: 'Identify open ports on a network'
  },
  { 
    name: 'Header Viewer', 
    icon: Code, 
    description: 'View HTTP headers for websites'
  },
  { 
    name: 'Lab Environment', 
    icon: Shield,
    description: 'Safe network testing environment'
  }
];

const HackerMode = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [target, setTarget] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToolAction = (toolName: string) => {
    if (!target) {
      setResults('Error: Please enter a valid target');
      return;
    }

    setIsLoading(true);
    setResults(null);

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock results based on the tool
      switch(toolName) {
        case 'IP Tracker':
          setResults(`IP Analysis for ${target}:\n• Location: New York, USA\n• ISP: Example Network\n• Status: Active\n• Type: Dynamic IP\n\nAdditional information requires elevated privileges.`);
          break;
        case 'DNS Lookup':
          setResults(`DNS Records for ${target}:\n• A: 192.168.1.1\n• MX: mail.${target}\n• NS: ns1.${target}, ns2.${target}\n• TXT: v=spf1 include:_spf.${target} ~all`);
          break;
        case 'WHOIS':
          setResults(`WHOIS data for ${target}:\n• Registrar: Example Registrar, Inc.\n• Registered On: 01-Jan-2020\n• Expires On: 01-Jan-2025\n• Status: Active\n\nRegistrant information redacted for privacy.`);
          break;
        case 'Port Scanner':
          setResults(`Scan results for ${target}:\n• Port 80 (HTTP): Open\n• Port 443 (HTTPS): Open\n• Port 21 (FTP): Closed\n• Port 22 (SSH): Filtered\n• Port 25 (SMTP): Closed\n\nScan limited to common ports only.`);
          break;
        case 'Header Viewer':
          setResults(`HTTP Headers for ${target}:\n• Server: nginx/1.18.0\n• Content-Type: text/html; charset=UTF-8\n• X-Powered-By: PHP/7.4.3\n• Cache-Control: max-age=3600\n• Content-Security-Policy: default-src 'self'`);
          break;
        case 'Lab Environment':
          setResults(`Virtual environment initialized for ${target}\n• Status: Active\n• Environment: Isolated Sandbox\n• Security Level: Maximum\n• Traffic: Monitored\n• Duration: 60 minutes\n\nNote: All activities are logged for ethical hacking practice only.`);
          break;
        default:
          setResults(`Analysis of ${target} complete. Results require advanced access level.`);
      }
    }, 2000);
  };

  return (
    <div className="w-full h-full hacker-bg p-4 rounded-lg overflow-hidden">
      <div className="mb-4 border-b border-[#33c3f0]/30 pb-2">
        <h2 className="text-xl font-mono text-[#33c3f0] glow-blue-sm">CODE ZERO <span className="text-xs bg-[#33c3f0]/20 px-2 py-0.5 rounded ml-2">HACKER MODE</span></h2>
        <p className="text-xs text-[#8a8a9b]">System access level: Basic</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-black/30 border border-[#33c3f0]/20 w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#33c3f0]/20">General</TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-[#33c3f0]/20">Network</TabsTrigger>
          <TabsTrigger value="osint" className="data-[state=active]:bg-[#33c3f0]/20">OSINT</TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-[#33c3f0]/20">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <div className="glass-morphism p-4 rounded-lg">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-[#33c3f0]" />
                <span className="text-sm font-semibold text-[#d6d6ff]">System Status</span>
              </div>
              <div className="text-xs text-[#8a8a9b] space-y-1">
                <p>• Core Module: <span className="text-[#33c3f0]">Active</span></p>
                <p>• Security Level: <span className="text-[#33c3f0]">Standard</span></p>
                <p>• Encryption: <span className="text-[#33c3f0]">Enabled (AES-256)</span></p>
                <p>• VPN Status: <span className="text-yellow-500">Disabled</span></p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-[#d6d6ff] mb-2">Target Analysis</p>
              <div className="flex space-x-2">
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Enter IP, domain, or URL"
                  className="bg-black/50 border-[#33c3f0]/30 text-white"
                />
                <Button 
                  onClick={() => handleToolAction('General Analysis')}
                  disabled={isLoading}
                  className="bg-[#33c3f0] hover:bg-[#1eaedb] text-black"
                >
                  {isLoading ? 'Processing...' : 'Analyze'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {tools.map((tool) => (
              <div 
                key={tool.name}
                onClick={() => handleToolAction(tool.name)}
                className="glass-morphism p-3 rounded-lg cursor-pointer hover:bg-[#33c3f0]/10 transition-colors flex flex-col items-center text-center"
              >
                <tool.icon className="h-8 w-8 mb-2 text-[#33c3f0]" />
                <span className="text-sm font-medium text-[#d6d6ff]">{tool.name}</span>
                <span className="text-xs text-[#8a8a9b]">{tool.description}</span>
              </div>
            ))}
          </div>
          
          {results && (
            <div className="mt-4 glass-morphism p-4 rounded-lg">
              <p className="text-sm font-semibold text-[#33c3f0] mb-2">Analysis Results</p>
              <pre className="text-xs font-mono text-[#d6d6ff] whitespace-pre-wrap bg-black/50 p-3 rounded overflow-x-auto">
                {results}
              </pre>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-4 glass-morphism p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-t-[#33c3f0] border-r-[#33c3f0]/50 border-b-[#33c3f0]/30 border-l-[#33c3f0]/10 rounded-full animate-spin mr-2"></div>
                <p className="text-sm text-[#33c3f0]">Processing target data</p>
              </div>
              <div className="mt-2 h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1eaedb] to-[#33c3f0] animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="network" className="mt-4">
          <div className="glass-morphism p-4 rounded-lg">
            <p className="text-center text-[#d6d6ff]">Network analysis tools require advanced permissions.</p>
            <p className="text-center text-xs text-[#8a8a9b] mt-2">Please use the General tab for basic network analysis.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="osint" className="mt-4">
          <div className="glass-morphism p-4 rounded-lg">
            <p className="text-center text-[#d6d6ff]">OSINT tools require advanced permissions.</p>
            <p className="text-center text-xs text-[#8a8a9b] mt-2">Please use the General tab for basic OSINT analysis.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-4">
          <div className="glass-morphism p-4 rounded-lg">
            <p className="text-center text-[#d6d6ff]">Additional tools require advanced permissions.</p>
            <p className="text-center text-xs text-[#8a8a9b] mt-2">Please use the General tab for available tools.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HackerMode;
