
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getWeatherForecast } from '@/services/weatherService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  location?: string;
  forecast?: Array<{
    day: string;
    temperature: number;
    condition: string;
  }>;
}

interface WeatherAlert {
  id: string;
  type: 'storm' | 'heat' | 'cold' | 'rain' | 'wind';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  location: string;
}

interface WeatherContextType {
  weather: WeatherData | null;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  subscribedLocations: string[];
  subscribeToLocation: (location: string) => Promise<void>;
  unsubscribeFromLocation: (location: string) => void;
  weatherAlerts: WeatherAlert[];
  dismissAlert: (id: string) => void;
  activeCollaborators: string[];
}

// Define a type for our presence state
interface PresenceUser {
  username?: string;
  online_at?: string;
  presence_ref?: string;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeatherContext = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherContextProvider");
  }
  return context;
};

export const WeatherContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribedLocations, setSubscribedLocations] = useState<string[]>([]);
  const [weatherChannel, setWeatherChannel] = useState<any>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [activeCollaborators, setActiveCollaborators] = useState<string[]>([]);

  // Initialize Supabase Realtime channel for weather updates
  useEffect(() => {
    const channel = supabase.channel('weather_updates', {
      config: {
        broadcast: { self: true },
        presence: { key: `user_${Math.random().toString(36).substring(2, 9)}` },
      }
    });

    channel
      .on('broadcast', { event: 'weather_update' }, (payload) => {
        console.log('Received weather update:', payload);
        if (payload.payload && payload.payload.data) {
          const weatherData = payload.payload.data as WeatherData;
          
          // Only update if this is for a location we're subscribed to
          if (subscribedLocations.includes(weatherData.location || '')) {
            setWeather(weatherData);
            
            toast({
              title: "Weather Updated",
              description: `Weather for ${weatherData.location} updated: ${weatherData.temperature}°C, ${weatherData.condition}`,
            });
          }
        }
      })
      .on('broadcast', { event: 'weather_alert' }, (payload) => {
        if (payload.payload && payload.payload.alert) {
          const alert = payload.payload.alert as WeatherAlert;
          
          // Only show alert if this is for a location we're subscribed to
          if (subscribedLocations.includes(alert.location)) {
            setWeatherAlerts(prev => [...prev, alert]);
            
            // Show a toast notification for the alert
            toast({
              title: `Weather Alert: ${alert.type.toUpperCase()}`,
              description: alert.message,
              variant: "destructive"
            });
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Extract usernames from presence state, safely accessing username property
        const users: string[] = [];
        
        Object.values(state).forEach(presences => {
          presences.forEach((presence: PresenceUser) => {
            // Check if username exists before accessing it
            if (presence && typeof presence === 'object' && 'username' in presence) {
              users.push(presence.username || 'Anonymous user');
            } else {
              users.push('Anonymous user');
            }
          });
        });
        
        setActiveCollaborators(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('user joined', key, newPresences);
        // Safely access username from newPresences
        const username = newPresences[0] && typeof newPresences[0] === 'object' && 'username' in newPresences[0] 
          ? newPresences[0].username 
          : 'A user';
          
        toast({
          title: "User Joined",
          description: `${username || 'A user'} is now monitoring weather`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('user left', key, leftPresences);
        // Safely access username from leftPresences
        const username = leftPresences[0] && typeof leftPresences[0] === 'object' && 'username' in leftPresences[0] 
          ? leftPresences[0].username 
          : 'A user';
          
        toast({
          title: "User Left",
          description: `${username || 'A user'} stopped monitoring weather`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to weather updates channel');
          setWeatherChannel(channel);
          
          // Track current user's presence with username
          await channel.track({
            username: `User_${Math.floor(Math.random() * 1000)}`,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      console.log('Removing weather channel');
      supabase.removeChannel(channel);
    };
  }, [subscribedLocations]);

  // Generate weather alerts based on conditions
  useEffect(() => {
    if (!weather || !weather.location) return;
    
    // Check for extreme weather conditions and generate alerts
    const checkForAlerts = () => {
      const alerts: WeatherAlert[] = [];
      
      // Check for extreme temperature
      if (weather.temperature > 35) {
        alerts.push({
          id: `heat_${Date.now()}`,
          type: 'heat',
          severity: 'high',
          message: `Extreme heat warning: ${weather.temperature}°C at ${weather.location}. Stay hydrated and avoid direct sun exposure.`,
          timestamp: new Date(),
          location: weather.location || ''
        });
      }
      
      // Check for very cold temperature
      if (weather.temperature < 0) {
        alerts.push({
          id: `cold_${Date.now()}`,
          type: 'cold',
          severity: 'medium',
          message: `Freezing temperature alert: ${weather.temperature}°C at ${weather.location}. Protect yourself from the cold.`,
          timestamp: new Date(),
          location: weather.location || ''
        });
      }
      
      // Check for storms based on condition
      if (weather.condition.toLowerCase().includes('storm') || 
          weather.condition.toLowerCase().includes('thunder')) {
        alerts.push({
          id: `storm_${Date.now()}`,
          type: 'storm',
          severity: 'high',
          message: `Storm warning for ${weather.location}: ${weather.condition}. Seek shelter immediately.`,
          timestamp: new Date(),
          location: weather.location || ''
        });
      }
      
      // Check for strong winds
      if (weather.windSpeed && weather.windSpeed > 30) {
        alerts.push({
          id: `wind_${Date.now()}`,
          type: 'wind',
          severity: 'medium',
          message: `High wind advisory: ${weather.windSpeed} km/h at ${weather.location}. Secure loose objects and exercise caution.`,
          timestamp: new Date(),
          location: weather.location || ''
        });
      }
      
      // Add alerts and broadcast them
      if (alerts.length > 0) {
        setWeatherAlerts(prev => [...prev, ...alerts]);
        
        // Broadcast each alert to other clients
        alerts.forEach(alert => {
          if (weatherChannel) {
            weatherChannel.send({
              type: 'broadcast',
              event: 'weather_alert',
              payload: { alert }
            }).catch(error => {
              console.error('Error broadcasting weather alert:', error);
            });
          }
        });
      }
    };
    
    // Check for alerts when weather updates
    checkForAlerts();
    
    // Also set up a periodic check
    const intervalId = setInterval(checkForAlerts, 60000);
    
    return () => clearInterval(intervalId);
  }, [weather, weatherChannel]);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now using mock data with the coordinates
      console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
      const locationString = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const weatherResponse = await getWeatherForecast({ location: "New York" });
      
      // Convert from the existing format to our new format
      const weatherData: WeatherData = {
        temperature: weatherResponse.current.temp,
        condition: weatherResponse.current.condition,
        humidity: weatherResponse.current.humidity,
        windSpeed: weatherResponse.current.windSpeed,
        icon: weatherResponse.current.icon,
        location: locationString,
        forecast: weatherResponse.forecast?.map((day: any) => ({
          day: day.day,
          temperature: day.temp,
          condition: day.condition
        }))
      };
      
      setWeather(weatherData);
      
      // Broadcast weather update to all connected clients
      if (weatherChannel) {
        try {
          await weatherChannel.send({
            type: 'broadcast',
            event: 'weather_update',
            payload: { data: weatherData }
          });
        } catch (error) {
          console.error('Error broadcasting weather data:', error);
        }
      }
      
      toast({
        title: "Weather Updated",
        description: `Weather data updated for your location`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
      toast({
        title: "Weather Error",
        description: "Could not retrieve weather data for your location",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [weatherChannel]);

  // Subscribe to weather updates for a specific location
  const subscribeToLocation = useCallback(async (location: string) => {
    if (subscribedLocations.includes(location)) return;
    
    setSubscribedLocations(prev => [...prev, location]);
    
    toast({
      title: "Weather Subscription Added",
      description: `You'll receive updates for ${location}`,
    });
    
    // Fetch initial weather for the location
    try {
      // This would normally use the location string to get coordinates
      // For demo, we'll use random coordinates
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      await fetchWeather(lat, lon);
    } catch (error) {
      console.error("Error fetching initial weather for location:", error);
    }
  }, [subscribedLocations, fetchWeather]);

  // Unsubscribe from weather updates for a specific location
  const unsubscribeFromLocation = useCallback((location: string) => {
    setSubscribedLocations(prev => prev.filter(loc => loc !== location));
    
    toast({
      title: "Weather Subscription Removed",
      description: `You'll no longer receive updates for ${location}`,
    });
  }, []);
  
  // Dismiss a specific weather alert by ID
  const dismissAlert = useCallback((id: string) => {
    setWeatherAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const value = {
    weather,
    fetchWeather,
    isLoading,
    error,
    subscribedLocations,
    subscribeToLocation,
    unsubscribeFromLocation,
    weatherAlerts,
    dismissAlert,
    activeCollaborators
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
