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
