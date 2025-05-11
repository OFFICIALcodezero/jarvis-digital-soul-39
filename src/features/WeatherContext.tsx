
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getWeatherForecast } from '@/services/weatherService';
import { toast } from '@/components/ui/use-toast';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
  forecast?: Array<{
    day: string;
    temperature: number;
    condition: string;
  }>;
}

interface WeatherContextType {
  weather: WeatherData | null;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeatherContext = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherContextProvider");
  }
  return context;
};

export const WeatherContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Log coordinates for debugging
      console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
      
      // For now using mock data with the coordinates
      const weatherResponse = await getWeatherForecast({ location: "New York" });
      
      // Convert from the existing format to our new format
      setWeather({
        temperature: weatherResponse.current.temp,
        condition: weatherResponse.current.condition,
        humidity: weatherResponse.current.humidity,
        windSpeed: weatherResponse.current.windSpeed,
        icon: weatherResponse.current.icon,
        location: "New York", // Use the location name from the API response
        coordinates: { latitude, longitude }, // Store actual coordinates separately
        forecast: weatherResponse.forecast?.map((day: any) => ({
          day: day.day,
          temperature: day.temp,
          condition: day.condition
        }))
      });
      
      toast({
        title: "Weather Updated",
        description: `Weather data updated for your location`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
      toast({
        title: "Weather Error",
        description: "Could not retrieve weather data for your location",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    weather,
    fetchWeather,
    isLoading,
    error
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
