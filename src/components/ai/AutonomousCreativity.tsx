
import React, { useState, useEffect } from 'react';
import { WandSparkles, Palette, FileText, Code, Smile, Frown } from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AutonomousCreativity: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [creativeMode, setCreativeMode] = useState<'story' | 'design' | 'code'>('story');
  const [emotionalTone, setEmotionalTone] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  
  useEffect(() => {
    const entityState = enhancedAIService.getEntityState('creativity');
    if (entityState) {
      setIsActive(entityState.active);
    }
  }, []);
  
  const activateCreativity = () => {
    const success = enhancedAIService.activateEntity('creativity');
    if (success) {
      setIsActive(true);
    }
  };
  
  const generateContent = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);
    
    try {
      const result = await enhancedAIService.generateCreativeContent(
        creativeMode, 
        prompt
      );
      
      setGeneratedContent(result.content);
      
      toast("Content Generated", {
        description: `Created ${creativeMode} with ${result.emotionalTone} emotional tone`
      });
    } catch (error) {
      toast("Generation Failed", {
        description: "Failed to create content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const entityState = enhancedAIService.getEntityState('creativity');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-jarvis">
          <WandSparkles className="h-5 w-5" />
          <span className="font-semibold">Autonomous Creativity</span>
        </div>
        
        <div>
          {!isActive ? (
            <Button 
              size="sm" 
              onClick={activateCreativity}
              className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
            >
              Activate
            </Button>
          ) : (
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Active
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <>
          <Tabs defaultValue="story" onValueChange={(v) => setCreativeMode(v as any)}>
            <TabsList className="w-full bg-black/30 border-jarvis/20">
              <TabsTrigger value="story" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Story</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-1">
                <Palette className="w-4 h-4" />
                <span>Design</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>Hacking Blueprint</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-3 bg-black/20 rounded-md border border-jarvis/10 mt-3">
              <div className="flex items-center gap-2 mb-2 text-sm">
                <WandSparkles className="h-4 w-4 text-jarvis" />
                <span>Create {creativeMode.charAt(0).toUpperCase() + creativeMode.slice(1)}</span>
              </div>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Enter a prompt for your ${creativeMode}...`}
                className="bg-black/30 border-jarvis/20 mb-3 min-h-[100px]"
              />
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Emotional Tone:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={emotionalTone === 'neutral' ? 'default' : 'outline'}
                      className={emotionalTone === 'neutral' ? 'bg-jarvis/30 text-white' : 'bg-black/20 text-gray-400'}
                      onClick={() => setEmotionalTone('neutral')}
                    >
                      Neutral
                    </Button>
                    <Button
                      size="sm"
                      variant={emotionalTone === 'positive' ? 'default' : 'outline'}
                      className={emotionalTone === 'positive' ? 'bg-green-600/30 text-green-400' : 'bg-black/20 text-gray-400'}
                      onClick={() => setEmotionalTone('positive')}
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      Positive
                    </Button>
                    <Button
                      size="sm"
                      variant={emotionalTone === 'negative' ? 'default' : 'outline'}
                      className={emotionalTone === 'negative' ? 'bg-red-600/30 text-red-400' : 'bg-black/20 text-gray-400'}
                      onClick={() => setEmotionalTone('negative')}
                    >
                      <Frown className="h-4 w-4 mr-1" />
                      Negative
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={generateContent}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              {generatedContent && (
                <div className="bg-black/30 p-3 rounded-md border border-jarvis/10 mt-3 font-mono text-xs overflow-auto max-h-[200px]">
                  <div className="whitespace-pre-wrap">{generatedContent}</div>
                </div>
              )}
            </div>
          </Tabs>
          
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <div>Version {entityState?.version}</div>
            <div className="mx-2">•</div>
            <div>Development Progress: {entityState?.progress}%</div>
            <div className="mx-2">•</div>
            <div>Capabilities: {entityState?.capabilities.join(', ')}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AutonomousCreativity;
