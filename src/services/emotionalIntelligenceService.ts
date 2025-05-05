
// Emotional intelligence service for analyzing sentiment and emotions in text

export interface EmotionAnalysisResult {
  dominant: string;
  scores: {
    [emotion: string]: number;
  };
}

export interface SentimentAnalysisResult {
  score: number; // -1 (negative) to 1 (positive)
  magnitude: number; // strength of the sentiment
  label: 'positive' | 'negative' | 'neutral';
}

/**
 * Analyze text for emotional content
 * This is a simplified implementation that could be expanded with a real ML model
 */
export const analyzeEmotions = (text: string): EmotionAnalysisResult => {
  const emotionKeywords = {
    joy: ['happy', 'excited', 'great', 'wonderful', 'pleased', 'delighted', 'glad', 'joy', 'enjoy', 'love', 'amazing'],
    sadness: ['sad', 'unhappy', 'disappointed', 'upset', 'depressed', 'down', 'blue', 'sorrow', 'grief', 'miserable'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'enraged', 'outraged', 'hate'],
    fear: ['afraid', 'scared', 'frightened', 'terrified', 'anxious', 'worried', 'nervous', 'panic', 'dread'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'unexpected', 'wow'],
    disgust: ['disgusted', 'repulsed', 'revolted', 'gross', 'nasty', 'unpleasant', 'yuck'],
  };

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\W+/);
  
  const scores: { [emotion: string]: number } = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
  };
  
  // Count emotional keywords
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[emotion] += 1;
      }
    });
  });
  
  // Normalize scores
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  if (totalScore > 0) {
    Object.keys(scores).forEach(emotion => {
      scores[emotion] = scores[emotion] / totalScore;
    });
  } else {
    // If no emotion detected, default to neutral
    scores['neutral'] = 1;
  }
  
  // Find dominant emotion
  let dominant = 'neutral';
  let highestScore = 0;
  
  Object.entries(scores).forEach(([emotion, score]) => {
    if (score > highestScore) {
      dominant = emotion;
      highestScore = score;
    }
  });
  
  return { dominant, scores };
};

/**
 * Analyze sentiment (positive/negative) of text
 */
export const analyzeSentiment = (text: string): SentimentAnalysisResult => {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'terrific', 'love', 'happy', 'pleased', 'joy', 'delighted', 'excited'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor', 'hate', 'dislike', 'sad', 'angry', 'upset', 'disappointing', 'frustrated', 'annoyed'];
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const score = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
  const magnitude = positiveCount + negativeCount;
  
  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 0.1) label = 'positive';
  else if (score < -0.1) label = 'negative';
  
  return { score, magnitude, label };
};

/**
 * Generate an emotionally intelligent response based on detected emotion
 */
export const generateEmotionalResponse = (text: string, userName?: string): string => {
  const emotions = analyzeEmotions(text);
  const sentiment = analyzeSentiment(text);
  const greeting = userName ? `${userName}, ` : '';
  
  // Generate response based on dominant emotion
  switch (emotions.dominant) {
    case 'joy':
      return `${greeting}I'm glad you're feeling positive! It's great to share in your happiness.`;
    case 'sadness':
      return `${greeting}I notice you might be feeling down. If there's anything I can do to help, please let me know.`;
    case 'anger':
      return `${greeting}I understand you're frustrated. Let's work through this together and find a solution.`;
    case 'fear':
      return `${greeting}It seems like you might be concerned about something. I'm here to help if you need support.`;
    case 'surprise':
      return `${greeting}That does sound surprising! I'd be interested to hear more about it.`;
    case 'disgust':
      return `${greeting}I understand this might be an unpleasant situation. Let me see if I can help.`;
    default:
      return ''; // Return empty for neutral, to be handled by regular response
  }
};

/**
 * Get empathetic prefix for response based on user's emotional state
 */
export const getEmpatheticPrefix = (text: string): string => {
  const sentiment = analyzeSentiment(text);
  
  if (sentiment.magnitude < 0.5) return ''; // No strong emotion detected
  
  if (sentiment.label === 'positive' && sentiment.magnitude > 1) {
    return "I'm happy to hear that! ";
  } else if (sentiment.label === 'negative' && sentiment.magnitude > 1) {
    return "I understand this might be difficult. ";
  }
  
  return '';
};
