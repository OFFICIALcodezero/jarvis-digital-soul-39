
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer, Wind } from 'lucide-react';
import { useWeatherContext } from './WeatherContext';
import { toast } from 'sonner';

interface WeatherDisplayProps {
  isHackerMode?: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ isHackerMode = false }) => {
  const { weather, fetchWeather, isLoading, error } = useWeatherContext();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Get geolocation when component mounts
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to access your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  }, []);

  // Fetch weather when location is available
  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location, fetchWeather]);

  // Weather icons based on condition
  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-8 w-8 text-gray-400" />;

    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className={`h-8 w-8 text-${isHackerMode ? 'red-400' : 'blue-400'}`} />;
    } else if (condition.includes('snow')) {
      return <CloudSnow className={`h-8 w-8 text-${isHackerMode ? 'red-400' : 'blue-200'}`} />;
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return <Sun className={`h-8 w-8 text-${isHackerMode ? 'red-400' : 'yellow-400'}`} />;
    } else {
      return <Cloud className={`h-8 w-8 text-${isHackerMode ? 'red-400' : 'gray-400'}`} />;
    }
  };

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Thermometer className="mr-2 h-4 w-4" />
          Weather Conditions
        </CardTitle>
        <CardDescription>Real-time environmental data</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin h-5 w-5 border-2 border-jarvis rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : weather ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getWeatherIcon()}
                <div className="ml-2">
                  <div className="font-medium">{weather.condition}</div>
                  <div className="text-sm text-gray-400">{weather.location}</div>
                </div>
              </div>
              <div className="text-2xl font-bold">{Math.round(weather.temperature)}°</div>
            </div>
            
            {(weather.humidity !== undefined || weather.windSpeed !== undefined) && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {weather.humidity !== undefined && (
                  <div className="flex items-center text-sm">
                    <Cloud className="h-4 w-4 mr-1 text-blue-400" />
                    <span>Humidity: {weather.humidity}%</span>
                  </div>
                )}
                {weather.windSpeed !== undefined && (
                  <div className="flex items-center text-sm">
                    <Wind className="h-4 w-4 mr-1 text-blue-400" />
                    <span>Wind: {weather.windSpeed} km/h</span>
                  </div>
                )}
              </div>
            )}
            
            {weather.forecast && weather.forecast.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Forecast</div>
                <div className="grid grid-cols-3 gap-2">
                  {weather.forecast.slice(0, 3).map((day, index) => (
                    <div key={index} className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-xs">{day.day}</div>
                      <div className="font-medium">{Math.round(day.temperature)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400">No weather data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
