
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ApiKeyManager from "./ApiKeyManager";

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
            <ApiKeyManager serviceName="OpenAI" />
            <ApiKeyManager serviceName="ElevenLabs" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JarvisSettings;
