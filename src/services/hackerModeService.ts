
/**
 * Hacker Mode Service - Provides ethically simulated functions for the Hacker Mode interface
 * These are simulations only and do not perform actual hacking activities
 */

// Simulate network scanning (educational purposes only)
export const scanNetwork = async (): Promise<string> => {
  // This is a simulation that doesn't actually scan any network
  await simulateProcessingDelay(2000);
  
  return `Scanning network...\n[====================] 100%\nFound devices (simulation):\n- Server01 (192.168.1.101)\n- WorkStation02 (192.168.1.102)\n- PrinterXZ (192.168.1.103)\nScan complete.\n\nNote: This is an ethical simulation for educational purposes.`;
};

// Simulate decryption attempt (without actually decrypting anything)
export const attemptDecrypt = async (target?: string): Promise<string> => {
  if (!target) {
    return 'Usage: decrypt <target>';
  }
  
  await simulateProcessingDelay(2500);
  
  return `Simulating decryption of ${target}...\n[===============     ] 75%\nThis is an educational simulation.\nNo actual decryption is being performed.\n\nDemonstration complete.`;
};

// Simulate IP tracing using publicly available information
export const traceIP = async (ip?: string): Promise<string> => {
  if (!ip) {
    return 'Usage: trace <ip-address>';
  }
  
  await simulateProcessingDelay(1800);
  
  // Educational response for common IP patterns
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return `${ip} is a private IP address used in local networks.\nGeolocation: N/A (Local Network)\nPrivate IP addresses cannot be geolocated.`;
  }
  
  if (ip === '127.0.0.1' || ip === 'localhost') {
    return `${ip} is the localhost/loopback address.\nGeolocation: This Computer\nThe call is coming from inside the house!`;
  }
  
  return `Simulating IP trace for ${ip}...\nNote: This is an educational simulation using publicly available data.\nApproximate Location: Various (Public IP addresses can be broadly geolocated)\nISP: Various\n\nThis simulation is for educational purposes only.`;
};

// Get system status information
export const getSystemStatus = async (): Promise<string> => {
  await simulateProcessingDelay(800);
  
  const memory = Math.floor(Math.random() * 8) + 8;
  const cpu = Math.floor(Math.random() * 30) + 10;
  const now = new Date();
  
  return `J.A.R.V.I.S. System Status:\nCPU: ${cpu}% utilized\nRAM: ${memory} GB free\nNetwork: ACTIVE\nSecurity Status: MONITORING\nSystem Time: ${now.toLocaleTimeString()}\nSystem Date: ${now.toLocaleDateString()}\nUptime: ${Math.floor(Math.random() * 72) + 2} hours`;
};

// Simulate "The Matrix" effect for fun
export const simulateMatrix = async (): Promise<string> => {
  await simulateProcessingDelay(1000);
  
  // Generate some binary that looks like "The Matrix" code
  let matrixCode = 'Entering the Matrix...\n\n';
  
  for (let i = 0; i < 8; i++) {
    let line = '';
    for (let j = 0; j < 8; j++) {
      line += Math.random() > 0.5 ? '1' : '0';
      line += Math.random() > 0.5 ? '1' : '0';
      line += Math.random() > 0.5 ? '0' : '1';
      line += ' ';
    }
    matrixCode += line + '\n';
  }
  
  return `${matrixCode}\nVisual simulation complete. There is no spoon!`;
};

// Simulate keylogger for educational purposes
export const handleKeylogger = async (operation: string): Promise<string> => {
  await simulateProcessingDelay(1200);
  
  if (operation === 'start') {
    return `Educational keylogger simulation.\nNOTE: This is only a simulation! No actual keylogging is performed.\nSimulation purpose: To demonstrate how malicious software can capture keystrokes.\nSimulated log file: /tmp/keystroke_demo.log\nStatus: SIMULATED (Not actually running)`;
  } else {
    return `Educational keylogger simulation stopped.\nNo actual keylogging was performed.\nThis was an educational demonstration only.\nStatus: STOPPED`;
  }
};

// Simulate network scanning with more detail
export const performNetworkScan = async (range: string): Promise<string> => {
  await simulateProcessingDelay(3000);
  
  return `Simulating network scan on ${range}...\n
This is an EDUCATIONAL SIMULATION ONLY.
No actual network scanning is performed.

Simulated results for educational purposes:
[+] Gateway - Running common router firmware
[+] Workstation - Windows/Mac/Linux system
[+] Mobile - Android/iOS device
[+] IoT Device - Smart home equipment
[+] Server - Common server OS

Commonly open ports in networks: 22 (SSH), 80/443 (Web), 25 (Mail)

Educational note: Scanning networks without permission is illegal.
This simulation is for cybersecurity education only.
Scan simulation complete.`;
};

