
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AlertCircle, Check, CheckCircle, Info, Settings, Shield, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ThreatDetection = () => {
  // State for configuration settings
  const [newsApiKey, setNewsApiKey] = useState<string>(localStorage.getItem('newsApiKey') || '');
  const [twilioAccountSid, setTwilioAccountSid] = useState<string>(localStorage.getItem('twilioAccountSid') || '');
  const [twilioAuthToken, setTwilioAuthToken] = useState<string>(localStorage.getItem('twilioAuthToken') || '');
  const [twilioNumber, setTwilioNumber] = useState<string>(localStorage.getItem('twilioNumber') || 'whatsapp:+13205300568');
  const [personalNumber, setPersonalNumber] = useState<string>(localStorage.getItem('personalNumber') || '');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>(localStorage.getItem('keywords') || 'attack,explosion,terrorism,military operation,threat,security breach');
  const [logs, setLogs] = useState<Array<{time: string, message: string, type: string}>>([]);
  const [detectedThreats, setDetectedThreats] = useState<Array<{time: string, headline: string, source: string, keywords: string[]}>>([]); 

  // Demo data for UI preview
  useEffect(() => {
    // Simulate some initial logs
    setLogs([
      {time: getCurrentTime(), message: "System initialized", type: "info"},
      {time: getCurrentTime(), message: "Configuration loaded", type: "info"},
      {time: getCurrentTime(), message: "Waiting to start monitoring", type: "info"}
    ]);

    // Simulate some detected threats for UI demonstration
    setDetectedThreats([
      {time: "2023-05-09 08:15", headline: "Example: Military operation reported near border", source: "CNN", keywords: ["military operation", "border"]},
      {time: "2023-05-09 07:30", headline: "Example: Security alert issued in downtown area", source: "Reuters", keywords: ["security", "alert"]}
    ]);
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('newsApiKey', newsApiKey);
    localStorage.setItem('twilioAccountSid', twilioAccountSid);
    localStorage.setItem('twilioAuthToken', twilioAuthToken);
    localStorage.setItem('twilioNumber', twilioNumber);
    localStorage.setItem('personalNumber', personalNumber);
    localStorage.setItem('keywords', keywords);
  }, [newsApiKey, twilioAccountSid, twilioAuthToken, twilioNumber, personalNumber, keywords]);

  // Helper to get current time in HH:MM:SS format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  // Start monitoring
  const startMonitoring = () => {
    if (!newsApiKey || !twilioAccountSid || !twilioAuthToken || !personalNumber) {
      toast.error("Please provide all required API keys and configuration");
      return;
    }

    setIsRunning(true);
    addLog("Starting threat monitoring system", "success");
    toast.success("Threat monitoring system activated");
    
    // In a real implementation, this would make an API call to your backend
    simulateMonitoring();
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsRunning(false);
    addLog("Threat monitoring system stopped", "warning");
    toast.info("Threat monitoring system deactivated");
  };

  // Add a log entry
  const addLog = (message: string, type: string) => {
    setLogs(prev => [{time: getCurrentTime(), message, type}, ...prev].slice(0, 100));
  };

  // For demonstration - simulate monitoring activity
  const simulateMonitoring = () => {
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      
      addLog("Checking news sources for potential threats...", "info");
      
      // Randomly decide if we find a "threat" (for demo purposes)
      if (Math.random() < 0.3 && isRunning) {
        const demoThreatHeadlines = [
          "Breaking: Security incident reported at international airport",
          "Military forces mobilized near eastern border",
          "Explosion reported in downtown area, authorities investigating",
          "Cybersecurity alert: Critical infrastructure targeted"
        ];
        
        const demoSources = ["BBC News", "CNN", "Reuters", "AP News"];
        const demoKeywords = ["security", "military", "explosion", "cybersecurity"];
        
        const randomHeadline = demoThreatHeadlines[Math.floor(Math.random() * demoThreatHeadlines.length)];
        const randomSource = demoSources[Math.floor(Math.random() * demoSources.length)];
        const matchedKeywords = demoKeywords.filter(() => Math.random() > 0.5);
        
        // Add to threats
        const newThreat = {
          time: new Date().toLocaleString(),
          headline: randomHeadline,
          source: randomSource,
          keywords: matchedKeywords.length ? matchedKeywords : [demoKeywords[0]]
        };
        
        setDetectedThreats(prev => [newThreat, ...prev]);
        addLog(`ALERT: Potential threat detected: ${randomHeadline}`, "error");
        toast.error("Potential threat detected!", {
          description: randomHeadline,
          duration: 5000
        });
      }
    }, 5000); // Check every 5 seconds for demo
    
    return () => clearInterval(interval);
  };

  // Test sending a WhatsApp message
  const testWhatsAppAlert = () => {
    if (!twilioAccountSid || !twilioAuthToken || !personalNumber) {
      toast.error("Please provide Twilio credentials and your WhatsApp number");
      return;
    }
    
    addLog("Testing WhatsApp alert functionality...", "info");
    toast.info("Sending test WhatsApp message...");
    
    // In a real implementation, this would make an API call to your backend
    setTimeout(() => {
      addLog("Test WhatsApp alert sent successfully", "success");
      toast.success("Test message sent! Check your WhatsApp.");
    }, 2000);
  };

  // Calculate configuration completeness
  const getConfigStatus = () => {
    const fields = [newsApiKey, twilioAccountSid, twilioAuthToken, personalNumber];
    const filledFields = fields.filter(field => field.length > 0).length;
    return (filledFields / fields.length) * 100;
  };
  
  const configStatus = getConfigStatus();

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Threat Detection System</h1>
          </div>
          <Badge 
            variant={isRunning ? "default" : "outline"} 
            className={isRunning ? "bg-green-500" : ""}
          >
            {isRunning ? "MONITORING ACTIVE" : "SYSTEM IDLE"}
          </Badge>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Detected Threats</CardTitle>
                    <Badge variant="outline" className="ml-2">{detectedThreats.length}</Badge>
                  </div>
                  <CardDescription>Recent potential security threats detected from news sources</CardDescription>
                </CardHeader>
                <CardContent>
                  {detectedThreats.length > 0 ? (
                    <div className="space-y-4">
                      {detectedThreats.map((threat, index) => (
                        <Card key={index} className="border-l-4 border-red-500">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">{threat.headline}</CardTitle>
                              <span className="text-xs text-muted-foreground">{threat.time}</span>
                            </div>
                            <CardDescription className="text-sm">Source: {threat.source}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex flex-wrap gap-2 mt-2">
                              {threat.keywords.map((keyword, kidx) => (
                                <Badge key={kidx} variant="secondary">{keyword}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No threats detected yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span>Configuration</span>
                          <span>{configStatus}% complete</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${configStatus}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="monitoring-toggle">Monitoring Active</Label>
                          <Switch 
                            id="monitoring-toggle" 
                            checked={isRunning} 
                            onCheckedChange={(checked) => checked ? startMonitoring() : stopMonitoring()}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          onClick={testWhatsAppAlert}
                          variant="outline" 
                          className="w-full"
                        >
                          Test WhatsApp Alert
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Keywords monitored:</span>
                        <span>{keywords.split(',').length}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recent logs:</span>
                        <span>{logs.length}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alerts sent:</span>
                        <span>{Math.floor(detectedThreats.length * 0.7)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure your API keys and alert settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">News API Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="news-api-key">News API Key</Label>
                        <Input
                          id="news-api-key"
                          type="password" 
                          value={newsApiKey}
                          onChange={(e) => setNewsApiKey(e.target.value)}
                          placeholder="Enter your News API key"
                        />
                        <p className="text-xs text-muted-foreground">Get your API key from <a href="https://newsapi.org" target="_blank" className="text-blue-500 hover:underline">newsapi.org</a></p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="keywords">Alert Keywords</Label>
                        <Textarea
                          id="keywords"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="Enter keywords separated by commas"
                          className="min-h-[80px]"
                        />
                        <p className="text-xs text-muted-foreground">Keywords used to detect potential threats in news articles</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Twilio WhatsApp Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="account-sid">Account SID</Label>
                        <Input
                          id="account-sid"
                          type="password"
                          value={twilioAccountSid}
                          onChange={(e) => setTwilioAccountSid(e.target.value)}
                          placeholder="Enter your Twilio Account SID"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="auth-token">Auth Token</Label>
                        <Input
                          id="auth-token"
                          type="password"
                          value={twilioAuthToken}
                          onChange={(e) => setTwilioAuthToken(e.target.value)}
                          placeholder="Enter your Twilio Auth Token"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="twilio-number">Twilio WhatsApp Number</Label>
                        <Input
                          id="twilio-number"
                          value={twilioNumber}
                          onChange={(e) => setTwilioNumber(e.target.value)}
                          placeholder="whatsapp:+1234567890"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="personal-number">Your WhatsApp Number</Label>
                        <Input
                          id="personal-number"
                          value={personalNumber}
                          onChange={(e) => setPersonalNumber(e.target.value)}
                          placeholder="whatsapp:+1234567890"
                        />
                        <p className="text-xs text-muted-foreground">Format: whatsapp:+[country code][number]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}>Reset Configuration</Button>
                <Button onClick={() => {
                  if (getConfigStatus() === 100) {
                    toast.success("Configuration saved successfully");
                  } else {
                    toast.warning("Some configuration fields are missing", {
                      description: "The system may not function properly without all required fields"
                    });
                  }
                }}>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Real-time logs from the threat detection system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-4 overflow-y-auto h-[500px] font-mono text-sm">
                  {logs.map((log, index) => (
                    <div key={index} className={`mb-1 flex items-start ${
                      log.type === 'error' ? 'text-red-500' : 
                      log.type === 'warning' ? 'text-yellow-500' :
                      log.type === 'success' ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                      <span className="inline-block w-20 text-xs opacity-70">{log.time}</span>
                      {log.type === 'error' && <AlertCircle className="mr-1 h-4 w-4 flex-shrink-0 mt-0.5" />}
                      {log.type === 'success' && <CheckCircle className="mr-1 h-4 w-4 flex-shrink-0 mt-0.5" />}
                      {log.type === 'info' && <Info className="mr-1 h-4 w-4 flex-shrink-0 mt-0.5" />}
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setLogs([])}>Clear Logs</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Setup Guide</CardTitle>
                <CardDescription>Follow these steps to set up your threat detection system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 h-6 w-6 text-sm">1</span>
                      Get News API Key
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 ml-8">
                      <li>Visit <a href="https://newsapi.org" target="_blank" className="text-blue-500 hover:underline">newsapi.org</a> and create an account</li>
                      <li>Navigate to your account dashboard and copy your API key</li>
                      <li>Paste the API key in the Configuration tab</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 h-6 w-6 text-sm">2</span>
                      Set Up Twilio WhatsApp
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 ml-8">
                      <li>Sign up for a Twilio account at <a href="https://www.twilio.com" target="_blank" className="text-blue-500 hover:underline">twilio.com</a></li>
                      <li>From your Twilio dashboard, copy your Account SID and Auth Token</li>
                      <li>Join Twilio's WhatsApp sandbox by following <a href="https://www.twilio.com/docs/whatsapp/sandbox" target="_blank" className="text-blue-500 hover:underline">these instructions</a></li>
                      <li>Send the provided code to the Twilio WhatsApp number to connect your WhatsApp account</li>
                      <li>Enter your WhatsApp number in the format <code>whatsapp:+1234567890</code></li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 h-6 w-6 text-sm">3</span>
                      Configure Alert Keywords
                    </h3>
                    <p className="ml-8 mb-2">Enter relevant keywords to monitor in news articles, separated by commas. Examples:</p>
                    <ul className="list-disc list-inside ml-12 space-y-1">
                      <li>terrorism, attack, explosion</li>
                      <li>military operation, deployment</li>
                      <li>security breach, threat</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 h-6 w-6 text-sm">4</span>
                      Test WhatsApp Alerts
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 ml-8">
                      <li>After configuring your Twilio credentials, click "Test WhatsApp Alert" in the Dashboard tab</li>
                      <li>You should receive a test message on your WhatsApp</li>
                      <li>If you don't receive the message, verify your Twilio settings and WhatsApp sandbox setup</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 h-6 w-6 text-sm">5</span>
                      Start Monitoring
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 ml-8">
                      <li>Return to the Dashboard tab</li>
                      <li>Toggle the "Monitoring Active" switch to begin threat detection</li>
                      <li>The system will automatically check news sources and send alerts when threats are detected</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Important Note</p>
                      <p className="text-sm text-blue-700">
                        For a fully functional system, you would need to deploy the Python backend script on a server and 
                        connect it to this interface. Currently, this frontend provides a simulation of the system 
                        for demonstration purposes. See the Python code in the project documentation for full implementation details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThreatDetection;
