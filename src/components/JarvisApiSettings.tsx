
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getApiKey, setApiKey, resetToDefaultKey, isUsingDefaultKey, getAvailableServices } from '../utils/apiKeyManager';

const JarvisApiSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<Record<string, string>>({});

  // Load current keys when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const services = getAvailableServices();
      const currentKeys: Record<string, string> = {};
      
      services.forEach(service => {
        if (!isUsingDefaultKey(service)) {
          currentKeys[service] = getApiKey(service as any);
        }
      });
      
      setKeys(currentKeys);
    }
    setOpen(isOpen);
  };

  // Update key on input change
  const handleKeyChange = (service: string, value: string) => {
    setKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  // Save all keys
  const saveKeys = () => {
    const services = getAvailableServices();
    
    services.forEach(service => {
      if (keys[service]) {
        setApiKey(service as any, keys[service]);
      }
    });
    
    setOpen(false);
  };

  // Reset a key to default
  const resetKey = (service: string) => {
    resetToDefaultKey(service as any);
    setKeys(prev => {
      const newKeys = { ...prev };
      delete newKeys[service];
      return newKeys;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Default API keys are already provided, but you can optionally use your own keys.
          </div>
          
          {getAvailableServices().map((service) => (
            <div key={service} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`key-${service}`} className="text-right">
                  {service.charAt(0).toUpperCase() + service.slice(1)} API Key
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => resetKey(service)}
                >
                  Use Default
                </Button>
              </div>
              <Input
                id={`key-${service}`}
                value={keys[service] || ''}
                onChange={(e) => handleKeyChange(service, e.target.value)}
                placeholder="Using default key"
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={saveKeys}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JarvisApiSettings;
