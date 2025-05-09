
import { toast } from '../components/ui/sonner';

// Mock news articles with threat data for simulation
const mockThreatArticles = [
  {
    title: "Explosion reported in downtown area",
    description: "An explosion has been reported in the downtown area. Authorities are investigating.",
    source: "Breaking News Network",
    keyword: "explosion",
    location: "Downtown Metro Area",
    threatLevel: "High",
    timestamp: new Date().toISOString()
  },
  {
    title: "Military movements detected near border",
    description: "Unusual military activity has been detected near the eastern border. Officials are monitoring the situation.",
    source: "Global Security Report",
    keyword: "military",
    location: "Eastern Border Zone",
    threatLevel: "Medium",
    timestamp: new Date().toISOString()
  },
  {
    title: "Cyber attack targets critical infrastructure",
    description: "A sophisticated cyber attack has been detected targeting critical infrastructure systems.",
    source: "Tech Security Daily",
    keyword: "attack",
    location: "National Infrastructure Network",
    threatLevel: "High",
    timestamp: new Date().toISOString()
  }
];

// Keywords to detect in threat analysis
const threatKeywords = [
  "explosion", "attack", "military", "terrorism", "bomb", "shooting", 
  "hostage", "hijack", "missile", "combat", "invasion", "threat"
];

/**
 * Simulates fetching news articles related to security threats
 */
export const fetchThreatNews = async () => {
  // In a real implementation, this would call a news API
  // For demo purposes, we return mock data after a short delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  return {
    articles: mockThreatArticles,
    timestamp: new Date().toISOString()
  };
};

/**
 * Analyzes articles for potential threats based on keywords
 */
export const analyzeThreatLevel = (articles: any[]) => {
  return articles.map(article => {
    // Check if any keywords appear in the title or description
    const titleLower = article.title.toLowerCase();
    const descLower = article.description.toLowerCase();
    
    const foundKeywords = threatKeywords.filter(keyword => 
      titleLower.includes(keyword.toLowerCase()) || 
      descLower.includes(keyword.toLowerCase())
    );
    
    return {
      ...article,
      detectedKeywords: foundKeywords,
      threatConfidence: foundKeywords.length > 1 ? "High" : (foundKeywords.length === 1 ? "Medium" : "Low")
    };
  });
};

/**
 * Simulates sending WhatsApp alerts via Twilio
 */
export const sendWhatsAppAlert = async (threatData: any, phoneNumber: string) => {
  // In a real implementation, this would call the Twilio API
  console.log(`Simulating WhatsApp alert to ${phoneNumber}`);
  console.log("Threat data:", threatData);
  
  // Show toast notification to simulate the alert
  toast("WhatsApp Alert Sent", {
    description: `Alert about "${threatData.title}" sent to WhatsApp`,
    duration: 5000,
  });
  
  return {
    success: true,
    messageSid: `MS${Math.random().toString(36).substring(2, 15)}`,
    timestamp: new Date().toISOString()
  };
};

/**
 * Main function to detect threats and send alerts if needed
 */
export const detectThreats = async (phoneNumber: string) => {
  try {
    toast("Initiating Threat Detection", {
      description: "Scanning news sources for potential threats...",
    });
    
    // Step 1: Fetch threat news (simulated)
    const newsData = await fetchThreatNews();
    
    // Step 2: Analyze the threats
    const analyzedThreats = analyzeThreatLevel(newsData.articles);
    
    // Step 3: Filter high confidence threats
    const highThreats = analyzedThreats.filter(t => t.threatConfidence === "High");
    
    // Step 4: Send alerts for high threats
    if (highThreats.length > 0) {
      toast("ALERT: Threats Detected", {
        description: `${highThreats.length} high-level threats detected`,
        duration: 8000,
      });
      
      // Send WhatsApp alerts for each high threat
      for (const threat of highThreats) {
        await sendWhatsAppAlert(threat, phoneNumber);
      }
      
      return {
        status: "threats_detected",
        threatCount: highThreats.length,
        threats: highThreats
      };
    } else {
      toast("Scan Complete", {
        description: "No immediate threats detected",
      });
      
      return {
        status: "no_threats",
        threatCount: 0
      };
    }
  } catch (error) {
    console.error("Error in threat detection:", error);
    toast("Threat Detection Error", {
      description: "Failed to complete threat analysis",
      // Changed from variant: "destructive" to type: "error" for sonner compatibility
      type: "error",
    });
    
    return {
      status: "error",
      error: String(error)
    };
  }
};
