
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ApiKeyManager from "./ApiKeyManager";
import { Alert, AlertDescription } from "./ui/alert";
import { Check, Shield, BadgeAlert } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { clearActivityLogs } from "@/services/moderationService";
import { toast } from "./ui/use-toast";
import { Link } from "react-router-dom";

const JarvisSettings: React.FC = () => {
  const [moderationEnabled, setModerationEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [rateLimitingEnabled, setRateLimitingEnabled] = useState(true);
  
  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
      clearActivityLogs();
      toast({
        title: "Logs Cleared",
        description: "All activity logs have been cleared successfully.",
        variant: "default"
      });
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Configure API keys for JARVIS AI services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-green-500/10 border-green-500/30">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Groq AI API key is pre-configured and ready to use.
              </AlertDescription>
            </Alert>
            <ApiKeyManager serviceName="ElevenLabs" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              System Security & Moderation
            </CardTitle>
            <CardDescription>
              Configure security settings and content moderation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="moderation" className="font-medium">Content Moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Filter harmful or inappropriate prompts
                </p>
              </div>
              <Switch 
                id="moderation" 
                checked={moderationEnabled} 
                onCheckedChange={setModerationEnabled} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alerts" className="font-medium">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about suspicious activity
                </p>
              </div>
              <Switch 
                id="alerts" 
                checked={alertsEnabled} 
                onCheckedChange={setAlertsEnabled} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ratelimit" className="font-medium">Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent abuse by limiting request frequency
                </p>
              </div>
              <Switch 
                id="ratelimit" 
                checked={rateLimitingEnabled} 
                onCheckedChange={setRateLimitingEnabled} 
              />
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <BadgeAlert className="h-5 w-5 mr-2 text-amber-500" />
                Admin Controls
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleClearLogs}>
                  Clear All Activity Logs
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin">
                    Open Admin Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Privacy Notice:</strong> User activity is logged for security purposes. 
                This data is stored locally and not shared with third parties.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JarvisSettings;
