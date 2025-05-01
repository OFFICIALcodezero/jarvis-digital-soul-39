
export const validateHackerCode = (message: string): boolean => {
  const lowerCaseMessage = message.toLowerCase();
  return lowerCaseMessage === 'code zero';
};

// Array of possible hacker mode terminal lines for visual effect
export const hackerModeLines = [
  "Initializing secure terminal...",
  "Bypassing security protocols...",
  "Accessing mainframe...",
  "Decrypting secured channels...",
  "Establishing connection to satellite network...",
  "Scanning for vulnerabilities...",
  "Analyzing network traffic...",
  "Injecting payload...",
  "Breaching firewall...",
  "Executing remote commands...",
  "Scanning for active threats...",
  "Deploying countermeasures...",
  "Routing through proxies...",
  "Exploiting zero-day vulnerability...",
  "Mapping target infrastructure...",
  "Extracting sensitive data...",
  "Covering tracks...",
  "Intercepting transmissions...",
  "Tracing hostile signals...",
  "Activating stealth protocols..."
];

export const executeHackerCommand = (command: string): string => {
  const lowerCaseCommand = command.toLowerCase();

  switch (lowerCaseCommand) {
    case 'help':
      return `Available commands:
      - help: Displays available commands.
      - clear: Clears the terminal.
      - scan: Initiates a system scan.
      - connect [ip]: Attempts to connect to the specified IP address.
      - decrypt [file]: Attempts to decrypt the specified file.
      - exit: Deactivates hacker mode.`;
    case 'clear':
      return ''; // Clear the terminal
    case 'scan':
      return 'Initiating system scan... analyzing vulnerabilities...';
    case 'exit':
      return 'Deactivating hacker mode... returning to standard interface.';
    default:
      if (lowerCaseCommand.startsWith('connect ')) {
        const ipAddress = lowerCaseCommand.substring(8);
        return `Attempting to connect to ${ipAddress}... establishing secure connection...`;
      } else if (lowerCaseCommand.startsWith('decrypt ')) {
        const file = lowerCaseCommand.substring(8);
        return `Attempting to decrypt ${file}... processing encryption keys...`;
      }
      return `Command not recognized. Type 'help' for available commands.`;
  }
};

// Add missing function implementations for HackerMode component
export const scanNetwork = async (): Promise<string> => {
  await delay(1000);
  return "Network scan complete. Found 12 devices. 3 potential vulnerabilities detected.";
};

export const attemptDecrypt = async (target: string = "file"): Promise<string> => {
  await delay(1500);
  return `Decryption of ${target} in progress... 
  [####################] 100% 
  Decryption complete. Access granted.`;
};

export const traceIP = async (ip: string = "192.168.1.1"): Promise<string> => {
  await delay(2000);
  return `Tracing IP ${ip}...
  Route identified through 7 nodes.
  Origin appears to be: San Francisco, CA, USA
  Using proxy: Yes`;
};

export const getSystemStatus = async (): Promise<string> => {
  await delay(800);
  return `System Status:
  CPU: 42% utilized
  RAM: 1.3 GB / 8 GB
  Network: Active (125 Mbps)
  Security: All firewalls active
  Vulnerabilities: None detected
  Last breach attempt: 3 days ago`;
};

export const simulateMatrix = async (): Promise<string> => {
  await delay(500);
  let output = "Initiating Matrix sequence...\n";
  
  for (let i = 0; i < 15; i++) {
    output += generateRandomMatrixLine() + "\n";
  }
  
  output += "\nMatrix simulation complete.";
  return output;
};

export const handleKeylogger = async (operation: string): Promise<string> => {
  await delay(700);
  if (operation === "start") {
    return "Keylogger started. Monitoring keystrokes on target system.";
  } else {
    return "Keylogger stopped. Log file saved to /tmp/keylog.txt";
  }
};