// Simulate port scanning (educational purposes)
export const scanPorts = async (target?: string): Promise<string> => {
  if (!target) {
    return 'Usage: ports <target>';
  }
  
  await simulateProcessingDelay(2800);
  
  return `Simulating port scan for ${target}...\n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATIONAL SIMULATION ONLY - NO ACTUAL SCANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Common open ports on servers:
* 22/tcp   [typically SSH]
* 80/tcp   [typically HTTP]
* 443/tcp  [typically HTTPS]
* 25/tcp   [typically SMTP]
* 21/tcp   [typically FTP]
* 3306/tcp [typically MySQL]

Note: Port scanning without explicit permission is illegal.
This is an educational demonstration only.
Scan simulation complete.`;
};

// Simulate password cracking (educational purposes)
export const simulatePasswordCrack = async (hash?: string): Promise<string> => {
  if (!hash) {
    return 'Usage: crack <hash-value>';
  }
  
  await simulateProcessingDelay(4000);
  
  return `Simulating password hash analysis for ${hash}...\n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATIONAL SIMULATION ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Password strength demonstration:
- Short passwords (< 8 chars): Vulnerable to brute force
- Dictionary words: Vulnerable to dictionary attacks
- Predictable patterns: Vulnerable to rule-based attacks
- No special chars/numbers: Reduced complexity

SECURITY EDUCATION NOTE:
Strong passwords are:
* 12+ characters
* Mix of upper/lowercase, numbers, symbols
* Not based on personal information
* Unique for each service

This is an educational demonstration only.
No actual password cracking occurred.`;
};

// Simulate SQL injection testing (educational)
export const simulateSQLInjection = async (target?: string): Promise<string> => {
  if (!target) {
    return 'Usage: sqli <target-url>';
  }
  
  await simulateProcessingDelay(2500);
  
  return `Simulating SQL injection educational analysis for ${target}...\n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATIONAL SIMULATION ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SQL Injection Prevention Methods:
1. Use parameterized queries/prepared statements
2. Input validation and sanitization
3. Principle of least privilege for DB users
4. Use ORM frameworks with security features
5. Regular security testing

Example vulnerable code:
\`\`\`
$query = "SELECT * FROM users WHERE username = '" . $_GET['user'] . "'";
\`\`\`

Secure alternative:
\`\`\`
$stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $_GET['user']);
\`\`\`

This is an educational demonstration only.
No actual testing performed.`;
};

// Simulate XSS testing (educational)
export const simulateXSS = async (target?: string): Promise<string> => {
  if (!target) {
    return 'Usage: xss <target-url>';
  }
  
  await simulateProcessingDelay(2200);
  
  return `Simulating XSS vulnerability educational analysis for ${target}...\n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATIONAL SIMULATION ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

XSS Prevention Methods:
1. Output encoding (HTML, JavaScript, CSS, URL)
2. Content Security Policy (CSP) implementation
3. Input validation and sanitization
4. Use modern frameworks that auto-escape content
5. HttpOnly and Secure cookie flags

Example vulnerable code:
\`\`\`
document.getElementById("output").innerHTML = userInput;
\`\`\`

Secure alternative:
\`\`\`
const textNode = document.createTextNode(userInput);
document.getElementById("output").appendChild(textNode);
\`\`\`

This is an educational demonstration only.
No actual testing performed.`;
};

// Simulate WebCam access check (educational)
export const simulateWebcamCheck = async (): Promise<string> => {
  await simulateProcessingDelay(1500);
  
  return `Simulating webcam security check...\n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATIONAL SIMULATION ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Webcam Security Best Practices:
1. Cover webcam when not in use
2. Use browser permissions to control access
3. Monitor which applications have camera permissions
4. Keep device firmware and software updated
5. Use security software that alerts on unauthorized access

This is an educational demonstration only.
No actual webcam access attempted.`;
};

// Helper function to simulate processing time
const simulateProcessingDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if code phrase is correct to activate hacker mode
export const validateHackerCode = (code: string): boolean => {
  return code.toLowerCase() === "code zero";
};

// Get help information for all commands
export const getHackerModeHelp = async (): Promise<string> => {
  await simulateProcessingDelay(500);
  
  return `
J.A.R.V.I.S. ETHICAL HACKING SIMULATOR - EDUCATIONAL USE ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available commands:
- scan : Simulate local network device discovery
- decrypt <target> : Simulate decryption process
- trace <ip> : Simulate IP geolocation
- system : Show system status
- matrix : Visual matrix effect
- keylogger <start|stop> : Educational keylogging simulation
- netscan <ip-range> : Educational network scanning simulation
- ports <target> : Educational port scanning simulation
- crack <hash> : Educational password hash analysis
- sqli <target> : SQL injection prevention education
- xss <target> : XSS vulnerability prevention education
- webcam : Webcam security educational check
- help : Show this help

NOTE: This is an EDUCATIONAL TOOL ONLY. All "scans" and "tests" 
are simulations for cybersecurity education. No actual hacking
or network intrusion is performed.

Type "deactivate" to exit hacker mode.`;
};
