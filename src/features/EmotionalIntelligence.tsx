
import React from 'react';
import { Heart, ThermometerIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionAnalysisResult, SentimentAnalysisResult } from '@/services/emotionalIntelligenceService';

interface EmotionData {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  [key: string]: number;
}

interface EmotionalIntelligenceProps {
  emotions?: EmotionAnalysisResult;
  sentiment?: SentimentAnalysisResult;
  isProcessing?: boolean;
}

export const EmotionalIntelligence: React.FC<EmotionalIntelligenceProps> = ({
  emotions,
  sentiment,
  isProcessing = false
}) => {
  const getEmotionColor = (emotion: string): string => {
    switch (emotion) {
      case 'joy': return 'text-green-400';
      case 'sadness': return 'text-blue-400';
      case 'anger': return 'text-red-500';
      case 'fear': return 'text-purple-400';
      case 'surprise': return 'text-yellow-400';
      case 'disgust': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionBarColor = (emotion: string): string => {
    switch (emotion) {
      case 'joy': return 'bg-green-500';
      case 'sadness': return 'bg-blue-500';
      case 'anger': return 'bg-red-500';
      case 'fear': return 'bg-purple-500';
      case 'surprise': return 'bg-yellow-500';
      case 'disgust': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = () => {
    if (!sentiment) return 'text-gray-400';
    if (sentiment.score > 0.5) return 'text-green-400';
    if (sentiment.score < -0.5) return 'text-red-400';
    return 'text-gray-400';
  };

  const getSentimentText = () => {
    if (!sentiment) return 'Unknown';
    if (sentiment.score > 0.5) return 'Positive';
    if (sentiment.score < -0.5) return 'Negative';
    return 'Neutral';
  };

  const getSentimentEmoji = () => {
    if (!sentiment) return '😐';
    if (sentiment.score > 0.5) return '😊';
    if (sentiment.score < -0.5) return '😢';
    return '😐';
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="mr-2 h-4 w-4" /> Emotional Intelligence
        </CardTitle>
        <CardDescription>Sentiment and emotion analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-sm text-jarvis">Analyzing emotions...</span>
          </div>
        ) : !emotions && !sentiment ? (
          <div className="p-4 bg-black/30 rounded-lg border border-jarvis/20 text-center">
            <p className="text-sm text-gray-400">No emotional data available. Try speaking to Jarvis to generate emotional analysis.</p>
          </div>
        ) : (
          <>
            {sentiment && (
              <div className="bg-black/30 p-3 rounded-lg border border-jarvis/20">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-400">Sentiment Analysis</h4>
                  <span className={`text-lg ${getSentimentColor()}`}>{getSentimentEmoji()}</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-red-400">Negative</span>
                    <span className={getSentimentColor()}>
                      {getSentimentText()} ({sentiment.score.toFixed(2)})
                    </span>
                    <span className="text-green-400">Positive</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        sentiment.score > 0 ? 'bg-green-500' : sentiment.score < 0 ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ 
                        width: `${Math.abs(sentiment.score) * 50 + 50}%`, 
                        marginLeft: sentiment.score < 0 ? '0' : '50%',
                        transform: sentiment.score < 0 ? 'translateX(50%)' : 'none'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {emotions && (
              <div className="bg-black/30 p-3 rounded-lg border border-jarvis/20">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Emotion Analysis</h4>
                <div className="space-y-2">
                  {Object.entries(emotions.scores).map(([emotion, score]) => (
                    <div key={emotion} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className={getEmotionColor(emotion)}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                        <span className="text-gray-400">{(score * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={score * 100} className="h-1.5 bg-gray-700" indicatorClassName={getEmotionBarColor(emotion)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
