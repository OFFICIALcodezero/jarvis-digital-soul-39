
import { toast } from '@/components/ui/use-toast';
import { registerService, ServiceIntegration } from './serviceRegistry';

// Example of a service registration - need to implement real ones
const emailService: ServiceIntegration = {
  id: 'resend',
  name: 'Resend',
  type: 'email',
  description: 'Send emails through Resend API',
  commands: ['send email', 'email', 'resend'],
  status: 'notConfigured',
  configureUrl: 'https://resend.com/api-keys',
  setupInstructions: 'Sign up at resend.com and create an API key',
  handler: async (params) => {
    toast({
      title: "Resend Email Service",
      description: "Would send an email if configured. Please add your Resend API key."
    });
    
    return {
      success: false,
      message: "Email service not configured. Please add your Resend API key."
    };
  }
};

const authService: ServiceIntegration = {
  id: 'clerk',
  name: 'Clerk',
  type: 'auth',
  description: 'User authentication through Clerk',
  commands: ['login', 'signup', 'auth', 'clerk'],
  status: 'notConfigured',
  configureUrl: 'https://dashboard.clerk.com/',
  setupInstructions: 'Sign up at clerk.com and set up your application',
  handler: async (params) => {
    toast({
      title: "Clerk Authentication",
      description: "Would handle authentication if configured. Please add your Clerk publishable key."
    });
    
    return {
      success: false,
      message: "Auth service not configured. Please add your Clerk publishable key."
    };
  }
};

const automationService: ServiceIntegration = {
  id: 'make',
  name: 'Make',
  type: 'automation',
  description: 'Automation workflows with Make',
  commands: ['automate', 'make', 'workflow'],
  status: 'notConfigured',
  configureUrl: 'https://www.make.com/',
  setupInstructions: 'Sign up at make.com and create your workflows',
  handler: async (params) => {
    toast({
      title: "Make Automation",
      description: "Would trigger an automation if configured. Please set up your Make integration."
    });
    
    return {
      success: false,
      message: "Automation service not configured. Please set up your Make integration."
    };
  }
};

const locationService: ServiceIntegration = {
  id: 'mapbox',
  name: 'Mapbox',
  type: 'location',
  description: 'Location search and mapping with Mapbox',
  commands: ['find location', 'search location', 'map', 'mapbox'],
  status: 'notConfigured',
  configureUrl: 'https://account.mapbox.com/',
  setupInstructions: 'Sign up at mapbox.com and create an access token',
  handler: async (params) => {
    toast({
      title: "Mapbox Location Service",
      description: "Would search for locations if configured. Please add your Mapbox access token."
    });
    
    return {
      success: false,
      message: "Location service not configured. Please add your Mapbox access token."
    };
  }
};

const messagingService: ServiceIntegration = {
  id: 'twilio',
  name: 'Twilio',
  type: 'messaging',
  description: 'SMS, calls and messaging with Twilio',
  commands: ['send message', 'call', 'text', 'twilio'],
  status: 'notConfigured',
  configureUrl: 'https://www.twilio.com/console',
  setupInstructions: 'Sign up at twilio.com and get your account SID and auth token',
  handler: async (params) => {
    toast({
      title: "Twilio Messaging Service",
      description: "Would send a message or make a call if configured. Please add your Twilio credentials."
    });
    
    return {
      success: false,
      message: "Messaging service not configured. Please add your Twilio credentials."
    };
  }
};

const searchService: ServiceIntegration = {
  id: 'serper',
  name: 'Serper.dev',
  type: 'search',
  description: 'Web search through Serper.dev API',
  commands: ['search', 'serper', 'web search'],
  status: 'notConfigured',
  configureUrl: 'https://serper.dev/',
  setupInstructions: 'Sign up at serper.dev and get your API key',
  handler: async (params) => {
    toast({
      title: "Serper Search Service",
      description: "Would perform a web search if configured. Please add your Serper API key."
    });
    
    return {
      success: false,
      message: "Search service not configured. Please add your Serper API key."
    };
  }
};

const imageService: ServiceIntegration = {
  id: 'bannerbear',
  name: 'Bannerbear',
  type: 'image',
  description: 'Dynamic image generation with Bannerbear',
  commands: ['create image', 'generate image', 'bannerbear'],
  status: 'notConfigured',
  configureUrl: 'https://www.bannerbear.com/',
  setupInstructions: 'Sign up at bannerbear.com and get your API key',
  handler: async (params) => {
    toast({
      title: "Bannerbear Image Service",
      description: "Would generate an image if configured. Please add your Bannerbear API key."
    });
    
    return {
      success: false,
      message: "Image service not configured. Please add your Bannerbear API key."
    };
  }
};

