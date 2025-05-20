
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer, Wind } from 'lucide-react';
import { useWeather } from './WeatherContext';
import { toast } from '@/components/ui/use-toast';

interface WeatherDisplayProps {
  isHackerMode?: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ isHackerMode = false }) => {
  const { weatherData, refreshWeather, isLoading, error } = useWeather();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [hasFetchedWeather, setHasFetchedWeather] = useState(false);

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
          toast({
            title: "Location Error",
            description: 'Unable to access your location'
          });
        }
      );
    } else {
      toast({
        title: "Browser Compatibility",
        description: 'Geolocation is not supported by your browser'
      });
    }
  }, []);

  // Fetch weather when location is available - but only once
  useEffect(() => {
    if (location && !hasFetchedWeather) {
      // Check if fetchWeather exists in the context before calling it
      if (refreshWeather) {
        refreshWeather();
        setHasFetchedWeather(true);
      }
    }
  }, [location, refreshWeather, hasFetchedWeather]);

  // Weather icons based on condition
  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="h-8 w-8 text-gray-400" />;

    const condition = weatherData.condition.toLowerCase();
    
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
        <CardTitle className="text-lg flex items-center text-white">
          <Thermometer className="mr-2 h-4 w-4" />
          Weather Conditions
        </CardTitle>
        <CardDescription className="text-gray-300">Environmental data</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin h-5 w-5 border-2 border-jarvis rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : weatherData ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getWeatherIcon()}
                <div className="ml-2">
                  <div className="font-medium text-white">{weatherData.condition}</div>
                  <div className="text-sm text-gray-300">{weatherData.location}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{Math.round(weatherData.temperature)}°</div>
            </div>
            
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-2 text-sm text-white">
                <div className="flex items-center">
                  <Cloud className="h-4 w-4 mr-1 text-blue-400" />
                  <span>Humidity: 65%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-blue-400" />
                  <span>Wind: 10 km/h</span>
                </div>
              </div>
            </div>
            
            {weatherData.forecast && weatherData.forecast.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2 text-white">Forecast</div>
                <div className="grid grid-cols-3 gap-2">
                  {weatherData.forecast.slice(0, 3).map((day, index) => (
                    <div key={index} className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-xs text-gray-300">{day.day}</div>
                      <div className="font-medium text-white">{Math.round(day.temp)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-white">No weather data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