export const performNetworkScan = async (range: string): Promise<string> => {
  await delay(2500);
  return `Scanning network range ${range}...
  Scan complete.
  Found 23 active hosts.
  Details:
  - 5 Windows systems
  - 8 Linux servers
  - 3 IoT devices
  - 7 mobile devices`;
};

export const scanPorts = async (target: string = "localhost"): Promise<string> => {
  await delay(1800);
  return `Port scan on ${target} complete.
  Open ports:
  - 22 (SSH)
  - 80 (HTTP)
  - 443 (HTTPS)
  - 3306 (MySQL)
  - 5432 (PostgreSQL)`;
};

export const simulatePasswordCrack = async (hash?: string): Promise<string> => {
  await delay(3000);
  const password = hash ? "7h3_p4$$w0rd!" : "admin123";
  return `Password cracking complete.
  Hash: ${hash || "5f4dcc3b5aa765d61d8327deb882cf99"}
  Cracked value: ${password}
  Time taken: 42.3 seconds`;
};

export const simulateSQLInjection = async (target: string = "login.php"): Promise<string> => {
  await delay(1500);
  return `SQL Injection attack on ${target}:
  Testing common vectors...
  Vulnerability found: Unfiltered input on 'username' field
  Payload: ' OR 1=1 --
  Result: Authentication bypassed!`;
};

export const simulateXSS = async (target: string = "comments.php"): Promise<string> => {
  await delay(1200);
  return `Cross-Site Scripting test on ${target}:
  Testing vectors...
  Vulnerability found: Unvalidated input
  Payload: <script>alert('XSS')</script>
  Result: Script executed on target page!`;
};

export const simulateWebcamCheck = async (): Promise<string> => {
  await delay(2200);
  return `Checking for webcam access...
  Webcam detected: HD Camera
  Status: Inactive
  Protection: Active (requires user permission)
  Bypass: Not attempted`;
};

// NEW HACKING TOOLS ADDED BELOW
export const simulatePhishing = async (target: string = "users"): Promise<string> => {
  await delay(2600);
  return `Phishing simulation targeting ${target}:
  Creating fake login page...
  Deploying email templates...
  Tracking clicks and credentials...
  Results:
  - Emails sent: 100
  - Opened: 73
  - Clicked link: 45
  - Entered credentials: 27
  Vulnerability assessment: MEDIUM (27% susceptibility)`;
};

export const simulateRansomware = async (target: string = "system"): Promise<string> => {
  await delay(3000);
  return `Ransomware simulation for ${target}:
  Scanning file system...
  Identifying critical data...
  Simulating encryption process...
  Testing recovery methods...
  Result: ${Math.random() > 0.5 ? 'Vulnerable' : 'Protected'} to ransomware attacks
  Recommended actions: 
  - Implement offline backups
  - Update security patches
  - Add ransomware protection to endpoint security`;
};

export const simulateSocialEngineering = async (target: string = "organization"): Promise<string> => {
  await delay(2400);
  const techniques = ["Pretexting", "Baiting", "Quid pro quo", "Tailgating", "Vishing"];
  const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
  
  return `Social Engineering analysis for ${target}:
  Selected technique: ${randomTechnique}
  Creating attack scenario...
  Simulating employee responses...
  Analyzing results...
  Vulnerability score: ${Math.floor(Math.random() * 100)}%
  Critical findings:
  - ${Math.floor(Math.random() * 30)}% of employees likely to comply with requests
  - Main weakness: ${Math.random() > 0.5 ? 'Phone-based attacks' : 'Email-based attacks'}
  - Recommendation: Security awareness training`;
};

export const simulateWirelessAttack = async (ssid: string = "Target_WiFi"): Promise<string> => {
  await delay(2800);
  const methods = ["WPA2 Handshake Capture", "Evil Twin", "Deauthentication", "KRACK Attack"];
  const randomMethod = methods[Math.floor(Math.random() * methods.length)];
  
  return `Wireless network assessment for ${ssid}:
  Selected method: ${randomMethod}
  Scanning available networks...
  Found target network: ${ssid}
  Signal strength: ${Math.floor(Math.random() * 30) + 70}%
  Security: ${Math.random() > 0.3 ? 'WPA2' : 'WPA3'}
  Vulnerability assessment: ${Math.random() > 0.5 ? 'VULNERABLE' : 'SECURED'}
  Simulation complete - no actual penetration attempted`;
};

