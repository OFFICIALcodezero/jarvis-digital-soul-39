
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
  alerts: {
    type: string;
    severity: string;
    message: string;
    time: string;
  }[];
  lastUpdated: string;
}

interface WeatherContextType {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  activeUsers: { presence_ref: string }[];
}

const defaultWeatherData: WeatherData = {
  temperature: 72,
  condition: 'Sunny',
  location: 'New York, NY',
  forecast: [
    { day: 'Mon', temp: 72, condition: 'Sunny' },
    { day: 'Tue', temp: 68, condition: 'Partly Cloudy' },
    { day: 'Wed', temp: 75, condition: 'Sunny' },
    { day: 'Thu', temp: 70, condition: 'Cloudy' },
    { day: 'Fri', temp: 65, condition: 'Rain' }
  ],
  alerts: [],
  lastUpdated: new Date().toISOString()
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherContextProviderProps {
  children: ReactNode;
}

export const WeatherContextProvider: React.FC<WeatherContextProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(defaultWeatherData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ presence_ref: string }[]>([]);

  // Fetch weather data from API
  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - in a real application, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate random weather data for simulation
      const temperature = Math.floor(Math.random() * 30) + 50; // Between 50 and 80
      const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Stormy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

      // Generate random alerts occasionally
      const shouldHaveAlert = Math.random() > 0.7;
      const alerts = shouldHaveAlert ? [
        {
          type: Math.random() > 0.5 ? 'Storm Warning' : 'Flood Alert',
          severity: Math.random() > 0.5 ? 'Moderate' : 'Severe',
          message: `Weather alert: ${Math.random() > 0.5 ? 'Strong storms expected' : 'Flooding possible in low areas'}`,
          time: new Date().toISOString()
        }
      ] : [];

      // Update weather data
      const newWeatherData: WeatherData = {
        ...defaultWeatherData,
        temperature,
        condition: randomCondition,
        alerts,
        lastUpdated: new Date().toISOString()
      };

      setWeatherData(newWeatherData);

      // Broadcast weather update to all connected clients
      try {
        await supabase.from('youtube_logs').insert({
          command: 'weather_update',
          video_title: 'Weather Data Update',
          user_id: 'system',
          mood: 'neutral',
          video_url: null,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error logging to Supabase:', err);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    // Subscribe to weather updates
    const weatherChannel = supabase
      .channel('weather-updates')
      .on('broadcast', { event: 'weather-update' }, payload => {
        if (payload.payload && payload.payload.data) {
          setWeatherData(payload.payload.data);
        }
      })
      .subscribe();

    // Subscribe to presence for active users
    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: crypto.randomUUID(),
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat() as Array<{ presence_ref: string }>;
        setActiveUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ online: true });
        }
      });

    // Fetch initial weather data
    fetchWeatherData();

    return () => {
      supabase.removeChannel(weatherChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  return (
    <WeatherContext.Provider value={{
      weatherData,
      isLoading,
      error,
      refreshWeather: fetchWeatherData,
      activeUsers,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherContextProvider');
  }
  return context;
};