const pdfService: ServiceIntegration = {
  id: 'ilovepdf',
  name: 'iLovePDF',
  type: 'pdf',
  description: 'PDF manipulation with iLovePDF',
  commands: ['convert pdf', 'edit pdf', 'pdf', 'ilovepdf'],
  status: 'notConfigured',
  configureUrl: 'https://developer.ilovepdf.com/',
  setupInstructions: 'Sign up at developer.ilovepdf.com and get your API key',
  handler: async (params) => {
    toast({
      title: "iLovePDF Service",
      description: "Would manipulate PDFs if configured. Please add your iLovePDF API key."
    });
    
    return {
      success: false,
      message: "PDF service not configured. Please add your iLovePDF API key."
    };
  }
};

const audioService: ServiceIntegration = {
  id: 'freesound',
  name: 'Freesound',
  type: 'audio',
  description: 'Audio samples from Freesound',
  commands: ['find sound', 'audio', 'sound', 'freesound'],
  status: 'notConfigured',
  configureUrl: 'https://freesound.org/apiv2/apply/',
  setupInstructions: 'Sign up at freesound.org and get your API key',
  handler: async (params) => {
    toast({
      title: "Freesound Audio Service",
      description: "Would find audio samples if configured. Please add your Freesound API key."
    });
    
    return {
      success: false,
      message: "Audio service not configured. Please add your Freesound API key."
    };
  }
};

const petService: ServiceIntegration = {
  id: 'petfinder',
  name: 'Petfinder',
  type: 'pets',
  description: 'Find adoptable pets with Petfinder',
  commands: ['find pet', 'adopt pet', 'petfinder'],
  status: 'notConfigured',
  configureUrl: 'https://www.petfinder.com/developers/',
  setupInstructions: 'Sign up at petfinder.com/developers and get your API key',
  handler: async (params) => {
    toast({
      title: "Petfinder Service",
      description: "Would search for adoptable pets if configured. Please add your Petfinder API key."
    });
    
    return {
      success: false,
      message: "Pet service not configured. Please add your Petfinder API key."
    };
  }
};

const weatherService: ServiceIntegration = {
  id: 'weather',
  name: 'Weather API',
  type: 'weather',
  description: 'Get weather information',
  commands: ['weather', 'forecast', 'temperature'],
  status: 'available',
  handler: async (params) => {
    toast({
      title: "Weather Service",
      description: "Fetching weather information..."
    });
    
    // This could be implemented with a real API call
    return {
      success: true,
      location: params.location || "Current Location",
      temperature: Math.round(Math.random() * 25 + 5),
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 5)],
      humidity: Math.round(Math.random() * 50 + 30),
      windSpeed: Math.round(Math.random() * 20)
    };
  }
};

const videoService: ServiceIntegration = {
  id: 'youtube',
  name: 'YouTube',
  type: 'video',
  description: 'Search and play YouTube videos',
  commands: ['play video', 'youtube', 'search video'],
  status: 'available',
  handler: async (params) => {
    toast({
      title: "YouTube Service",
      description: `Searching for "${params.query}"`
    });
    
    return {
      success: true,
      message: `Playing video related to "${params.query}"`,
      videoId: "dQw4w9WgXcQ" // Example video ID
    };
  }
};

const financeService: ServiceIntegration = {
  id: 'alphavantage',
  name: 'Alpha Vantage',
  type: 'finance',
  description: 'Financial data with Alpha Vantage',
  commands: ['stock price', 'financial data', 'alphavantage'],
  status: 'notConfigured',
  configureUrl: 'https://www.alphavantage.co/support/#api-key',
  setupInstructions: 'Sign up at alphavantage.co and get your API key',
  handler: async (params) => {
    toast({
      title: "Alpha Vantage Finance Service",
      description: "Would retrieve financial data if configured. Please add your Alpha Vantage API key."
    });
    
    return {
      success: false,
      message: "Finance service not configured. Please add your Alpha Vantage API key."
    };
  }
};

const videoAutomationService: ServiceIntegration = {
  id: 'remotion',
  name: 'Remotion',
  type: 'video',
  description: 'Programmatic video generation with Remotion',
  commands: ['create video', 'generate video', 'remotion'],
  status: 'notConfigured',
  configureUrl: 'https://www.remotion.dev/',
  setupInstructions: 'Install Remotion and set up your project',
  handler: async (params) => {
    toast({
      title: "Remotion Video Service",
      description: "Would generate a video if configured. Please set up Remotion."
    });
    
    return {
      success: false,
      message: "Video generation service not configured. Please set up Remotion."
    };
  }
};

