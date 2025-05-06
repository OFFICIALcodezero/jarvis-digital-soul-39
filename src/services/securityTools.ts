
import { spawn } from 'child_process';

interface ScanResult {
  ip: string;
  ports: number[];
  os?: string;
  status: string;
}

export const scanNetwork = async (target: string): Promise<ScanResult[]> => {
  return new Promise((resolve, reject) => {
    const results: ScanResult[] = [];
    const nmap = spawn('nmap', ['-sS', '-O', target]);

    nmap.stdout.on('data', (data) => {
      const output = data.toString();
      // Parse nmap output and build results
      const matches = output.match(/\d+\.\d+\.\d+\.\d+/g);
      if (matches) {
        matches.forEach(ip => {
          results.push({
            ip,
            ports: [80, 443], // Example ports, actual parsing would be more complex
            status: 'up'
          });
        });
      }
    });

    nmap.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Scan failed'));
      } else {
        resolve(results);
      }
    });
  });
};

export const portScan = async (ip: string, portRange: string): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const openPorts: number[] = [];
    const nmap = spawn('nmap', ['-p', portRange, ip]);

    nmap.stdout.on('data', (data) => {
      const output = data.toString();
      // Parse for open ports
      const portMatches = output.match(/(\d+)\/tcp\s+open/g);
      if (portMatches) {
        portMatches.forEach(match => {
          const port = parseInt(match.split('/')[0]);
          openPorts.push(port);
        });
      }
    });

    nmap.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Port scan failed'));
      } else {
        resolve(openPorts);
      }
    });
  });
};

export const serviceDetection = async (ip: string, port: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const nmap = spawn('nmap', ['-sV', '-p', port.toString(), ip]);
    let service = '';

    nmap.stdout.on('data', (data) => {
      const output = data.toString();
      // Parse service version
      const serviceMatch = output.match(/(\d+)\/tcp\s+open\s+(\w+)\s+(.*)/);
      if (serviceMatch) {
        service = serviceMatch[3];
      }
    });

    nmap.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Service detection failed'));
      } else {
        resolve(service);
      }
    });
  });
};
