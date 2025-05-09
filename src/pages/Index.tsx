
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, ExternalLink, Code } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold tracking-tight">Jarvis Threat Detection System</h1>
          </div>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            Monitor global news for potential security threats and receive real-time WhatsApp alerts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Real-time Monitoring</CardTitle>
              <CardDescription>
                Scans news sources continuously to detect potential security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connects to NewsAPI to fetch and analyze the latest articles, looking for security-related keywords.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Threat Detection</CardTitle>
              <CardDescription>
                Advanced keyword analysis identifies potential security concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identifies articles containing terms like "explosion," "attack," "military," and sends alerts when threats are detected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <ExternalLink className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">WhatsApp Alerts</CardTitle>
              <CardDescription>
                Instantly receive notifications on your phone via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Uses Twilio's WhatsApp API to send detailed security alerts directly to your phone when potential threats are identified.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-16">
          <Link to="/threat-detection">
            <Button size="lg" className="text-lg px-8 py-6">
              Launch Threat Detection System
            </Button>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Code className="h-6 w-6 mr-2" />
            Implementation Details
          </h2>
          
          <div className="space-y-4">
            <p>
              This system includes both a React frontend dashboard and a Python backend script that handles the actual threat detection and WhatsApp messaging.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Frontend Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Configuration management for API keys and settings</li>
                  <li>Real-time threat visualization dashboard</li>
                  <li>System logs and monitoring status</li>
                  <li>Test functionality for WhatsApp alerts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Backend Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>NewsAPI integration for article fetching</li>
                  <li>Keyword-based threat detection algorithm</li>
                  <li>Twilio WhatsApp messaging integration</li>
                  <li>Comprehensive logging and error handling</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> To use this system, you need to configure your NewsAPI and Twilio credentials, and run 
                the Python backend script separately. Check the documentation for detailed setup instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
