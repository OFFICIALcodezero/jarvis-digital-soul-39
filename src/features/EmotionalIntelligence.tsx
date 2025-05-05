
import React from 'react';
import { Heart, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface EmotionDisplay {
  emotion: string;
  score: number;
  color: string;
}

interface EmotionalIntelligenceProps {
  emotions: any;
  sentiment: any;
  isProcessing?: boolean;
}

export const EmotionalIntelligence: React.FC<EmotionalIntelligenceProps> = ({ 
  emotions, 
  sentiment,
  isProcessing = false
}) => {
  if (!emotions && !sentiment) {
    return (
      <Alert className="bg-jarvis/5 border-jarvis/20">
        <AlertDescription>
          No emotional data detected yet. Interact with JARVIS to analyze emotions and sentiment.
        </AlertDescription>
      </Alert>
    );
  }

  // Transform emotions data for display
  const emotionData: EmotionDisplay[] = emotions ? [
    { emotion: 'Joy', score: emotions.emotions.joy * 100 || 0, color: 'bg-yellow-400' },
    { emotion: 'Sadness', score: emotions.emotions.sadness * 100 || 0, color: 'bg-blue-400' },
    { emotion: 'Anger', score: emotions.emotions.anger * 100 || 0, color: 'bg-red-400' },
    { emotion: 'Fear', score: emotions.emotions.fear * 100 || 0, color: 'bg-purple-400' },
    { emotion: 'Surprise', score: emotions.emotions.surprise * 100 || 0, color: 'bg-pink-400' },
    { emotion: 'Trust', score: emotions.emotions.trust * 100 || 0, color: 'bg-green-400' }
  ] : [];

  // Get the sentiment color based on the score
  const getSentimentColor = () => {
    if (!sentiment) return 'bg-gray-400';
    
    const score = sentiment.score;
    if (score > 0.5) return 'bg-green-400';
    if (score > 0.1) return 'bg-green-300';
    if (score > -0.1) return 'bg-gray-400';
    if (score > -0.5) return 'bg-red-300';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-3">
      {isProcessing && (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="text-sm text-jarvis">Analyzing emotions...</span>
        </div>
      )}
      
      {emotions && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-jarvis" />
                <span className="text-sm font-medium">Emotional Analysis</span>
              </div>
              <div className="bg-jarvis/20 text-jarvis text-xs px-2 py-0.5 rounded-full">
                {emotions.intensity ? `${Math.round(emotions.intensity * 100)}%` : 'N/A'} intensity
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mt-2">
              {emotionData.filter(e => e.score > 0).sort((a, b) => b.score - a.score).map((emotion, index) => (
                <div key={emotion.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{emotion.emotion}</span>
                    <span>{Math.round(emotion.score)}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-1.5">
                    <div 
                      className={`${emotion.color} h-1.5 rounded-full`} 
                      style={{ width: `${Math.max(5, emotion.score)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {emotions.dominant && (
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Primary emotion: </span>
                <span className="capitalize text-jarvis">{emotions.dominant}</span>
              </div>
            )}
          </div>
          
          {sentiment && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 mr-1 text-jarvis" />
                  <span className="text-sm font-medium">Sentiment Analysis</span>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  sentiment.label === 'positive' ? 'bg-green-900/20 text-green-400' : 
                  sentiment.label === 'negative' ? 'bg-red-900/20 text-red-400' : 
                  'bg-gray-800 text-gray-400'
                }`}>
                  {sentiment.label}
                </div>
              </div>
              
              <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                <div 
                  className={`${getSentimentColor()} h-2 rounded-full transition-all duration-500`} 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (sentiment.score + 1) * 50))}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
