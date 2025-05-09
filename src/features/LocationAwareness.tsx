
import React, { useEffect, useState } from 'react';
import { MapPin, CloudSun, Navigation, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeatherContext } from './WeatherContext';
import { processWorldClockQuery } from '@/services/worldClockService';

interface LocationAwarenessProps {
  userLocation: GeolocationPosition | null;
  isLoading: boolean;
  error: string | null;
  isHackerMode?: boolean;
}

export const LocationAwareness: React.FC<LocationAwarenessProps> = ({
  userLocation,
  isLoading,
  error,
  isHackerMode = false
}) => {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const { weather, fetchWeather, isLoading: isWeatherLoading } = useWeatherContext();

  // Fetch location name when coordinates change
  useEffect(() => {
    const getLocationName = async (lat: number, lng: number) => {
      try {
        // In a real app, you would use a reverse geocoding service
        // For demo purposes, we'll use a simulated response
        setTimeout(() => {
          setLocationName("New York City, NY");
        }, 500);
      } catch (error) {
        console.error("Error getting location name:", error);
      }
    };

    if (userLocation?.coords) {
      getLocationName(userLocation.coords.latitude, userLocation.coords.longitude);
      
      // Also fetch weather based on location
      fetchWeather(userLocation.coords.latitude, userLocation.coords.longitude);
    }
  }, [userLocation, fetchWeather]);

  // Get local time based on location
  useEffect(() => {
    if (locationName) {
      const timeData = processWorldClockQuery(`what time is it in ${locationName}`);
      if (timeData) {
        setLocalTime(timeData.time);
      }
    }
  }, [locationName]);

  // Handle when user hasn't granted permission yet
  if (!userLocation && !error && !isLoading) {
    return (
      <div className="space-y-4">
        <Alert className={`${isHackerMode ? 'bg-red-900/10 border-red-500/30' : 'bg-jarvis/5 border-jarvis/20'}`}>
          <AlertDescription>
            Location services aren't enabled. Enable them for contextual information.
          </AlertDescription>
        </Alert>
        
        <Button 
          className={isHackerMode ? 'bg-red-600 hover:bg-red-700' : 'bg-jarvis hover:bg-jarvis/90'}
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              () => window.location.reload(),
              (err) => console.error("Permission denied:", err)
            );
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <MapPin className={`h-8 w-8 animate-pulse ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
          </div>
          <p className="text-sm text-gray-400">Obtaining location data...</p>
          <Progress 
            value={45} 
            className={isHackerMode ? 'bg-red-900/20 w-32 mx-auto' : 'bg-jarvis/20 w-32 mx-auto'} 
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert className="bg-red-900/10 border-red-500/30">
        <AlertDescription>
          {error}. Location-based features won't be available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {locationName && (
        <div className={`rounded-lg p-3 ${isHackerMode ? 'bg-red-900/10 border border-red-500/30' : 'bg-jarvis/5 border border-jarvis/20'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <MapPin className={`h-5 w-5 mr-2 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
              <div>
                <h4 className="font-medium">Current Location</h4>
                <p className="text-sm text-gray-400">{locationName}</p>
              </div>
            </div>
            
            {localTime && (
              <div className="flex items-center">
                <Clock className={`h-4 w-4 mr-1 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
                <span className="text-sm">{localTime}</span>
              </div>
            )}
          </div>
          
          {userLocation && (
            <div className="mt-2 flex items-center">
              <Navigation className={`h-4 w-4 mr-1 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
              <span className="text-xs text-gray-400">
                {userLocation.coords.latitude.toFixed(4)}°, {userLocation.coords.longitude.toFixed(4)}°
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Weather context based on location */}
      {isWeatherLoading ? (
        <div className="text-center py-2">
          <CloudSun className={`h-6 w-6 mx-auto mb-1 animate-pulse ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
          <p className="text-sm text-gray-400">Loading weather data...</p>
        </div>
      ) : weather ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CloudSun className={`h-5 w-5 mr-2 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} />
              <h4 className="font-medium">Local Weather</h4>
            </div>
            <Badge className={isHackerMode ? 'bg-red-900/40 text-red-300' : 'bg-jarvis/40'}>
              Contextual
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded ${isHackerMode ? 'bg-red-900/10' : 'bg-jarvis/10'} text-center`}>
              <div className={`text-xl font-bold ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
                {weather.temperature}°F
              </div>
              <div className="text-xs text-gray-400">Temperature</div>
            </div>
            
            <div className={`p-2 rounded ${isHackerMode ? 'bg-red-900/10' : 'bg-jarvis/10'} text-center`}>
              <div className={`text-lg font-medium ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
                {weather.condition}
              </div>
              <div className="text-xs text-gray-400">Condition</div>
            </div>
          </div>
          
          <div className="text-xs">
            <span className="text-gray-400">Proactive suggestion: </span>
            {weather.temperature > 80 ? (
              <span>Consider staying hydrated in this heat.</span>
            ) : weather.temperature < 50 ? (
              <span>Remember to dress warmly today.</span>
            ) : weather.condition.toLowerCase().includes('rain') ? (
              <span>Don't forget your umbrella today.</span>
            ) : (
              <span>Weather conditions are favorable for outdoor activities.</span>
            )}
          </div>
        </div>
      ) : null}
      
      {/* Context-aware suggestions */}
      <div className={`mt-2 px-3 py-2 rounded-md border ${isHackerMode ? 'bg-red-900/5 border-red-500/20' : 'bg-jarvis/5 border-jarvis/20'}`}>
        <h4 className={`text-sm font-medium mb-1 ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
          Contextual Suggestions
        </h4>
        <ul className="text-xs space-y-1 text-gray-300">
          <li>• Added "Current Location" to your search context</li>
          <li>• 3 nearby coffee shops match your preferences</li>
          <li>• Traffic to work: 25 minutes (usual route)</li>
        </ul>
      </div>
    </div>
  );
};
