
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
  
  System Tools:
  - system: Display system status
  - matrix: Visual matrix effect
  
  Security Tools:
  - decrypt [target]: Attempt to decrypt target
  - crack [hash]: Attempt to crack password hash
  - keylogger [start|stop]: Control keylogger
  
  Web Tools:
  - sqli [url]: Test SQL injection
  - xss [url]: Test cross-site scripting
  
  Hardware Tools:
  - webcam: Check webcam status`;
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
