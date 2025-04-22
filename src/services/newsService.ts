
import { toast } from '@/components/ui/use-toast';

export interface NewsArticle {
  title: string;
  source: string;
  summary: string;
  url?: string;
  category: string;
  publishedAt: string;
}

export interface NewsQuery {
  category?: string;
  count?: number;
}

// Mock news data for demonstration
const mockNewsData: NewsArticle[] = [
  {
    title: "New Breakthrough in Quantum Computing",
    source: "Tech Today",
    summary: "Scientists have achieved a new milestone in quantum computing, demonstrating quantum supremacy for complex calculations.",
    category: "technology",
    publishedAt: new Date().toISOString()
  },
  {
    title: "Global Climate Summit Reaches Agreement",
    source: "World News",
    summary: "World leaders have agreed on new measures to reduce carbon emissions during the latest climate summit.",
    category: "world",
    publishedAt: new Date().toISOString()
  },
  {
    title: "Revolutionary AI Model Can Predict Protein Structures",
    source: "Science Daily",
    summary: "A new AI model can accurately predict protein structures, potentially accelerating drug discovery and biological research.",
    category: "science",
    publishedAt: new Date().toISOString()
  },
  {
    title: "Stock Markets Show Strong Recovery",
    source: "Financial Times",
    summary: "Global markets rebounded today as investor confidence returned following positive economic indicators.",
    category: "business",
    publishedAt: new Date().toISOString()
  },
  {
    title: "New Space Telescope Captures Stunning Images",
    source: "Space News",
    summary: "The newly launched space telescope has sent back its first images, revealing unprecedented details of distant galaxies.",
    category: "science",
    publishedAt: new Date().toISOString()
  }
];

export const getNewsUpdates = async (query: NewsQuery = {}): Promise<NewsArticle[]> => {
  // In a real implementation, you would call a news API here
  // For demo purposes, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredNews = [...mockNewsData];
      
      // Filter by category if provided
      if (query.category) {
        filteredNews = filteredNews.filter(article => 
          article.category.toLowerCase() === query.category!.toLowerCase()
        );
      }
      
      // Limit the number of articles
      const count = query.count || 3;
      filteredNews = filteredNews.slice(0, count);
      
      resolve(filteredNews);
    }, 1000);
  });
};

export const parseNewsQuery = (query: string): NewsQuery => {
  const result: NewsQuery = {};
  
  // Check for category in the query
  if (query.includes("tech") || query.includes("technology")) {
    result.category = "technology";
  } else if (query.includes("world") || query.includes("global")) {
    result.category = "world";
  } else if (query.includes("science")) {
    result.category = "science";
  } else if (query.includes("business") || query.includes("finance")) {
    result.category = "business";
  }
  
  // Set count based on query
  if (query.includes("brief") || query.includes("summary")) {
    result.count = 3;
  } else if (query.includes("detail") || query.includes("full")) {
    result.count = 5;
  } else {
    result.count = 3; // Default
  }
  
  return result;
};

export const getNewsResponse = async (query: string): Promise<{text: string, articles: NewsArticle[]}> => {
  try {
    const parsedQuery = parseNewsQuery(query);
    const newsArticles = await getNewsUpdates(parsedQuery);
    
    let responseText = "";
    
    // Generate response based on query and results
    if (newsArticles.length === 0) {
      responseText = "I couldn't find any news matching your query at the moment.";
      return { text: responseText, articles: [] };
    }
    
    if (parsedQuery.category) {
      responseText = `Here are the latest ${parsedQuery.category} news updates: `;
    } else {
      responseText = "Here are today's top news stories: ";
    }
    
    newsArticles.forEach((article, index) => {
      responseText += `${index + 1}. ${article.title} from ${article.source}. ${article.summary} `;
    });
    
    return { text: responseText, articles: newsArticles };
  } catch (error) {
    console.error('Error getting news response:', error);
    return { 
      text: "I'm sorry, I couldn't retrieve the news updates at this time.", 
      articles: [] 
    };
  }
};
