
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import NeuralNetworkPanel from "./ai/NeuralNetworkPanel";
import { toast } from '@/components/ui/sonner';

const JarvisDashboard: React.FC = () => {
  useEffect(() => {
    // Initial dashboard loaded notification
    toast("Neural Network Activated", {
      description: "Advanced AI learning systems are now online",
    });
  }, []);

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="neural" className="w-full">
        <TabsList className="bg-black/30 border-jarvis/20">
          <TabsTrigger value="neural">Neural Network</TabsTrigger>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        <TabsContent value="neural" className="space-y-4 mt-2">
          <NeuralNetworkPanel />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4 mt-2">
          <Card className="p-4 bg-black/40 border-jarvis/30">
            <div className="text-center text-gray-400">
              Active tasks will appear here
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-4 mt-2">
          <Card className="p-4 bg-black/40 border-jarvis/30">
            <div className="text-center text-gray-400">
              System diagnostics will appear here
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JarvisDashboard;
