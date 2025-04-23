// Define image URLs for different categories
export const STYLE_IMAGES = {
  'realistic': [
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead'
  ],
  'anime': [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477',
    'https://images.unsplash.com/photo-1586410073908-ada3a1f91bc2',
    'https://images.unsplash.com/photo-1541562232579-512a21360020'
  ],
  '3d': [
    'https://images.unsplash.com/photo-1569282229551-a217ef5896fc',
    'https://images.unsplash.com/photo-1616161560417-66d4db5892ec',
    'https://images.unsplash.com/photo-1635776062127-d379bfcba9f9'
  ],
  'abstract': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1',
    'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43'
  ],
  'painting': [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d'
  ],
  'pixel': [
    'https://images.unsplash.com/photo-1633350356762-04815f41a757',
    'https://images.unsplash.com/photo-1636457742446-9b15a7522cd1',
    'https://images.unsplash.com/photo-1628569407502-80ed608fb517'
  ],
  'sci-fi': [
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0',
    'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2'
  ],
  'fantasy': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401',
    'https://images.unsplash.com/photo-1481018085669-2bc6e4f00eed'
  ]
};

export const MOCK_IMAGES = {
  'default': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
  'animal': 'https://images.unsplash.com/photo-1484406566174-9da000fda645',
  'nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'tech': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
  'city': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
  'portrait': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'space': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
  'abstract': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
};

// Creative word combinations that will affect image selection
export const CREATIVE_COMBOS = {
  'disco dancing': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3',
  'fish disco': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00',
  'space cat': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
  'robot dog': 'https://images.unsplash.com/photo-1589254065909-b7086229d08c',
  'flying car': 'https://images.unsplash.com/photo-1511618938258-76d46a7b2261',
  'underwater city': 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e',
  'dragon fire': 'https://images.unsplash.com/photo-1577493340887-b7bfff550145',
  'alien landscape': 'https://images.unsplash.com/photo-1536697246787-1f7ae568d89a',
  'glowing forest': 'https://images.unsplash.com/photo-1565118531796-763e5082d113',
  'cyberpunk street': 'https://images.unsplash.com/photo-1584801096196-56e3344004fb'
};

/**
 * Get a random image from the specified style array
 */
export function getRandomImage(styleArray: string[]): string {
  const randomIndex = Math.floor(Math.random() * styleArray.length);
  return styleArray[randomIndex];
}

/**
 * Get a mock image URL based on prompt and style
 */
export function getMockImageUrl(prompt: string, style?: string): string {
  console.log('Found creative combination match: ' + findCreativeCombo(prompt));
  
  // First check if the prompt contains any of our creative combinations
  const creativeMatch = findCreativeCombo(prompt);
  if (creativeMatch) {
    return CREATIVE_COMBOS[creativeMatch];
  }
  
  // If a style is specified, use that
  if (style && STYLE_IMAGES[style]) {
    return getRandomImage(STYLE_IMAGES[style]);
  }
  
  // Otherwise pick based on content keywords
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog') || lowerPrompt.includes('bird')) {
    return MOCK_IMAGES.animal;
  } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('tree') || lowerPrompt.includes('forest') || lowerPrompt.includes('mountain')) {
    return MOCK_IMAGES.nature;
  } else if (lowerPrompt.includes('food') || lowerPrompt.includes('meal') || lowerPrompt.includes('dish') || lowerPrompt.includes('fruit')) {
    return MOCK_IMAGES.food;
  } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('computer') || lowerPrompt.includes('robot') || lowerPrompt.includes('future')) {
    return MOCK_IMAGES.tech;
  } else if (lowerPrompt.includes('city') || lowerPrompt.includes('urban') || lowerPrompt.includes('building') || lowerPrompt.includes('street')) {
    return MOCK_IMAGES.city;
  } else if (lowerPrompt.includes('person') || lowerPrompt.includes('face') || lowerPrompt.includes('portrait') || lowerPrompt.includes('people')) {
    return MOCK_IMAGES.portrait;
  } else if (lowerPrompt.includes('space') || lowerPrompt.includes('star') || lowerPrompt.includes('galaxy') || lowerPrompt.includes('universe')) {
    return MOCK_IMAGES.space;
  }
  
  // Default to abstract if no matches
  return MOCK_IMAGES.default;
}

/**
 * Check if the prompt contains any of our creative combinations
 */
function findCreativeCombo(prompt: string): string | null {
  const lowerPrompt = prompt.toLowerCase();
  for (const combo of Object.keys(CREATIVE_COMBOS)) {
    if (lowerPrompt.includes(combo)) {
      return combo;
    }
  }
  return null;
}