const cryptoService: ServiceIntegration = {
  id: 'coinbase',
  name: 'Coinbase',
  type: 'finance',
  description: 'Cryptocurrency data with Coinbase',
  commands: ['crypto price', 'bitcoin', 'ethereum', 'coinbase'],
  status: 'notConfigured',
  configureUrl: 'https://developers.coinbase.com/',
  setupInstructions: 'Sign up at developers.coinbase.com and get your API key',
  handler: async (params) => {
    toast({
      title: "Coinbase Crypto Service",
      description: "Would retrieve cryptocurrency data if configured. Please add your Coinbase API key."
    });
    
    return {
      success: false,
      message: "Crypto service not configured. Please add your Coinbase API key."
    };
  }
};

const dataVisualizationService: ServiceIntegration = {
  id: 'tableau',
  name: 'Tableau',
  type: 'data',
  description: 'Data visualization with Tableau',
  commands: ['visualize data', 'tableau', 'data viz'],
  status: 'notConfigured',
  configureUrl: 'https://www.tableau.com/',
  setupInstructions: 'Sign up at tableau.com and set up your account',
  handler: async (params) => {
    toast({
      title: "Tableau Data Service",
      description: "Would visualize data if configured. Please set up your Tableau integration."
    });
    
    return {
      success: false,
      message: "Data visualization service not configured. Please set up your Tableau integration."
    };
  }
};

const biService: ServiceIntegration = {
  id: 'powerbi',
  name: 'Power BI',
  type: 'data',
  description: 'Business intelligence with Power BI',
  commands: ['business intelligence', 'power bi', 'report'],
  status: 'notConfigured',
  configureUrl: 'https://powerbi.microsoft.com/',
  setupInstructions: 'Sign up at powerbi.microsoft.com and set up your account',
  handler: async (params) => {
    toast({
      title: "Power BI Service",
      description: "Would generate business intelligence reports if configured. Please set up your Power BI integration."
    });
    
    return {
      success: false,
      message: "BI service not configured. Please set up your Power BI integration."
    };
  }
};

const dataStreamingService: ServiceIntegration = {
  id: 'venice',
  name: 'Venice',
  type: 'data',
  description: 'Real-time data streaming with Venice',
  commands: ['data stream', 'venice', 'real-time data'],
  status: 'notConfigured',
  configureUrl: 'https://venice.io/',
  setupInstructions: 'Sign up at venice.io and set up your account',
  handler: async (params) => {
    toast({
      title: "Venice Data Streaming Service",
      description: "Would stream real-time data if configured. Please set up your Venice integration."
    });
    
    return {
      success: false,
      message: "Data streaming service not configured. Please set up your Venice integration."
    };
  }
};

const timeService: ServiceIntegration = {
  id: 'timeapi',
  name: 'Time API',
  type: 'time',
  description: 'Time and timezone data',
  commands: ['time', 'timezone', 'current time'],
  status: 'available',
  handler: async (params) => {
    const now = new Date();
    
    toast({
      title: "Time Service",
      description: `Current time: ${now.toLocaleTimeString()}`
    });
    
    return {
      success: true,
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      unix: Math.floor(now.getTime() / 1000)
    };
  }
};

const codingService: ServiceIntegration = {
  id: 'hackerearth',
  name: 'HackerEarth',
  type: 'coding',
  description: 'Coding challenges and interviews with HackerEarth',
  commands: ['coding challenge', 'hackerearth', 'code'],
  status: 'notConfigured',
  configureUrl: 'https://www.hackerearth.com/api/',
  setupInstructions: 'Sign up at hackerearth.com and get your API key',
  handler: async (params) => {
    toast({
      title: "HackerEarth Coding Service",
      description: "Would access coding challenges if configured. Please add your HackerEarth API key."
    });
    
    return {
      success: false,
      message: "Coding service not configured. Please add your HackerEarth API key."
    };
  }
};

// Register all services
export function registerAllServices() {
  registerService(emailService);
  registerService(authService);
  registerService(automationService);
  registerService(locationService);
  registerService(messagingService);
  registerService(searchService);
  registerService(imageService);
  registerService(pdfService);
  registerService(audioService);
  registerService(petService);
  registerService(weatherService);
  registerService(videoService);
  registerService(financeService);
  registerService(videoAutomationService);
  registerService(cryptoService);
  registerService(dataVisualizationService);
  registerService(biService);
  registerService(dataStreamingService);
  registerService(timeService);
  registerService(codingService);
}
