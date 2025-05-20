
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LocationStatusProps {
  isHackerMode?: boolean;
  className?: string;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({
  isHackerMode = false,
  className = ''
}) => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('Unknown');

  // Get user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setIsLoading(false);
        },
        (err) => {
          setError('Location access denied');
          setIsLoading(false);
        },
        { timeout: 8000 }
      );
    } else {
      setError('Geolocation not available');
      setIsLoading(false);
    }
  }, []);

  // Update local time every minute
  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateLocalTime();
    const interval = setInterval(updateLocalTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get location name from coordinates using reverse geocoding
  useEffect(() => {
    if (userLocation) {
      const { latitude, longitude } = userLocation.coords;
      
      // Simulate location name lookup without making actual API calls
      setTimeout(() => {
        setLocationName('Current Location');
      }, 500);
    }
  }, [userLocation]);

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'} ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center text-white">
          <MapPin className="mr-2 h-4 w-4" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {isLoading ? (
          <div className="flex justify-center py-1">
            <div className="animate-spin h-4 w-4 border-2 border-jarvis rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{error}</span>
          </div>
        ) : userLocation ? (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Current:</div>
                <Badge className={`bg-${isHackerMode ? 'red' : 'jarvis'}/20 text-white text-xs py-0 h-5`}>
                  {locationName}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Time:</div>
                <div className="flex items-center text-white">
                  <Clock className="h-3 w-3 mr-1 text-gray-300" />
                  <span>{localTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Coordinates:</div>
                <div className="text-white">
                  {userLocation.coords.latitude.toFixed(2)}, {userLocation.coords.longitude.toFixed(2)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-white">Location unavailable</div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationStatus;
