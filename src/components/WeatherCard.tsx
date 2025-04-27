
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Location } from './WorldDashboard';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Thermometer,
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Props {
  location: Location;
  onRemove: () => void;
}

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

const WeatherCard: React.FC<Props> = ({ location, onRemove }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=8d10b4b3bb1052ef47d0b24df9748937`
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        toast({
          title: "Error fetching weather",
          description: "Could not load weather data for this location",
          variant: "destructive",
        });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-8 h-8 text-yellow-500" />;
    
    switch (weather.condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-purple-500" />;
      default:
        return <Thermometer className="w-8 h-8 text-red-500" />;
    }
  };

  const getLocalTime = () => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (3600000 * 0)); // TODO: Add timezone offset
    return format(cityTime, 'HH:mm:ss');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{location.name}</h2>
          <p className="text-gray-500">{location.country}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold text-gray-800">
          {getLocalTime()}
        </div>
        {getWeatherIcon()}
      </div>

      {weather && (
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-gray-800">
            {weather.temp}°C
          </div>
          <div className="text-gray-600">
            <div>Humidity: {weather.humidity}%</div>
            <div>Wind: {weather.windSpeed} m/s</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
