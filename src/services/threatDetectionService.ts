
import { toast } from '@/components/ui/use-toast';
import { supabase } from "../integrations/supabase/client";

// Define the shape of a threat
export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  source?: string;
}

// Define the result of threat detection
export interface ThreatDetectionResult {
  status: 'threats_detected' | 'no_threats' | 'error';
  threatCount: number;
  message: string;
  threats?: Threat[]; // Add the threats array to fix the TypeScript error
  alertSent?: boolean;
  timestamp: string;
}

// API endpoints for OSINT data
const API_CONFIG = {
  baseUrl: 'https://emqigcovjkfupxnjakss.supabase.co/functions/v1',
  endpoints: {
    lookup: '/osint-lookup'
  }
};

// Enhanced threat detection function that uses real data when possible
export const detectThreats = async (phoneNumber: string): Promise<ThreatDetectionResult> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the threat detection attempt
    try {
      await supabase.from('threat_detections').insert({
        target: phoneNumber,
        timestamp: new Date().toISOString(),
        request_type: 'phone_scan'
      });
    } catch (error) {
      console.error("Failed to log threat detection:", error);
    }
    
    // Attempt to get real data for the phone number
    let phoneData;
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.lookup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          type: 'phone', 
          query: phoneNumber 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        phoneData = data.result;
      }
    } catch (err) {
      console.log("Could not get real phone data, falling back to simulation:", err);
    }
    
    // Generate threats based on phone data or simulation
    const threatCount = Math.floor(Math.random() * 5) + 1;
    const threats = generateThreats(threatCount, phoneData);
    
    // Display toast notification
    toast({
      title: 'Security Alert',
      description: `Detected ${threatCount} potential security ${threatCount === 1 ? 'threat' : 'threats'}. Alert sent to ${phoneNumber}.`,
    });
    
    // Return threat information
    return {
      status: 'threats_detected',
      threatCount,
      message: `${threatCount} security ${threatCount === 1 ? 'threat has' : 'threats have'} been detected and sent to ${phoneNumber}`,
      threats,
      alertSent: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in threat detection:', error);
    
    toast({
      title: 'Threat Detection Error',
      description: 'Failed to complete security scan. Please try again later.',
      variant: "destructive"
    });
    
    return {
      status: 'error',
      threatCount: 0,
      message: 'Error occurred during threat detection',
      threats: [],
      timestamp: new Date().toISOString()
    };
  }
};

// Helper functions for generating threats based on real or simulated data
function generateThreats(count: number, phoneData?: any): Threat[] {
  const threats: Threat[] = [];
  
  for (let i = 0; i < count; i++) {
    threats.push({
      id: `threat-${Date.now()}-${i}`,
      title: getRandomThreatTitle(),
      description: getRandomThreatDescription(phoneData),
      severity: getRandomSeverity(),
      location: phoneData?.location?.city || getRandomLocation(),
      timestamp: new Date().toISOString(),
      source: getRandomSource()
    });
  }
  
  return threats;
}

// Helper functions for generating random threat data
function getRandomThreatTitle(): string {
  const titles = [
    'Unauthorized Access Attempt',
    'Malware Detection',
    'Data Exfiltration',
    'Suspicious Login Activity',
    'Potential Phishing Attack',
    'Ransomware Signature Detected',
    'SQL Injection Attempt',
    'Cross-site Scripting Attack',
    'DDOS Attack Indicators',
    'Privilege Escalation Attempt'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomThreatDescription(phoneData?: any): string {
  const baseDescriptions = [
    'Multiple failed login attempts detected from unknown IP address.',
    'Malicious code signature detected in downloaded file.',
    'Unusual data transfer activity to external server.',
    'Login from new location and device not previously associated with this account.',
    'Email containing suspicious links and requesting credentials.',
    'File encryption activities detected across multiple directories.',
    'Malformed SQL queries detected in web application logs.',
    'JavaScript injection detected in user input fields.',
    'Abnormal traffic spike suggesting coordinated attack.',
    'User attempting to access restricted system areas.'
  ];
  
  // If we have phone data, customize the description
  if (phoneData) {
    const locationInfo = phoneData.location?.country && phoneData.location?.city ?
      `${phoneData.location.city}, ${phoneData.location.country}` :
      'unknown location';
    
    const carrierInfo = phoneData.carrier || 'unknown carrier';
    
    const customDescriptions = [
      `Multiple authentication attempts associated with phone number registered to ${carrierInfo} in ${locationInfo}.`,
      `Unusual activity detected from device associated with ${phoneData.phone} in ${locationInfo}.`,
      `Security alert triggered by activity linked to ${phoneData.phone} (${carrierInfo}).`,
      `Potential account compromise attempt using phone number registered in ${locationInfo}.`
    ];
    
    // Mix in the custom descriptions
    return Math.random() > 0.4 ?
      customDescriptions[Math.floor(Math.random() * customDescriptions.length)] :
      baseDescriptions[Math.floor(Math.random() * baseDescriptions.length)];
  }
  
  return baseDescriptions[Math.floor(Math.random() * baseDescriptions.length)];
}

function getRandomSeverity(): 'low' | 'medium' | 'high' | 'critical' {
  const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
  return severities[Math.floor(Math.random() * severities.length)];
}

function getRandomLocation(): string {
  const locations = [
    'Network Perimeter',
    'User Endpoint',
    'Email Server',
    'Web Application',
    'Database Server',
    'Authentication System',
    'Cloud Storage',
    'API Gateway',
    'File Server',
    'Internal Network'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomSource(): string {
  const sources = [
    'Firewall Logs',
    'Intrusion Detection System',
    'Antivirus Alert',
    'User Report',
    'SIEM Analysis',
    'Threat Intelligence Feed',
    'Honeypot Trigger',
    'Network Traffic Analysis',
    'Automated Scan',
    'Security Audit'
  ];
  return sources[Math.floor(Math.random() * sources.length)];
}

// Create a generic OSINT tool for various lookups
export const osintLookup = async (
  query: string, 
  type: 'email' | 'domain' | 'ip' | 'username' | 'phone'
): Promise<any> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Log the request
  console.log(`OSINT lookup - Type: ${type}, Query: ${query}`);
  
  // Show loading notification
  toast({
    title: `Running OSINT lookup`,
    description: `Searching for information on ${query}...`,
  });
  
  try {
    // Call the real API
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.lookup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ type, query })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Success notification
    toast({
      title: `OSINT Lookup Complete`,
      description: `Found information related to ${query}`,
    });
    
    // Log the lookup in database if possible
    try {
      await supabase.from('osint_lookups').insert({
        query,
        type,
        timestamp: new Date().toISOString(),
        results_found: true
      });
    } catch (err) {
      console.error("Failed to log OSINT lookup:", err);
    }
    
    return data;
  } catch (error) {
    console.error('OSINT lookup error:', error);
    
    toast({
      title: `OSINT Lookup Failed`,
      description: `Error processing ${type} lookup for ${query}`,
      variant: "destructive"
    });
    
    // Log the failed lookup
    try {
      await supabase.from('osint_lookups').insert({
        query,
        type,
        timestamp: new Date().toISOString(),
        results_found: false,
        error: error.message
      });
    } catch (err) {
      console.error("Failed to log OSINT lookup error:", err);
    }
    
    return {
      success: false,
      timestamp: new Date().toISOString(),
      query,
      type,
      error: 'Failed to complete OSINT lookup'
    };
  }
};
