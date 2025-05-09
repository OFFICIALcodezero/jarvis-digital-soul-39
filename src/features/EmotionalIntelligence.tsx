
import React from 'react';
import { Activity, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface EmotionalIntelligenceProps {
  emotions?: any;
  sentiment?: any;
  isProcessing?: boolean;
}

export const EmotionalIntelligence: React.FC<EmotionalIntelligenceProps> = ({ 
  emotions, 
  sentiment, 
  isProcessing = false
}) => {
  const getEmotionColor = (emotion: string) => {
    switch(emotion) {
      case 'joy': return 'text-green-400';
      case 'sadness': return 'text-blue-400';
      case 'anger': return 'text-red-400';
      case 'fear': return 'text-purple-400';
      case 'surprise': return 'text-yellow-400';
      case 'disgust': return 'text-orange-400';
      case 'trust': return 'text-cyan-400';
      case 'anticipation': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };
  
  const getSentimentColor = (label: string) => {
    switch(label) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="mr-2 h-4 w-4" /> Emotional Intelligence
        </CardTitle>
        <CardDescription>Sentiment analysis and emotion recognition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!emotions && !sentiment && !isProcessing ? (
          <Alert className="bg-jarvis/5 border-jarvis/20">
            <AlertDescription>
              No emotional data analyzed yet. Speak or type a message to analyze emotional content.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-jarvis">Analyzing emotional content...</span>
              </div>
            )}
            
            {emotions && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Dominant Emotion:</h4>
                <div className="flex items-center">
                  <span className={`text-xl font-semibold capitalize ${getEmotionColor(emotions.dominant)}`}>
                    {emotions.dominant}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    (Intensity: {Math.round(emotions.intensity * 100)}%)
                  </span>
                </div>
                
                <h4 className="text-sm font-medium text-gray-400 mt-3 mb-1">Emotion Distribution:</h4>
                <div className="space-y-2">
                  {Object.entries(emotions.emotions)
                    .filter(([emotion, _]) => emotion !== 'neutral')
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .slice(0, 3)
                    .map(([emotion, value]) => (
                      <div key={emotion} className="grid grid-cols-6 gap-2 items-center">
                        <span className={`text-sm capitalize col-span-2 ${getEmotionColor(emotion)}`}>
                          {emotion}
                        </span>
                        <Progress 
                          value={(value as number) * 100} 
                          className="col-span-3 bg-gray-800 h-2" 
                          indicatorClassName={`${getEmotionColor(emotion).replace('text-', 'bg-')}`} 
                        />
                        <span className="text-xs text-gray-400 text-right">
                          {Math.round((value as number) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {sentiment && (
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Overall Sentiment:</h4>
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${getSentimentColor(sentiment.label)}`}
                  ></div>
                  <span className="text-white capitalize">{sentiment.label}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    (Score: {sentiment.score.toFixed(2)})
                  </span>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 relative">
                    <div 
                      className="absolute top-0 bottom-0 w-2 rounded-full bg-white"
                      style={{ 
                        left: `calc(${(sentiment.score + 1) / 2 * 100}% - 4px)`,
                        transform: 'translateX(-50%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