export const simulateDarkwebScan = async (query: string = "credentials"): Promise<string> => {
  await delay(3500);
  const findings = Math.floor(Math.random() * 50);
  
  return `Dark Web scan for "${query}" complete:
  Searched: 27 marketplaces and forums
  Findings: ${findings} matches
  ${findings > 0 ? 
    `Data types found:
    - Email addresses: ${Math.floor(Math.random() * 20)}
    - Password hashes: ${Math.floor(Math.random() * 15)}
    - Credit card information: ${Math.floor(Math.random() * 5)}
    - Personal documents: ${Math.floor(Math.random() * 3)}
    
    Earliest breach: ${new Date(Date.now() - Math.floor(Math.random() * 1000) * 24 * 60 * 60 * 1000).toLocaleDateString()}
    Most recent breach: ${new Date(Date.now() - Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000).toLocaleDateString()}`
    : "No data found on monitored sites"}`;
};

export const performBinaryAnalysis = async (file: string = "suspicious.exe"): Promise<string> => {
  await delay(2700);
  
  return `Binary analysis of ${file}:
  File type: ${Math.random() > 0.5 ? 'PE32 executable' : 'ELF 64-bit LSB executable'}
  File size: ${Math.floor(Math.random() * 10000) + 500} KB
  MD5: ${generateRandomHash('md5')}
  SHA256: ${generateRandomHash('sha256')}
  
  Static analysis:
  - Compiler: ${Math.random() > 0.5 ? 'Microsoft Visual C++' : 'GCC'}
  - Packed: ${Math.random() > 0.7 ? 'Yes (UPX)' : 'No'}
  - Strings found: ${Math.floor(Math.random() * 1000) + 200}
  
  Dynamic analysis:
  - Creates files: ${Math.random() > 0.6 ? 'Yes' : 'No'}
  - Network activity: ${Math.random() > 0.5 ? 'Yes (connects to ' + generateRandomIP() + ')' : 'No'}
  - Registry modifications: ${Math.random() > 0.4 ? 'Yes' : 'No'}
  
  Verdict: ${Math.random() > 0.5 ? 'MALICIOUS' : 'POTENTIALLY UNWANTED PROGRAM'}`;
};

export const simulateDoS = async (target: string = "target-server.com"): Promise<string> => {
  await delay(2500);
  const methods = ["TCP SYN Flood", "UDP Flood", "HTTP Flood", "Slowloris", "ICMP Flood"];
  const randomMethod = methods[Math.floor(Math.random() * methods.length)];
  
  return `DoS simulation against ${target}:
  Selected method: ${randomMethod}
  Initializing virtual attack nodes...
  
  Simulating distributed attack pattern...
  Target response time: ${Math.floor(Math.random() * 5000) + 500}ms
  Server load: ${Math.floor(Math.random() * 90) + 10}%
  
  Vulnerability assessment:
  - Rate limiting: ${Math.random() > 0.5 ? 'Present' : 'Absent'}
  - Load balancing: ${Math.random() > 0.5 ? 'Detected' : 'Not detected'}
  - WAF: ${Math.random() > 0.5 ? 'Present' : 'Absent'}
  
  Result: Target ${Math.random() > 0.5 ? 'VULNERABLE' : 'PROTECTED'} against ${randomMethod}
  
  Note: This is a simulation only. No actual attack performed.`;
};

