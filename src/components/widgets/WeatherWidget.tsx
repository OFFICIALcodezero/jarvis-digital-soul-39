
import React, { useEffect, useState } from 'react';
import { WeatherData, getWeatherForecast } from '@/services/weatherService';
import { CloudSun, CloudRain, Sun, Cloud } from 'lucide-react';

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

interface WeatherWidgetProps {
  isCompact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ isCompact = false }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ask for user geolocation on mount
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setError('');
        // Here you would use actual coordinates with a real API; for mock, append coords to city
        const locationString = `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`;
        // Simulate different place by modifying the query; in real-world, send the coords
        try {
          const data = await getWeatherForecast({ location: locationString });
          setWeather(data);
        } catch (e) {
          setError('Unable to fetch weather for your location.');
        }
        setLoading(false);
      },
      (err) => {
        if (err.code === 1) {
          setError('Cannot show weather: Location permission denied.');
        } else {
          setError('Cannot show weather: Unable to retrieve your location.');
        }
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 flex justify-center items-center">
        <span className="text-[#33c3f0] text-sm">Detecting your location…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 flex flex-col items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  if (!weather) return null;

  if (isCompact) {
    return (
      <div className="weather-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(weather.current.condition)}
            <div className="ml-2">
              <div className="text-lg font-bold text-white">
                {weather.current.temp}°C
              </div>
              <div className="text-xs text-[#33c3f0]/80">{weather.location}</div>
            </div>
          </div>
          <div className="text-sm text-gray-300">{weather.current.condition}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Weather</h3>
        <span className="text-sm text-gray-300">{weather.location}</span>
      </div>

      <div className="flex items-center mb-4">
        {getWeatherIcon(weather.current.condition)}
        <div className="ml-3">
          <div className="text-2xl font-bold">{weather.current.temp}°C</div>
          <div className="text-sm text-gray-300">{weather.current.condition}</div>
        </div>
        <div className="ml-auto">
          <div className="text-xs text-gray-400">
            Humidity: {weather.current.humidity}%
          </div>
          <div className="text-xs text-gray-400">
            Wind: {weather.current.windSpeed} mph
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {weather.forecast.slice(0, 4).map((day, index) => (
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
