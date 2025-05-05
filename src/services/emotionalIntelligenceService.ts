
export interface EmotionData {
  dominant: string;
  emotions: Record<string, number>;
  intensity: number;
}

export interface SentimentData {
  score: number;
  magnitude: number;
  label: 'positive' | 'negative' | 'neutral';
}

// Basic emotion patterns for detection
const emotionPatterns = {
  joy: [
    'happy', 'joy', 'delighted', 'pleased', 'glad', 'thrilled', 'excited', 
    'elated', 'ecstatic', 'content', 'satisfied', 'cheerful', 'merry',
    'lol', 'haha', ':)', ':-)', 'yay', 'awesome', 'great', 'love',
    'wonderful', 'fantastic', 'excellent', 'amazing', '❤️', '♥️', '😀', '😃'
  ],
  sadness: [
    'sad', 'unhappy', 'miserable', 'depressed', 'gloomy', 'heartbroken', 
    'melancholy', 'disappointed', 'disheartened', 'downcast', 'blue',
    'tragic', 'tearful', 'upset', ':(', ':-(' , 'sigh', 'unfortunately',
    'regret', 'miss', 'sorry', 'cry', 'crying', '😢', '😭', '😔'
  ],
  anger: [
    'angry', 'furious', 'outraged', 'incensed', 'enraged', 'irate', 'livid', 
    'irritated', 'annoyed', 'frustrated', 'mad', 'hatred', 'hate',
    'despise', 'resent', 'dislike', 'loathe', '😠', '😡', 'fuck', 'damn',
    'hell', 'shit', 'terrible', 'worst', 'stupid', 'idiot', 'dumb'
  ],
  fear: [
    'afraid', 'scared', 'frightened', 'terrified', 'fearful', 'anxious', 
    'worried', 'nervous', 'panicked', 'alarmed', 'startled', 'spooked',
    'horror', 'terror', 'dread', 'concern', 'apprehension', '😨', '😱', 
    'panic', 'stress', 'stress', 'worried', 'concern'
  ],
  surprise: [
    'surprised', 'amazed', 'astonished', 'astounded', 'shocked', 'stunned', 
    'startled', 'dumbfounded', 'speechless', 'bewildered', 'flabbergasted',
    'wow', 'whoa', 'oh', 'what', 'really', '!', '?!', 'unexpected', 'unbelievable',
    '😲', '😮', '😯', '😦'
  ],
  disgust: [
    'disgusted', 'revolted', 'repulsed', 'sickened', 'nauseated', 'appalled', 
    'repelled', 'dislike', 'aversion', 'abhorrence', 'distaste',
    'gross', 'yuck', 'ew', 'nasty', 'disgusting', 'eww', '🤢', '🤮'
  ],
  trust: [
    'trust', 'believe', 'faith', 'confidence', 'reliable', 'dependable', 
    'trustworthy', 'honest', 'loyal', 'faithful', 'devoted',
    'assured', 'certain', 'convinced', 'integrity', 'honorable'
  ],
  anticipation: [
    'anticipate', 'expect', 'hope', 'looking forward', 'awaiting', 'eager', 
    'cant wait', 'soon', 'excited about', 'anticipation', 'hopeful',
    'prospect', 'upcoming', 'future', 'tomorrow', 'next', 'later', 'hoping'
  ],
  neutral: [
    'ok', 'okay', 'fine', 'average', 'so-so', 'alright', 'decent', 
    'fair', 'reasonable', 'moderate', 'tolerable', 'acceptable',
    'adequate', 'satisfactory', 'mediocre', 'standard', 'common'
  ]
};

// Analyze text for emotional content
export const analyzeEmotions = (text: string): EmotionData => {
  // Default values
  let emotionScores: Record<string, number> = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    trust: 0,
    anticipation: 0,
    neutral: 0.1 // Default small neutral score
  };
  
  if (!text || text.trim().length === 0) {
    return {
      dominant: 'neutral',
      emotions: emotionScores,
      intensity: 0.1
    };
  }
  
  const lowerText = text.toLowerCase();
  let wordCount = lowerText.split(/\s+/).length;
  let totalMatches = 0;
  
  // Score each emotion category
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    let count = 0;
    patterns.forEach(pattern => {
      // Count occurrences of each pattern
      const regex = new RegExp(`\\b${pattern}\\b|${pattern}`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      count += matches;
      totalMatches += matches;
    });
    
    // Calculate normalized score for this emotion
    emotionScores[emotion] = count / Math.max(1, wordCount);
  });
  
  // Find the dominant emotion
  let dominantEmotion = 'neutral';
  let highestScore = 0;
  
  Object.entries(emotionScores).forEach(([emotion, score]) => {
    if (score > highestScore) {
      highestScore = score;
      dominantEmotion = emotion;
    }
  });
  
  // Calculate overall emotional intensity (0-1)
  const intensity = Math.min(1, totalMatches / Math.max(1, wordCount));
  
  return {
    dominant: dominantEmotion,
    emotions: emotionScores,
    intensity: intensity
  };
};

