
import { toast } from '@/components/ui/use-toast';
import { findServiceByCommand, executeService } from './serviceRegistry';

// Process a message to determine if it's a service command
export async function processServiceCommand(message: string): Promise<{ 
  handled: boolean;
  response?: any;
}> {
  // Find a service that matches the command
  const service = findServiceByCommand(message);
  
  if (!service) {
    return { handled: false };
  }
  
  try {
    // Extract parameters from the message
    const params = extractParamsFromMessage(message, service.commands);
    
    // Execute the service
    const response = await executeService(service.id, params);
    
    return {
      handled: true,
      response
    };
  } catch (error) {
    console.error(`Error executing service ${service.id}:`, error);
    
    toast({
      title: "Service Error",
      description: error instanceof Error ? error.message : "An error occurred with this service",
      variant: "destructive"
    });
    
    return {
      handled: true,
      response: {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    };
  }
}

// Extract parameters from a message based on the command
function extractParamsFromMessage(message: string, commands: string[]): any {
  const lowerMessage = message.toLowerCase();
  
  // Find which command was used
  let usedCommand = '';
  for (const cmd of commands) {
    if (lowerMessage.includes(cmd.toLowerCase())) {
      usedCommand = cmd;
      break;
    }
  }
  
  if (!usedCommand) {
    return {};
  }
  
  // Extract the query (everything after the command)
  const cmdIndex = lowerMessage.indexOf(usedCommand.toLowerCase());
  const afterCmd = message.slice(cmdIndex + usedCommand.length).trim();
  
  // Basic parameter extraction
  const params: any = {
    query: afterCmd,
    rawMessage: message
  };
  
  // Location parameter extraction
  if (message.toLowerCase().includes('in ')) {
    const locationMatch = message.match(/\b(?:in|at|near|for)\s+([a-zA-Z\s,]+)(?:\s|$)/i);
    if (locationMatch && locationMatch[1]) {
      params.location = locationMatch[1].trim();
    }
  }
  
  // Time parameter extraction
  if (message.toLowerCase().includes('at ')) {
    const timeMatch = message.match(/\bat\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (timeMatch && timeMatch[1]) {
      params.time = timeMatch[1].trim();
    }
  }
  
  // Date parameter extraction
  if (message.toLowerCase().includes('on ')) {
    const dateMatch = message.match(/\bon\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?)/i);
    if (dateMatch && dateMatch[1]) {
      params.date = dateMatch[1].trim();
    }
  }
  
  return params;
}

// Format a service response for display
export function formatServiceResponse(service: string, response: any): string {
  if (!response || !response.success) {
    return response?.message || `The ${service} service is not available or encountered an error.`;
  }
  
  switch (service) {
    case 'weather':
      return `Current weather in ${response.location}: ${response.temperature}°C, ${response.condition}. Humidity: ${response.humidity}%, Wind: ${response.windSpeed} km/h.`;
    
    case 'youtube':
      return `Playing video: "${response.message}"`;
    
    case 'time':
      return `Current time: ${response.time} (${response.timezone})`;
    
    default:
      return response.message || `The ${service} service responded successfully.`;
  }
}
