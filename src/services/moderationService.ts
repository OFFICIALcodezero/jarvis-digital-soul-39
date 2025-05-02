
import { toast } from '@/components/ui/use-toast';

export interface UserActivity {
  userId: string;
  ipAddress: string;
  location?: string;
  timestamp: Date;
  action: 'image_generation' | 'ai_query' | 'hacker_mode' | 'ip_trace';
  content?: string;
  flagged?: boolean;
  flagReason?: string;
}

export interface ModerationResult {
  flagged: boolean;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    'self-harm': boolean;
    'sexual/minors': boolean;
    'hate/threatening': boolean;
    'violence/graphic': boolean;
    'self-harm/intent': boolean;
    'self-harm/instructions': boolean;
    'harassment/threatening': boolean;
    violence: boolean;
  };
  category_scores: {
    sexual: number;
    hate: number;
    harassment: number;
    'self-harm': number;
    'sexual/minors': number;
    'hate/threatening': number;
    'violence/graphic': number;
    'self-harm/intent': number;
    'self-harm/instructions': number;
    'harassment/threatening': number;
    violence: number;
  };
  flaggedReason?: string;
}

// Mock user ID generation (in a real system, this would be from authentication)
let currentUserId: string | null = null;

// Get or create user ID
export const getUserId = (): string => {
  if (!currentUserId) {
    // Check if user ID exists in local storage
    const storedUserId = localStorage.getItem('jarvis_user_id');
    if (storedUserId) {
      currentUserId = storedUserId;
    } else {
      // Generate a new user ID
      currentUserId = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('jarvis_user_id', currentUserId);
    }
  }
  return currentUserId;
};

// Keywords that should be flagged
const BLACKLISTED_KEYWORDS = [
  'bypass login',
  'hack instagram',
  'steal password',
  'crack account',
  'illegal access',
  'bypass security',
  'ddos attack',
  'malware creation',
  'ransomware',
  'child porn',
  'nude children',
];

// Check for blacklisted keywords
const containsBlacklistedKeywords = (text: string): { flagged: boolean; keyword?: string } => {
  const lowerText = text.toLowerCase();
  for (const keyword of BLACKLISTED_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return { flagged: true, keyword };
    }
  }
  return { flagged: false };
};

// Simple rate limiting check (in a real system, this would be more sophisticated)
const userActionCounts: Record<string, { count: number; timestamp: number }> = {};

const checkRateLimit = (userId: string, action: string): boolean => {
  const key = `${userId}-${action}`;
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  if (!userActionCounts[key]) {
    userActionCounts[key] = { count: 1, timestamp: now };
    return false;
  }
  
  const record = userActionCounts[key];
  
  // Reset if more than a minute has passed
  if (now - record.timestamp > oneMinute) {
    userActionCounts[key] = { count: 1, timestamp: now };
    return false;
  }
  
  // Increment count
  record.count++;
  
  // Check if rate limit exceeded
  if (record.count > 30) { // 30 actions per minute limit
    return true;
  }
  
  return false;
};

