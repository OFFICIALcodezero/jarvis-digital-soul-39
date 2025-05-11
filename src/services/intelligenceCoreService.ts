
import { generateImage } from './imageGenerationService';
import { toast } from '@/components/ui/sonner';

export type IntelligenceType = 'personal' | 'professional' | 'creative' | 'recon' | 'ghost' | 'environmental';

export interface IntelligenceRequest {
  type: IntelligenceType;
  prompt: string;
  context?: any;
  stream?: boolean;
}

export interface IntelligenceResponse {
  type: IntelligenceType;
  content: string;
  metadata?: any;
}

class IntelligenceCoreService {
  constructor() {
    console.log('Intelligence Core Service initialized');
  }

  public async processRequest(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    try {
      switch (request.type) {
        case 'personal':
          return this.handlePersonalQuery(request.prompt);
        case 'professional':
          return this.handleProfessionalQuery(request.prompt);
        case 'creative':
          return this.handleCreativeQuery(request);
        case 'recon':
          return this.handleReconQuery(request);
        case 'ghost':
          return this.handleGhostQuery(request);
        case 'environmental':
          return this.handleEnvironmentalQuery(request.prompt);
        default:
          return {
            type: 'personal',
            content: 'I am sorry, but I cannot process this request type.'
          };
      }
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private async handlePersonalQuery(prompt: string): Promise<IntelligenceResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      type: 'personal',
      content: `Acknowledged: ${prompt}. Processing personal context...`
    };
  }

  private async handleProfessionalQuery(prompt: string): Promise<IntelligenceResponse> {
    await new Promise(resolve => setTimeout(resolve, 750));
    return {
      type: 'professional',
      content: `Executing professional task: ${prompt}. Analyzing data...`
    };
  }

  private async handleCreativeQuery(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    try {
      if (request.prompt.toLowerCase().startsWith('image:')) {
        const imageDescription = request.prompt.substring(6).trim();
        // Pass an object with prompt property instead of a string
        const imageUrl = await generateImage({
          prompt: imageDescription
        });
        
        return {
          type: 'creative',
          content: `Image generated: ${imageUrl}`,
          metadata: { imageUrl }
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          type: 'creative',
          content: `Creating content for: ${request.prompt}. Generating creative output...`
        };
      }
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private async handleReconQuery(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    await new Promise(resolve => setTimeout(resolve, 1250));
    
    // Simulate recon data
    const dataCollected = ['network-scan', 'vulnerability-scan', 'port-scan'];
    const patternConfidence = Math.random();
    
    return {
      type: 'recon',
      content: `Running reconnaissance on: ${request.prompt}. Gathering intel...`,
      metadata: {
        dataCollected,
        patternConfidence
      }
    };
  }

  private async handleGhostQuery(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate ghost AI activity
    const detectedThreats = ['malware', 'intrusion-attempt'];
    const patternRecognition = { 'unusual-traffic': 0.85, 'data-breach': 0.92 };
    
    return {
      type: 'ghost',
      content: `Executing ghost protocol on: ${request.prompt}. Analyzing system logs...`,
      metadata: {
        detectedThreats,
        patternRecognition
      }
    };
  }
  
  private async handleEnvironmentalQuery(prompt: string): Promise<IntelligenceResponse> {
    try {
      // Fetch real environmental data
      const data = await this.fetchEnvironmentalData();
      
      return {
        type: 'environmental',
        content: `Environmental data analysis complete. ${data.summary}`,
        metadata: data
      };
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      return {
        type: 'environmental',
        content: 'I encountered an issue retrieving environmental data. Please try again later.',
        metadata: { error: true }
      };
    }
  }
  
  private async fetchEnvironmentalData() {
    // Simulate API fetch with a delay to show loading state properly
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real implementation, this would be an API call
    return {
      temperature: {
        value: 23.5,
        unit: '°C'
      },
      humidity: {
        value: 68,
        unit: '%'
      },
      airQuality: {
        index: 42,
        status: 'Good'
      },
      summary: 'Current conditions show a temperature of 23.5°C with 68% humidity. Air quality is Good with an AQI of 42.',
      timestamp: new Date().toISOString()
    };
  }

  private handleError(error: Error): IntelligenceResponse {
    console.error("Intelligence core error:", error);
    toast("Processing Error", {
      description: "The intelligence core encountered an error."
    });
    return {
      type: 'personal',
      content: 'I encountered an error while processing your request.'
    };
  }
}

export const intelligenceCore = new IntelligenceCoreService();
