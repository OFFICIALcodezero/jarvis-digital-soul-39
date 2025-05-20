
import React, { useEffect, useState } from 'react';
import { getWeatherForecast, WeatherData } from '@/services/weatherService';
import { CloudSun, CloudRain, Sun, Cloud, Plus, Trash2, Users, AlertCircle, Bell } from 'lucide-react';
import { useWeather } from '@/features/WeatherContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  // Since our current WeatherContext doesn't have all these properties,
  // we'll use what's available and mock the rest for now
  const { weatherData, refreshWeather, isLoading, error } = useWeather();
  const [newLocation, setNewLocation] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  
  // Mock data for properties not in our context
  const subscribedLocations = [];
  const weatherAlerts = weatherData?.alerts || [];
  const activeCollaborators = [];
  
  // Mock functions
  const subscribeToLocation = async (location: string) => {
    console.log('Would subscribe to location:', location);
    await refreshWeather();
  };
  
  const unsubscribeFromLocation = (location: string) => {
    console.log('Would unsubscribe from location:', location);
  };
  
  const dismissAlert = (id: string) => {
    console.log('Would dismiss alert:', id);
  };

  useEffect(() => {
    // Ask for user geolocation on mount
    if (!navigator.geolocation) {
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Fetch weather for current location
        await refreshWeather();
        
        // Also subscribe to current location for updates
        const locationString = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
        await subscribeToLocation(locationString);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, [refreshWeather]);

  const handleSubscribeLocation = () => {
    if (newLocation.trim()) {
      subscribeToLocation(newLocation.trim());
      setNewLocation('');
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 flex justify-center items-center">
        <span className="text-[#33c3f0] text-sm">Loading weather data...</span>
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

  if (!weatherData) return null;

  if (isCompact) {
    return (
      <div className="weather-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(weatherData.condition)}
            <div className="ml-2">
              <div className="text-lg font-bold text-white">
                {weatherData.temperature}°C
              </div>
              <div className="text-xs text-[#33c3f0]/80">{weatherData.location}</div>
            </div>
          </div>
          <div className="text-sm text-gray-300">{weatherData.condition}</div>
        </div>
        
        {weatherAlerts.length > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{weatherAlerts.length} Alert{weatherAlerts.length > 1 ? 's' : ''}</span>
            </Badge>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Weather</h3>
        <div className="flex items-center gap-2">
          {weatherAlerts.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 relative" 
              onClick={() => setShowAlertsDialog(true)}
            >
              <Bell className="h-4 w-4 text-red-400" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {weatherAlerts.length}
              </span>
            </Button>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Plus className="h-4 w-4 text-[#33c3f0]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 border-[#33c3f0]/30">
              <DialogHeader>
                <DialogTitle>Add Weather Location</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  placeholder="Enter city or coordinates"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="bg-black/40 border-[#33c3f0]/30"
                />
                <Button 
                  onClick={handleSubscribeLocation}
                  disabled={!newLocation.trim()}
                  className="bg-[#33c3f0] text-black hover:bg-[#33c3f0]/80"
                >
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center mb-4">
        {getWeatherIcon(weatherData.condition)}
        <div className="ml-3">
          <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
          <div className="text-sm text-gray-300">{weatherData.condition}</div>
          <div className="text-xs text-[#33c3f0]/70">{weatherData.location}</div>
        </div>
      </div>

      {/* Weather Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="bg-black/90 border-red-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
              Weather Alerts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {weatherAlerts.length === 0 ? (
              <p className="text-sm text-gray-400">No active weather alerts</p>
            ) : (
              weatherAlerts.map(alert => (
                <Alert key={alert.type} className={`bg-red-900/20 border-${alert.severity === 'high' ? 'red-600' : alert.severity === 'medium' ? 'yellow-600' : 'blue-600'}/30`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1 flex items-center">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                        <Badge variant="outline" className="ml-2 text-xs">
                          {alert.severity}
                        </Badge>
                      </h4>
                      <AlertDescription className="text-xs">
                        {alert.message}
                      </AlertDescription>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(alert.time).toLocaleTimeString()}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={() => dismissAlert(alert.type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {weatherData.forecast && (
        <div className="flex justify-between">
          {weatherData.forecast.slice(0, 4).map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400">{day.day}</div>
              <div className="my-1">{getWeatherIcon(day.condition)}</div>
              <div className="text-xs font-medium">{day.temp}°C</div>
            </div>
          ))}
        </div>
      )}
      
      {subscribedLocations.length > 0 && (
        <div className="mt-4 border-t border-[#33c3f0]/10 pt-3">
          <h4 className="text-xs text-[#33c3f0]/70 mb-2">Subscribed Locations</h4>
          <div className="flex flex-wrap gap-2">
            {subscribedLocations.map(location => (
              <div 
                key={location}
                className="bg-black/30 px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-[#33c3f0]/20"
              >
                <span className="text-white/80">{location}</span>
                <button
                  onClick={() => unsubscribeFromLocation(location)}
                  className="text-red-400/80 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Active Collaborators */}
      {activeCollaborators.length > 0 && (
        <div className="mt-4 border-t border-[#33c3f0]/10 pt-3">
          <h4 className="text-xs text-[#33c3f0]/70 mb-2 flex items-center">
            <Users className="h-3 w-3 mr-1" /> Active Users
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeCollaborators.map((username, index) => (
              <Badge key={index} variant="outline" className="bg-[#33c3f0]/10 text-[#33c3f0]">
                {username}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
