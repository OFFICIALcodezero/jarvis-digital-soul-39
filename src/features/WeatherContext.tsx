
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getWeatherForecast } from '@/services/weatherService';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
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

  const fetchWeather = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would use coordinates with the weather service
      // For now, we'll use the mock data from our existing weatherService
      const weatherResponse = await getWeatherForecast({ location: "New York" });
      
      // Convert from the existing format to our new format
      setWeather({
        temperature: weatherResponse.current.temp,
        condition: weatherResponse.current.condition,
        humidity: weatherResponse.current.humidity,
        windSpeed: weatherResponse.current.windSpeed,
        icon: weatherResponse.current.icon
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

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
