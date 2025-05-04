
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EntityData {
  type: string;
  text: string;
  confidence: number;
}

interface IntentData {
  name: string;
  confidence: number;
}

interface NLPProps {
  analyzedText?: string;
  entities?: EntityData[];
  intents?: IntentData[];
  sentiment?: number;
  isProcessing?: boolean;
}

export const NLP: React.FC<NLPProps> = ({ 
  analyzedText, 
  entities = [], 
  intents = [],
  sentiment = 0,
  isProcessing = false
}) => {
  const getSentimentText = () => {
    if (sentiment > 0.5) return "Positive";
    if (sentiment < -0.5) return "Negative";
    return "Neutral";
  };

  const getSentimentColor = () => {
    if (sentiment > 0.5) return "text-green-400";
    if (sentiment < -0.5) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" /> NLP Analysis
        </CardTitle>
        <CardDescription>Natural language processing intelligence</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analyzedText && !isProcessing ? (
          <Alert className="bg-jarvis/5 border-jarvis/20">
            <AlertDescription>
              No text analyzed yet. Use voice recognition or type a command to analyze.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-jarvis">Processing natural language...</span>
              </div>
            )}
            
            {analyzedText && (
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Text Analyzed:</h4>
                  <p className="text-white bg-black/40 p-2 rounded-md">{analyzedText}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Sentiment:</h4>
                    <p className={`${getSentimentColor()}`}>{getSentimentText()} ({sentiment.toFixed(1)})</p>
                  </div>
                  
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Intent:</h4>
                    <p className="text-white">
                      {intents.length > 0 
                        ? `${intents[0].name} (${(intents[0].confidence * 100).toFixed(0)}%)`
                        : "Unknown"
                      }
                    </p>
                  </div>
                </div>
                
                {entities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Detected Entities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {entities.map((entity, index) => (
                        <span 
                          key={index}
                          className="bg-jarvis/20 text-jarvis text-xs px-2 py-1 rounded"
                        >
                          {entity.type}: {entity.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