export const simulateForensicAnalysis = async (evidence: string = "disk_image"): Promise<string> => {
  await delay(3200);
  
  const findings = [
    "Deleted files recovered",
    "Hidden partitions detected",
    "Encrypted container found",
    "Timestamp manipulation evidence",
    "Anti-forensics techniques detected",
    "Browser history recovered despite clearing",
    "Steganography detected in image files",
    "Alternative data streams containing hidden data"
  ];
  
  // Select 3-5 random findings
  const selectedFindings = [];
  const numFindings = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < numFindings; i++) {
    const randomIndex = Math.floor(Math.random() * findings.length);
    selectedFindings.push(findings[randomIndex]);
    findings.splice(randomIndex, 1);
  }
  
  return `Forensic analysis of ${evidence}:
  Analysis type: Deep scan with file carving
  Duration: ${Math.floor(Math.random() * 120) + 30} minutes
  
  Key findings:
  ${selectedFindings.map(f => `- ${f}`).join('\n  ')}
  
  Timeline analysis:
  - First activity: ${new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString()}
  - Last activity: ${new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
  - Peak activity period: Between ${Math.floor(Math.random() * 12) + 1}:00 and ${Math.floor(Math.random() * 12) + 13}:00
  
  Analysis complete. Evidence chain maintained.`;
};

export const simulateAIPersonaGeneration = async (target: string = "individual"): Promise<string> => {
  await delay(2900);
  const sources = ["social media", "public records", "data breaches", "web presence analysis"];
  
  return `AI Persona Generation for target ${target}:
  
  Building digital footprint from ${Math.floor(Math.random() * 3) + 2} sources:
  ${sources.slice(0, Math.floor(Math.random() * 3) + 2).map(s => `- ${s}`).join('\n  ')}
  
  Creating behavioral profile...
  Generating speech patterns...
  Building social graph...
  
  Persona creation complete:
  - Confidence score: ${Math.floor(Math.random() * 40) + 60}%
  - Data points analyzed: ${Math.floor(Math.random() * 5000) + 1000}
  - Voice match accuracy: ${Math.floor(Math.random() * 30) + 70}%
  - Writing style match: ${Math.floor(Math.random() * 25) + 75}%
  
  SECURITY ALERT: This demonstrates how easily digital identity can be simulated.
  Recommendation: Enhanced authentication systems required.`;
};

export const getHackerModeHelp = async (): Promise<string> => {
  await delay(500);
  return `Available Hacker Commands:
  
  Basic Commands:
  - help: Display this help message
  - clear: Clear terminal screen
  - exit: Exit hacker mode
  
  Network Tools:
  - scan: Quick scan of local network
  - netscan [range]: Scan IP range (e.g., 192.168.1.0/24)
  - ports [host]: Scan open ports on target host
  - trace [ip]: Trace route to IP address
  - wifi [ssid]: Test wireless network security
  - dos [target]: Simulate DoS attack capabilities
  
  System Tools:
  - system: Display system status
  - matrix: Visual matrix effect
  - binary [file]: Analyze binary file
  - forensic [evidence]: Perform forensic analysis
  
  Security Tools:
  - decrypt [target]: Attempt to decrypt target
  - crack [hash]: Attempt to crack password hash
  - keylogger [start|stop]: Control keylogger
  - webcam: Check webcam security
  
  Social Engineering:
  - phish [target]: Simulate phishing campaign
  - social [target]: Test social engineering resilience
  - persona [target]: Generate AI persona based on target
  
  Web Tools:
  - sqli [url]: Test SQL injection
  - xss [url]: Test cross-site scripting
  
  Intelligence Tools:
  - darkweb [query]: Scan dark web for information
  - ransomware [system]: Simulate ransomware protection test`;
};

// Helper functions
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateRandomMatrixLine = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?";
  let line = '';
  const length = Math.floor(Math.random() * 50) + 30;
  
  for (let i = 0; i < length; i++) {
    line += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return line;
};

const generateRandomHash = (type: 'md5' | 'sha256'): string => {
  const chars = "0123456789abcdef";
  let hash = '';
  const length = type === 'md5' ? 32 : 64;
  
  for (let i = 0; i < length; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return hash;
};

const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};
