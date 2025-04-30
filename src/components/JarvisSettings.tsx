
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ApiKeyManager from "./ApiKeyManager";
import { Alert, AlertDescription } from "./ui/alert";
import { Check } from "lucide-react";

const JarvisSettings: React.FC = () => {
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
                OpenAI API key is pre-configured and ready to use.
              </AlertDescription>
            </Alert>
            <ApiKeyManager serviceName="ElevenLabs" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JarvisSettings;
