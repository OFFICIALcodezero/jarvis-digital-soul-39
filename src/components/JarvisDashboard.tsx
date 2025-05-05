
import React, { useState, useEffect } from 'react';
import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';
import CalendarWidget from './widgets/CalendarWidget';
import { WeatherData, getWeatherForecast } from '@/services/weatherService';
import { NewsArticle, getNewsUpdates } from '@/services/newsService';
import { CalendarEvent, getCalendarEvents } from '@/services/timeCalendarService';
import { Clock, Newspaper, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface JarvisDashboardProps {
  weatherData?: WeatherData;
  newsArticles?: NewsArticle[];
  calendarEvents?: CalendarEvent[];
}

const JarvisDashboard: React.FC<JarvisDashboardProps> = ({
  weatherData: initialWeatherData,
  newsArticles: initialNewsArticles,
  calendarEvents: initialCalendarEvents
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(initialWeatherData);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[] | undefined>(initialNewsArticles);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[] | undefined>(initialCalendarEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data if not provided
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!initialWeatherData && !weatherData) {
        try {
          const data = await getWeatherForecast();
          setWeatherData(data);
        } catch (error) {
          console.error('Failed to fetch weather:', error);
        }
      }
      
      if (!initialCalendarEvents && !calendarEvents) {
        try {
          const events = await getCalendarEvents();
          setCalendarEvents(events);
        } catch (error) {
          console.error('Failed to fetch calendar events:', error);
        }
      }
      
      if (!initialNewsArticles && !newsArticles) {
        try {
          const news = await getNewsUpdates({ count: 5 });
          setNewsArticles(news);
        } catch (error) {
          console.error('Failed to fetch news:', error);
        }
      }
    };
    
    fetchDashboardData();
  }, [initialWeatherData, initialNewsArticles, initialCalendarEvents, weatherData, newsArticles, calendarEvents]);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      const [weather, news, events] = await Promise.all([
        getWeatherForecast(),
        getNewsUpdates({ count: 5 }),
        getCalendarEvents()
      ]);
      
      setWeatherData(weather);
      setNewsArticles(news);
      setCalendarEvents(events);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="jarvis-dashboard p-4 space-y-4">
      {/* Header with time and refresh */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-[#33c3f0]" />
          <div className="text-xl text-[#33c3f0]">{currentTime}</div>
        </div>
        <Button 
          size="sm"
          variant="outline"
          className="border-[#33c3f0]/30 text-[#33c3f0] hover:bg-[#33c3f0]/10"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main widgets layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* News Widget - Now visible by default */}
        <div className="col-span-1 md:col-span-2">
          <NewsWidget articles={newsArticles} />
        </div>
        
        {weatherData && (
          <WeatherWidget data={weatherData} />
        )}
        {calendarEvents && calendarEvents.length > 0 && (
          <CalendarWidget events={calendarEvents} />
        )}
      </div>

      {/* Compact row for mobile view */}
      <div className="md:hidden space-y-2 mt-2">
        <NewsWidget articles={newsArticles} isCompact={true} />
        {weatherData && (
          <WeatherWidget data={weatherData} isCompact={true} />
        )}
        {calendarEvents && calendarEvents.length > 0 && (
          <CalendarWidget events={calendarEvents} isCompact={true} />
        )}
      </div>
    </div>
  );
};

export default JarvisDashboard;
