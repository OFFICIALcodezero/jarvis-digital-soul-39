
// This service handles threat detection functionality
// It simulates sending alerts to a user's device via WhatsApp

type ThreatResult = {
  status: 'threats_detected' | 'no_threats' | 'error';
  threatCount?: number;
  threats?: {
    id: string;
    title: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
    timestamp: string;
  }[];
  message?: string;
};

export const detectThreats = async (phoneNumber: string): Promise<ThreatResult> => {
  console.log(`Simulating threat detection and sending alerts to ${phoneNumber}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly determine if threats are detected (for demo purposes)
  const hasThreats = Math.random() > 0.5;
  
  if (hasThreats) {
    const threatCount = Math.floor(Math.random() * 3) + 1;
    const threats = Array(threatCount).fill(0).map((_, i) => ({
      id: `threat-${Date.now()}-${i}`,
      title: [
        'Unauthorized Access Attempt', 
        'Data Exfiltration', 
        'Suspicious Network Activity', 
        'Malware Detected'
      ][Math.floor(Math.random() * 4)],
      severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      location: [
        'Network Perimeter', 
        'Internal Database', 
        'User Workstation', 
        'Cloud Storage'
      ][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString()
    }));
    
    console.log(`Alert sent to ${phoneNumber} about ${threatCount} threats`);
    
    return {
      status: 'threats_detected',
      threatCount,
      threats
    };
  } else {
    console.log(`No threats detected, sending all-clear to ${phoneNumber}`);
    
    return {
      status: 'no_threats',
      message: 'No security threats detected at this time.'
    };
  }
};