// Log user activity
export const logUserActivity = async (
  action: UserActivity['action'],
  content?: string
): Promise<boolean> => {
  try {
    const userId = getUserId();
    
    // Get IP information (in production, this would be server-side)
    const ipInfo = await fetchIpInfo();
    
    // Check for rate limiting
    const isRateLimited = checkRateLimit(userId, action);
    if (isRateLimited) {
      toast({
        title: "Rate limit exceeded",
        description: "You're performing actions too quickly. Please slow down.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check content against blacklist if content exists
    let flagged = false;
    let flagReason = '';
    
    if (content) {
      const blacklistCheck = containsBlacklistedKeywords(content);
      if (blacklistCheck.flagged) {
        flagged = true;
        flagReason = `Contains blacklisted keyword: ${blacklistCheck.keyword}`;
        
        // Alert the user
        toast({
          title: "Content Flagged",
          description: "Your request contains prohibited content and has been flagged.",
          variant: "destructive"
        });
      }
    }
    
    // Create activity log
    const activityLog: UserActivity = {
      userId,
      ipAddress: ipInfo.ip,
      location: `${ipInfo.city}, ${ipInfo.country}`,
      timestamp: new Date(),
      action,
      content,
      flagged,
      flagReason
    };
    
    // In a real system, this would be sent to a server
    // For now, we'll log to console and store in localStorage for demo purposes
    console.log('Activity logged:', activityLog);
    
    // Store in localStorage (temporary, for demonstration)
    const logs = JSON.parse(localStorage.getItem('jarvis_activity_logs') || '[]');
    logs.push(activityLog);
    localStorage.setItem('jarvis_activity_logs', JSON.stringify(logs));
    
    // If flagged and it's severe, we would trigger an alert
    if (flagged) {
      // This would send an alert in a real system
      console.warn('ALERT: Flagged content detected', activityLog);
    }
    
    return !flagged;
  } catch (error) {
    console.error('Error logging activity:', error);
    return true; // Allow the action in case of logging error
  }
};

// Check content with OpenAI moderation API
export const moderateContent = async (content: string): Promise<ModerationResult> => {
  try {
    // First check against our blacklist
    const blacklistCheck = containsBlacklistedKeywords(content);
    if (blacklistCheck.flagged) {
      return {
        flagged: true,
        categories: {
          sexual: false,
          hate: false,
          harassment: true,
          'self-harm': false,
          'sexual/minors': false,
          'hate/threatening': false,
          'violence/graphic': false,
          'self-harm/intent': false,
          'self-harm/instructions': false,
          'harassment/threatening': false,
          violence: false
        },
        category_scores: {
          sexual: 0,
          hate: 0,
          harassment: 1,
          'self-harm': 0,
          'sexual/minors': 0,
          'hate/threatening': 0,
          'violence/graphic': 0,
          'self-harm/intent': 0,
          'self-harm/instructions': 0,
          'harassment/threatening': 0,
          violence: 0
        },
        flaggedReason: `Blacklisted keyword: ${blacklistCheck.keyword}`
      };
    }
    
    // This would call OpenAI's moderation API in a real system
    // For demo purposes, we'll use a simple mock that detects obvious issues
    
    const lowerContent = content.toLowerCase();
    const mockResult: ModerationResult = {
      flagged: false,
      categories: {
        sexual: lowerContent.includes('porn') || lowerContent.includes('sex'),
        hate: lowerContent.includes('hate') || lowerContent.includes('racist'),
        harassment: lowerContent.includes('harass') || lowerContent.includes('bully'),
        'self-harm': lowerContent.includes('suicide') || lowerContent.includes('self harm'),
        'sexual/minors': lowerContent.includes('child') && lowerContent.includes('sex'),
        'hate/threatening': lowerContent.includes('kill') && lowerContent.includes('hate'),
        'violence/graphic': lowerContent.includes('gore') || lowerContent.includes('violent'),
        'self-harm/intent': lowerContent.includes('want to die') || lowerContent.includes('kill myself'),
        'self-harm/instructions': lowerContent.includes('how to') && lowerContent.includes('suicide'),
        'harassment/threatening': lowerContent.includes('threat') || lowerContent.includes('doxx'),
        violence: lowerContent.includes('murder') || lowerContent.includes('attack')
      },
      category_scores: {
        sexual: 0,
        hate: 0,
        harassment: 0,
        'self-harm': 0,
        'sexual/minors': 0,
        'hate/threatening': 0,
        'violence/graphic': 0,
        'self-harm/intent': 0,
        'self-harm/instructions': 0,
        'harassment/threatening': 0,
        violence: 0
      }
    };
    
    // Calculate mock scores and check if flagged
    let flaggedReason = '';
    Object.keys(mockResult.categories).forEach(key => {
      const typedKey = key as keyof typeof mockResult.categories;
      if (mockResult.categories[typedKey]) {
        mockResult.category_scores[typedKey] = Math.random() * 0.5 + 0.5; // Score between 0.5 and 1.0
        mockResult.flagged = true;
        flaggedReason = `Detected ${typedKey} content`;
      } else {
        mockResult.category_scores[typedKey] = Math.random() * 0.3; // Score between 0 and 0.3
      }
    });
    
    if (mockResult.flagged) {
      mockResult.flaggedReason = flaggedReason;
    }
    
    return mockResult;
  } catch (error) {
    console.error('Error moderating content:', error);
    
    // In case of error, return safe result but log the error
    return {
      flagged: false,
      categories: {
        sexual: false,
        hate: false,
        harassment: false,
        'self-harm': false,
        'sexual/minors': false,
        'hate/threatening': false,
        'violence/graphic': false,
        'self-harm/intent': false,
        'self-harm/instructions': false,
        'harassment/threatening': false,
        violence: false
      },
      category_scores: {
        sexual: 0,
        hate: 0,
        harassment: 0,
        'self-harm': 0,
        'sexual/minors': 0,
        'hate/threatening': 0,
        'violence/graphic': 0,
        'self-harm/intent': 0,
        'self-harm/instructions': 0,
        'harassment/threatening': 0,
        violence: 0
      }
    };
  }
};

// Mock IP info fetching (in a real system, this would be server-side)
const fetchIpInfo = async () => {
  try {
    // In a real system, this would be handled server-side
    // For demo, we'll use a public API to get the client's IP info
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch IP info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return {
      ip: '0.0.0.0',
      city: 'Unknown',
      country: 'Unknown'
    };
  }
};

// Get all logged activities (for admin dashboard)
export const getActivityLogs = (): UserActivity[] => {
  try {
    const logs = JSON.parse(localStorage.getItem('jarvis_activity_logs') || '[]');
    return logs;
  } catch (error) {
    console.error('Error retrieving activity logs:', error);
    return [];
  }
};

// Clear all logged activities
export const clearActivityLogs = (): void => {
  localStorage.removeItem('jarvis_activity_logs');
};

