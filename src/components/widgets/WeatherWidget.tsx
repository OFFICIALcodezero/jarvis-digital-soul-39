
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer } from 'lucide-react';
import { useWeather } from '@/features/WeatherContext';

interface WeatherWidgetProps {
  isHackerMode?: boolean;
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  isHackerMode = false,
  className = ''
}) => {
  const { weatherData, isLoading, error } = useWeather();

  // Weather icons based on condition
  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="h-6 w-6 text-gray-400" />;

    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className={`h-6 w-6 text-${isHackerMode ? 'red-400' : 'blue-400'}`} />;
    } else if (condition.includes('snow')) {
      return <CloudSnow className={`h-6 w-6 text-${isHackerMode ? 'red-400' : 'blue-200'}`} />;
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return <Sun className={`h-6 w-6 text-${isHackerMode ? 'red-400' : 'yellow-400'}`} />;
    } else {
      return <Cloud className={`h-6 w-6 text-${isHackerMode ? 'red-400' : 'gray-400'}`} />;
    }
  };

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'} ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center text-white">
          <Thermometer className="mr-2 h-4 w-4" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-1">
            <div className="animate-spin h-4 w-4 border-2 border-jarvis rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-xs text-red-400">{error}</div>
        ) : weatherData ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getWeatherIcon()}
                <div className="ml-2">
                  <div className="font-medium text-white text-sm">{weatherData.condition}</div>
                  <div className="text-xs text-gray-300">{weatherData.location}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-white">{Math.round(weatherData.temperature)}°</div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400">Weather data unavailable</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
