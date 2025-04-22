import { toast } from '@/components/ui/use-toast';

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    icon: string;
  }>;
}

export interface WeatherQuery {
  location?: string;
  days?: number;
}

// Mock weather data for demonstration
const mockWeatherData: WeatherData = {
  location: "New York, NY",
  current: {
    temp: 22,
    condition: "Partly cloudy",
    icon: "cloud-sun",
    humidity: 65,
    windSpeed: 8
  },
  forecast: [
    {
      date: "Today",
      maxTemp: 24,
      minTemp: 17,
      condition: "Partly cloudy",
      icon: "cloud-sun"
    },
    {
      date: "Tomorrow",
      maxTemp: 28,
      minTemp: 18,
      condition: "Sunny",
      icon: "sun"
    },
    {
      date: "Wednesday",
      maxTemp: 26,
      minTemp: 20,
      condition: "Rain",
      icon: "cloud-rain"
    },
    {
      date: "Thursday",
      maxTemp: 22,
      minTemp: 16,
      condition: "Cloudy",
      icon: "cloud"
    },
    {
      date: "Friday",
      maxTemp: 20,
      minTemp: 14,
      condition: "Rain",
      icon: "cloud-rain"
    }
  ]
};

export const getWeatherForecast = async (query: WeatherQuery = {}): Promise<WeatherData> => {
  // In a real implementation, you would call a weather API here
  // For demo purposes, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update the location if provided
      if (query.location) {
        const data = { ...mockWeatherData, location: query.location };
        resolve(data);
      } else {
        resolve(mockWeatherData);
      }
    }, 1000);
  });
};

export const parseWeatherQuery = (query: string): WeatherQuery => {
  const result: WeatherQuery = {};
  
  // Check for location in the query
  const locationMatches = query.match(/(?:in|for|at)\s+([a-zA-Z\s,]+)(?:\?|$)/i);
  if (locationMatches && locationMatches[1]) {
    result.location = locationMatches[1].trim();
  }
  
  // Check for forecast days
  if (query.includes("week") || query.includes("forecast")) {
    result.days = 5;
  } else if (query.includes("tomorrow")) {
    result.days = 2; // Today and tomorrow
  } else {
    result.days = 1; // Just today
  }
  
  return result;
};

export const getWeatherResponse = async (query: string): Promise<{text: string, data: WeatherData}> => {
  try {
    const parsedQuery = parseWeatherQuery(query);
    const weatherData = await getWeatherForecast(parsedQuery);
    
    let responseText = "";
    
    // Generate response based on query
    if (query.toLowerCase().includes("tomorrow")) {
      responseText = `Tomorrow's forecast for ${weatherData.location}: ${weatherData.forecast[1].condition} with a high of ${weatherData.forecast[1].maxTemp}°C and a low of ${weatherData.forecast[1].minTemp}°C.`;
    } else if (query.toLowerCase().includes("week") || query.toLowerCase().includes("forecast")) {
      responseText = `Here's your ${weatherData.location} 5-day forecast: Today: ${weatherData.current.condition}, ${weatherData.current.temp}°C. `;
      weatherData.forecast.slice(1).forEach(day => {
        responseText += `${day.date}: ${day.condition}, high of ${day.maxTemp}°C. `;
      });
    } else {
      responseText = `Current weather in ${weatherData.location}: ${weatherData.current.condition}, ${weatherData.current.temp}°C with ${weatherData.current.humidity}% humidity and wind at ${weatherData.current.windSpeed} mph.`;
    }
    
    return { text: responseText, data: weatherData };
  } catch (error) {
    console.error('Error getting weather response:', error);
    return { 
      text: "I'm sorry, I couldn't retrieve the weather information at this time.", 
      data: mockWeatherData 
    };
  }
};
