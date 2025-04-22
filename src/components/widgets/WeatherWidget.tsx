
import React from 'react';
import { WeatherData } from '@/services/weatherService';
import { CloudSun, CloudRain, Sun, Cloud } from 'lucide-react';

interface WeatherWidgetProps {
  data: WeatherData;
  isCompact?: boolean;
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return <CloudRain className="h-8 w-8 text-[#33c3f0]" />;
  } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return <Sun className="h-8 w-8 text-yellow-400" />;
  } else if (lowerCondition.includes('cloud') && lowerCondition.includes('part')) {
    return <CloudSun className="h-8 w-8 text-[#33c3f0]" />;
  } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className="h-8 w-8 text-gray-300" />;
  }

  // Default icon
  return <CloudSun className="h-8 w-8 text-[#33c3f0]" />;
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data, isCompact = false }) => {
  if (!data) return null;

  if (isCompact) {
    return (
      <div className="weather-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(data.current.condition)}
            <div className="ml-2">
              <div className="text-lg font-bold text-white">
                {data.current.temp}°C
              </div>
              <div className="text-xs text-[#33c3f0]/80">{data.location}</div>
            </div>
          </div>
          <div className="text-sm text-gray-300">{data.current.condition}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Weather</h3>
        <span className="text-sm text-gray-300">{data.location}</span>
      </div>

      <div className="flex items-center mb-4">
        {getWeatherIcon(data.current.condition)}
        <div className="ml-3">
          <div className="text-2xl font-bold">{data.current.temp}°C</div>
          <div className="text-sm text-gray-300">{data.current.condition}</div>
        </div>
        <div className="ml-auto">
          <div className="text-xs text-gray-400">
            Humidity: {data.current.humidity}%
          </div>
          <div className="text-xs text-gray-400">
            Wind: {data.current.windSpeed} mph
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {data.forecast.slice(0, 4).map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-400">{day.date}</div>
            <div className="my-1">{getWeatherIcon(day.condition)}</div>
            <div className="text-xs font-medium">{day.maxTemp}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
