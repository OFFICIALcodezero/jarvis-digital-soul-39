
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Globe, 
  Mail, 
  AtSign, 
  User, 
  Phone, 
  Server, 
  Database, 
  Network, 
  Shield, 
  FileText, 
  Terminal, 
  LoaderCircle,
  Download,
  Share2
} from 'lucide-react';
import { osintLookup } from '@/services/threatDetectionService';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface OSINTToolsetProps {
  className?: string;
}

const OSINTToolset: React.FC<OSINTToolsetProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('domain');
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setInputValue('');
    setResults(null);
  };
  
  // Get placeholder text based on active tab
  const getPlaceholder = (): string => {
    switch (activeTab) {
      case 'domain':
        return 'Enter domain name (e.g., example.com)';
      case 'email':
        return 'Enter email address';
      case 'ip':
        return 'Enter IP address';
      case 'username':
        return 'Enter username to search';
      case 'phone':
        return 'Enter phone number (e.g., +1234567890)';
      case 'whois':
        return 'Enter domain for WHOIS lookup';
      case 'dns':
        return 'Enter domain for DNS records';
      case 'header':
        return 'Enter URL for header analysis';
      case 'breach':
        return 'Enter email to check for breaches';
      case 'subdomain':
        return 'Enter domain to find subdomains';
      default:
        return 'Enter search term';
    }
  };
  
  // Get input label based on active tab
  const getInputLabel = (): string => {
    switch (activeTab) {
      case 'domain':
        return 'Domain Name';
      case 'email':
        return 'Email Address';
      case 'ip':
        return 'IP Address';
      case 'username':
        return 'Username';
      case 'phone':
        return 'Phone Number';
      case 'whois':
        return 'Domain for WHOIS';
      case 'dns':
        return 'Domain for DNS';
      case 'header':
        return 'URL for Headers';
      case 'breach':
        return 'Email for Breach Check';
      case 'subdomain':
        return 'Domain for Subdomain Finder';
      default:
        return 'Search Input';
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!inputValue.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter a search term to continue.'
      });
      return;
    }
    
    // Validate input based on type
    if (!validateInput(inputValue, activeTab)) {
      return;
    }
    
    // Process the request
    setIsProcessing(true);
    
    try {
      // Map the tab type to the OSINT lookup type
      const lookupType = mapTabToLookupType(activeTab);
      const result = await osintLookup(inputValue, lookupType);
      
      setResults(result);
      
      // Log action
      console.log(`OSINT Tool: ${activeTab} lookup for ${inputValue}`, {
        timestamp: new Date().toISOString(),
        tool: activeTab,
        query: inputValue,
        success: result.success
      });
      
      // Show completion toast
      toast({
        title: 'Lookup Complete',
        description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} lookup for ${inputValue} completed.`
      });
    } catch (error) {
      console.error(`Error in ${activeTab} lookup:`, error);
      
      toast({
        title: 'Lookup Failed',
        description: `There was an error processing your request. Please try again.`,
        variant: "destructive"
      });
      
      setResults({ 
        success: false, 
        error: 'Failed to process request. Please try again later.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Export results
  const handleExport = () => {
    if (!results || !results.result) return;
    
    const exportData = JSON.stringify(results.result, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint-${activeTab}-${inputValue.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Results saved as JSON file.'
    });
  };
  
  // Input validation based on active tab
  const validateInput = (input: string, tab: string): boolean => {
    switch (tab) {
      case 'email':
      case 'breach':
        if (!input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast({
            title: 'Invalid Email',
            description: 'Please enter a valid email address.',
            variant: "destructive"
          });
          return false;
        }
        break;
        
      case 'domain':
      case 'whois':
      case 'dns':
      case 'subdomain':
        if (!input.match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i)) {
          toast({
            title: 'Invalid Domain',
            description: 'Please enter a valid domain name (e.g., example.com).',
            variant: "destructive"
          });
          return false;
        }
        break;
        
      case 'ip':
        if (!input.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) && 
            !input.match(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/)) {
          toast({
            title: 'Invalid IP Address',
            description: 'Please enter a valid IPv4 or IPv6 address.',
            variant: "destructive"
          });
          return false;
        }
        break;
        
      case 'phone':
        if (!input.match(/^\+?[0-9]{10,15}$/)) {
          toast({
            title: 'Invalid Phone Number',
            description: 'Please enter a valid phone number (10-15 digits, optionally with + prefix).',
            variant: "destructive"
          });
          return false;
        }
        break;
        
      case 'header':
        if (!input.match(/^https?:\/\/.+/i)) {
          toast({
            title: 'Invalid URL',
            description: 'Please enter a valid URL starting with http:// or https://.',
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    
    return true;
  };
  
  // Map tab to lookup type
  const mapTabToLookupType = (tab: string): 'email' | 'domain' | 'ip' | 'username' | 'phone' => {
    switch (tab) {
      case 'email':
      case 'breach':
        return 'email';
      case 'domain':
      case 'whois':
      case 'dns':
      case 'header':
      case 'subdomain':
        return 'domain';
      case 'ip':
        return 'ip';
      case 'username':
        return 'username';
      case 'phone':
        return 'phone';
      default:
        return 'domain'; // Default case
    }
  };
  
  // Render JSON result in a formatted way
  const renderResult = (result: any) => {
    if (!result) return null;
    
    if (!result.success) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded-md p-4 mt-4">
          <p className="text-red-400">{result.error || 'An unknown error occurred'}</p>
        </div>
      );
    }
    
    const resultData = result.result;
    
    // Determine which result renderer to use based on the active tab
    switch(activeTab) {
      case 'ip':
        return renderIpResult(resultData);
      case 'domain':
      case 'whois':
      case 'dns':
        return renderDomainResult(resultData);
      case 'email':
      case 'breach':
        return renderEmailResult(resultData);
      case 'username':
        return renderUsernameResult(resultData);
      case 'phone':
        return renderPhoneResult(resultData);
      default:
        // Default to raw JSON
        return (
          <div className="bg-black/30 border border-gray-700 rounded-md p-4 mt-4 max-h-96 overflow-y-auto font-mono text-sm">
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-green-400">
              {JSON.stringify(resultData, null, 2)}
            </pre>
          </div>
        );
    }
  };
  
  // Specialized renderers for each result type
  const renderIpResult = (data: any) => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">IP Information: {data.ip}</h3>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Location Information</h4>
            <div className="space-y-2 text-sm">
              {data.city && <div><span className="text-gray-400">City:</span> {data.city}</div>}
              {data.region && <div><span className="text-gray-400">Region:</span> {data.region}</div>}
              {data.country && <div><span className="text-gray-400">Country:</span> {data.country}</div>}
              {data.postal && <div><span className="text-gray-400">Postal:</span> {data.postal}</div>}
              {data.timezone && <div><span className="text-gray-400">Timezone:</span> {data.timezone}</div>}
              {data.loc && (
                <div>
                  <span className="text-gray-400">Coordinates:</span> {data.loc.lat}, {data.loc.lon}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Network Information</h4>
            <div className="space-y-2 text-sm">
              {data.hostname && <div><span className="text-gray-400">Hostname:</span> {data.hostname}</div>}
              {data.org && <div><span className="text-gray-400">Organization:</span> {data.org}</div>}
              {data.asn && <div><span className="text-gray-400">ASN:</span> {data.asn}</div>}
              {data.openPorts && (
                <div>
                  <span className="text-gray-400">Open Ports:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.openPorts.map((port: number) => (
                      <Badge key={port} variant="outline" className="text-xs">
                        {port}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDomainResult = (data: any) => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Domain Information: {data.domain}</h3>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Registration Information</h4>
            <div className="space-y-2 text-sm">
              {data.create_date && <div><span className="text-gray-400">Created:</span> {data.create_date}</div>}
              {data.update_date && <div><span className="text-gray-400">Updated:</span> {data.update_date}</div>}
              {data.country && <div><span className="text-gray-400">Country:</span> {data.country}</div>}
              <div><span className="text-gray-400">Status:</span> {data.isDead ? 'Inactive' : 'Active'}</div>
            </div>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">DNS Records</h4>
            <div className="space-y-3 text-sm">
              {data.A && data.A.length > 0 && (
                <div>
                  <span className="text-gray-400">A Records:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.A.map((record: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {record}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {data.NS && data.NS.length > 0 && (
                <div>
                  <span className="text-gray-400">Name Servers:</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {data.NS.map((record: string, i: number) => (
                      <span key={i} className="text-xs">
                        {record}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.MX && data.MX.length > 0 && (
                <div>
                  <span className="text-gray-400">Mail Servers:</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {data.MX.map((record: string, i: number) => (
                      <span key={i} className="text-xs">
                        {record}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-md p-4 md:col-span-2">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Security Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={data.hasSPF ? "default" : "destructive"} className="bg-opacity-50">
                  SPF
                </Badge>
                <span className="text-sm">{data.hasSPF ? 'Configured' : 'Missing'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={data.hasDMARC ? "default" : "destructive"} className="bg-opacity-50">
                  DMARC
                </Badge>
                <span className="text-sm">{data.hasDMARC ? 'Configured' : 'Missing'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderEmailResult = (data: any) => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Email Information: {data.email}</h3>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Email Validation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={data.format ? "default" : "destructive"} className="bg-opacity-50">
                  Format
                </Badge>
                <span>{data.format ? 'Valid' : 'Invalid'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={data.valid ? "default" : "destructive"} className="bg-opacity-50">
                  Domain
                </Badge>
                <span>{data.valid ? 'Valid' : 'Invalid'}</span>
              </div>
              
              {data.mxRecords && (
                <div>
                  <span className="text-gray-400">MX Records:</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {data.mxRecords.map((record: string, i: number) => (
                      <span key={i} className="text-xs">
                        {record}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Security Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={data.spfRecord ? "default" : "destructive"} className="bg-opacity-50">
                  SPF
                </Badge>
                <span>{data.spfRecord ? 'Configured' : 'Not Configured'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={data.dmarcRecord ? "default" : "destructive"} className="bg-opacity-50">
                  DMARC
                </Badge>
                <span>{data.dmarcRecord ? 'Configured' : 'Not Configured'}</span>
              </div>
            </div>
          </div>
          
          {data.breachData && (
            <div className="bg-black/30 border border-gray-700 rounded-md p-4 md:col-span-2">
              <h4 className="text-sm font-medium mb-2 text-jarvis">Data Breach Information</h4>
              
              {!data.breachData.found ? (
                <div className="flex items-center gap-2 py-2">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/40">
                    No Breaches
                  </Badge>
                  <span className="text-sm">No breach records found for this email</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/40">
                      {data.breachData.breachCount} {data.breachData.breachCount === 1 ? 'Breach' : 'Breaches'} Found
                    </Badge>
                  </div>
                  
                  {data.breachData.breaches.map((breach: any, index: number) => (
                    <div key={index} className="mb-3 bg-black/30 p-3 rounded-md border border-red-800/30">
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{breach.name}</h5>
                        <span className="text-xs text-gray-400">{breach.date}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 text-xs">Exposed data:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {breach.exposedData.map((data: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        {breach.affectedUsers.toLocaleString()} affected users
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderUsernameResult = (data: any) => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Username Information: {data.username}</h3>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        
        <div className="bg-black/30 border border-gray-700 rounded-md p-4">
          <div className="flex justify-between mb-3">
            <div>
              <span className="text-sm">Found on {data.found} of {data.platformsChecked} platforms</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.results.map((result: any, index: number) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${result.exists ? 'bg-green-900/20 border border-green-700/30' : 'bg-black/20 border border-gray-800'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.exists ? "default" : "outline"} className={result.exists ? "" : "text-gray-400"}>
                      {result.platform}
                    </Badge>
                    <span className={result.exists ? "text-sm" : "text-sm text-gray-500"}>
                      {result.exists ? 'Found' : 'Not Found'}
                    </span>
                  </div>
                  
                  {result.exists && result.url && (
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // In a real implementation, this would open the URL
                        toast({
                          title: "URL Action",
                          description: `This would open ${result.url} in a real implementation`
                        });
                      }} 
                      className="text-xs text-jarvis hover:text-jarvis/80 flex items-center gap-1"
                    >
                      <Share2 className="h-3 w-3" />
                      View
                    </a>
                  )}
                </div>
                
                {result.exists && result.lastActivity && (
                  <div className="mt-2 text-xs text-gray-400">
                    Last activity: {new Date(result.lastActivity).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderPhoneResult = (data: any) => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Phone Information: {data.localFormat}</h3>
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs flex items-center gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Phone Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={data.valid ? "default" : "destructive"} className="bg-opacity-50">
                  {data.valid ? 'Valid' : 'Invalid'}
                </Badge>
                <span className="text-gray-400">Phone Number Format</span>
              </div>
              
              <div>
                <span className="text-gray-400">Country Code:</span> {data.countryCode}
              </div>
              
              <div>
                <span className="text-gray-400">Type:</span> {data.lineType.charAt(0).toUpperCase() + data.lineType.slice(1)}
              </div>
              
              {data.carrier && <div><span className="text-gray-400">Carrier:</span> {data.carrier}</div>}
            </div>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2 text-jarvis">Location Information</h4>
            <div className="space-y-2 text-sm">
              {data.location.country && <div><span className="text-gray-400">Country:</span> {data.location.country}</div>}
              {data.location.region && <div><span className="text-gray-400">Region:</span> {data.location.region}</div>}
              {data.location.city && <div><span className="text-gray-400">City:</span> {data.location.city}</div>}
              {data.timeZone && <div><span className="text-gray-400">Timezone:</span> {data.timeZone}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={`${className} bg-black/40 border border-jarvis/30`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-jarvis">
          <Search className="w-5 h-5" />
          OSINT & Reconnaissance Toolkit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full bg-black/30 border-jarvis/20 overflow-x-auto flex-wrap mb-4">
            <TabsTrigger value="domain" className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>Domain</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="ip" className="flex items-center gap-1">
              <Network className="w-4 h-4" />
              <span>IP Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="username" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Username</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </TabsTrigger>
            <TabsTrigger value="breach" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Breach</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Content for all tabs - unified form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="osint-input">{getInputLabel()}</Label>
              <div className="flex gap-2">
                <Input
                  id="osint-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={getPlaceholder()}
                  className="bg-black/30 border-gray-700 text-white"
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !inputValue.trim()}
                  className="bg-jarvis hover:bg-jarvis/80"
                >
                  {isProcessing ? (
                    <>
                      <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Lookup
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Results display */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-8 bg-black/20 border border-gray-800 rounded-md">
                <LoaderCircle className="w-8 h-8 animate-spin text-jarvis mb-2" />
                <p className="text-jarvis">Processing {activeTab} lookup...</p>
              </div>
            )}
            
            {!isProcessing && results && renderResult(results)}
          </form>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 border-t border-gray-800 pt-4">
        <div className="flex justify-between w-full">
          <span>J.A.R.V.I.S. OSINT v2.5</span>
          <span>Results are for informational purposes only</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OSINTToolset;
