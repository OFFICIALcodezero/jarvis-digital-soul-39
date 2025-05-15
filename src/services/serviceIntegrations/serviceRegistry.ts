
// Service Registry - Central place to manage all third-party service integrations

// Service types
export type ServiceType = 
  | 'email'
  | 'auth'
  | 'automation'
  | 'location'
  | 'messaging'
  | 'search'
  | 'image'
  | 'pdf'
  | 'audio'
  | 'pets'
  | 'weather'
  | 'video'
  | 'finance'
  | 'data'
  | 'time'
  | 'coding';

// Integration status
export type IntegrationStatus = 'available' | 'configured' | 'notConfigured';

// Service integration interface
export interface ServiceIntegration {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  commands: string[];
  status: IntegrationStatus;
  configureUrl?: string;
  setupInstructions?: string;
  handler: (params: any) => Promise<any>;
}

// Registry of all available service integrations
const serviceRegistry: Map<string, ServiceIntegration> = new Map();

// Register a service
export function registerService(service: ServiceIntegration): void {
  serviceRegistry.set(service.id, service);
}

// Get a service by ID
export function getService(id: string): ServiceIntegration | undefined {
  return serviceRegistry.get(id);
}

// Get all services
export function getAllServices(): ServiceIntegration[] {
  return Array.from(serviceRegistry.values());
}

// Get services by type
export function getServicesByType(type: ServiceType): ServiceIntegration[] {
  return Array.from(serviceRegistry.values()).filter(service => service.type === type);
}

// Check if a command matches any service
export function findServiceByCommand(command: string): ServiceIntegration | undefined {
  const lowerCommand = command.toLowerCase();
  
  for (const service of serviceRegistry.values()) {
    if (service.commands.some(cmd => lowerCommand.includes(cmd.toLowerCase()))) {
      return service;
    }
  }
  
  return undefined;
}

// Execute a service by its ID
export async function executeService(id: string, params: any): Promise<any> {
  const service = serviceRegistry.get(id);
  if (!service) {
    throw new Error(`Service ${id} not found`);
  }
  
  if (service.status === 'notConfigured') {
    throw new Error(`Service ${service.name} is not configured. Please configure it first.`);
  }
  
  return await service.handler(params);
}