// Analyze text for sentiment (positive/negative)
export const analyzeSentiment = (text: string): SentimentData => {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      magnitude: 0,
      label: 'neutral'
    };
  }
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Simple sentiment dictionary
  const sentimentDictionary: Record<string, number> = {
    // Positive words
    'good': 0.3, 'great': 0.5, 'excellent': 0.7, 'wonderful': 0.6, 'amazing': 0.7,
    'happy': 0.5, 'love': 0.7, 'best': 0.6, 'fantastic': 0.8, 'perfect': 0.9,
    'awesome': 0.8, 'outstanding': 0.7, 'superb': 0.8, 'nice': 0.3, 'brilliant': 0.7,
    'enjoy': 0.5, 'pleased': 0.4, 'delighted': 0.7, 'glad': 0.3, 'exciting': 0.6,
    'appreciate': 0.5, 'thankful': 0.6, 'grateful': 0.6, 'praise': 0.5, 
    
    // Negative words
    'bad': -0.3, 'terrible': -0.7, 'awful': -0.6, 'horrible': -0.8, 'poor': -0.4,
    'hate': -0.7, 'dislike': -0.5, 'worst': -0.8, 'sad': -0.4, 'disappointed': -0.5,
    'unfortunate': -0.4, 'annoying': -0.5, 'frustrating': -0.6, 'angry': -0.6, 'upset': -0.4,
    'stupid': -0.6, 'useless': -0.5, 'broken': -0.4, 'fail': -0.5, 'failed': -0.5,
    'waste': -0.5, 'disaster': -0.7, 'pathetic': -0.6, 'trouble': -0.4, 'disappointment': -0.5,
    
    // Intensifiers
    'very': 1.5, 'extremely': 2.0, 'incredibly': 1.8, 'absolutely': 1.8, 'really': 1.3,
    'completely': 1.5, 'utterly': 1.7, 'truly': 1.4, 'totally': 1.5, 'so': 1.2,
    
    // Negators
    'not': -1.0, "don't": -1.0, "doesn't": -1.0, "didn't": -1.0, "isn't": -1.0,
    "aren't": -1.0, "wasn't": -1.0, "weren't": -1.0, "no": -1.0, "never": -1.0
  };
  
  let score = 0;
  let totalWords = 0;
  let negationFactor = 1;
  let intensifier = 1;
  
  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[.,?!;:]/g, ''); // Remove punctuation
    
    // Check if this is a negation word
    if (['not', "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", 'no', 'never'].includes(word)) {
      negationFactor = -1;
      continue;
    }
    
    // Check if this is an intensifier
    if (sentimentDictionary[word] && sentimentDictionary[word] > 1) {
      intensifier = sentimentDictionary[word];
      continue;
    }
    
    // If this word has a sentiment score, add it
    if (sentimentDictionary[word]) {
      score += sentimentDictionary[word] * negationFactor * intensifier;
      totalWords++;
      // Reset modifiers
      negationFactor = 1;
      intensifier = 1;
    }
  }
  
  // Normalize score to -1 to 1 range
  let normalizedScore = 0;
  if (totalWords > 0) {
    normalizedScore = score / totalWords;
  }
  
  // Calculate magnitude (strength of sentiment regardless of polarity)
  const magnitude = Math.abs(normalizedScore);
  
  // Determine label
  let label: 'positive' | 'negative' | 'neutral';
  if (normalizedScore > 0.1) {
    label = 'positive';
  } else if (normalizedScore < -0.1) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  return {
    score: normalizedScore,
    magnitude: magnitude,
    label: label
  };
};

// Get an empathetic prefix for responses based on detected emotion
export const getEmpatheticPrefix = (text: string): string => {
  const emotions = analyzeEmotions(text);
  const sentiment = analyzeSentiment(text);
  
  // If no strong emotion detected, return empty string
  if (emotions.intensity < 0.2) {
    return '';
  }
  
  // Empathetic responses based on emotion
  switch (emotions.dominant) {
    case 'joy':
      return "I'm happy to hear that! ";
      
    case 'sadness':
      return "I'm sorry to hear that. ";
      
    case 'anger':
      return "I understand you're frustrated. ";
      
    case 'fear':
      return "I can sense your concern. ";
      
    case 'surprise':
      return "That's quite surprising! ";
      
    case 'disgust':
      return "I understand that's unpleasant. ";
      
    case 'trust':
      return "I appreciate your confidence. ";
      
    case 'anticipation':
      return "I can tell you're looking forward to this. ";
      
    default:
      return '';
  }
};
