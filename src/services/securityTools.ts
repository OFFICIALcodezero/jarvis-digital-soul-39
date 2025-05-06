// Mock security scanning functions for frontend demonstration
export const scanNetwork = async (subnet: string): Promise<any[]> => {
  // Simulate network scanning
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { ip: '192.168.1.1', type: 'Router', status: 'Active' },
    { ip: '192.168.1.100', type: 'Computer', status: 'Active' },
    { ip: '192.168.1.101', type: 'Smartphone', status: 'Active' }
  ];
};

export const portScan = async (ip: string, portRange: string): Promise<number[]> => {
  // Simulate port scanning
  await new Promise(resolve => setTimeout(resolve, 800));
  return [80, 443, 8080];
};

export const serviceDetection = async (ip: string, port: number): Promise<string> => {
  // Simulate service detection
  await new Promise(resolve => setTimeout(resolve, 500));
  return 'HTTP Server';
};