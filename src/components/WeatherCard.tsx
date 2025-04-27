
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CloudSun, CloudRain, Sun, Cloud, X, Loader2 } from 'lucide-react';
import { Location } from './WorldDashboard';
import { toast } from "@/hooks/use-toast";

interface Props {
  location: Location;
  onRemove: () => void;
}

interface Weather {
  main: string;
  description: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
}

const WeatherCard: React.FC<Props> = ({ location, onRemove }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate the local time in the location's timezone
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data for the location
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=8d10b4b3bb1052ef47d0b24df9748937`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeather({
          main: data.weather[0].main,
          description: data.weather[0].description,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        toast({
          title: "Weather data error",
          description: `Failed to fetch weather data for ${location.name}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [location]);

  const getTimeString = (offsetHours: number = 0) => {
    const date = new Date();
    const utcHours = date.getUTCHours();
    const localHours = (utcHours + offsetHours + 24) % 24;
    return format(
      new Date(date.setUTCHours(localHours)), 
      'h:mm:ss a'
    );
  };
  
  const getWeatherIcon = () => {
    if (!weather) return <CloudSun className="h-8 w-8 text-blue-400" />;
    
    const condition = weather.main.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className="h-8 w-8 text-blue-400" />;
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return <Sun className="h-8 w-8 text-yellow-400" />;
    } else if (condition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-400" />;
    }
    
    return <CloudSun className="h-8 w-8 text-blue-400" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-500 to-sky-600 px-6 py-4">
        <button 
          onClick={onRemove}
          className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
        >
          <X size={18} />
        </button>
        
        <h2 className="text-xl font-bold text-white">{location.name}</h2>
        <p className="text-blue-100">{location.country}</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6 text-center">
          <h3 className="text-gray-500 text-sm mb-1">Current Local Time</h3>
          <p className="text-2xl font-bold text-gray-800">
            {format(currentTime, 'h:mm:ss a')}
          </p>
          <p className="text-gray-600 text-sm">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-gray-500 text-sm mb-3">Weather Conditions</h3>
          
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : weather ? (
            <div className="flex items-center">
              <div className="mr-4">
                {getWeatherIcon()}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{Math.round(weather.temp)}°C</p>
                <p className="text-gray-600 capitalize">{weather.description}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <p>Feels like: {Math.round(weather.feels_like)}°C</p>
                  <p>Humidity: {weather.humidity}%</p>
                  <p>Wind: {weather.wind_speed} m/s</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Weather data unavailable</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
