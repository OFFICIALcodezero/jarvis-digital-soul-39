
import React from 'react';
import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';
import CalendarWidget from './widgets/CalendarWidget';
import { WeatherData } from '@/services/weatherService';
import { NewsArticle } from '@/services/newsService';
import { CalendarEvent } from '@/services/timeCalendarService';
import { Clock } from 'lucide-react';

interface JarvisDashboardProps {
  weatherData?: WeatherData;
  newsArticles?: NewsArticle[];
  calendarEvents?: CalendarEvent[];
}

const JarvisDashboard: React.FC<JarvisDashboardProps> = ({ 
  weatherData,
  newsArticles,
  calendarEvents
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');
  
  React.useEffect(() => {
    // Update time every second
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
  
  return (
    <div className="jarvis-dashboard p-4 space-y-4">
      {/* Time display */}
      <div className="flex justify-center items-center space-x-2 mb-2">
        <Clock className="h-5 w-5 text-[#33c3f0]" />
        <div className="text-xl text-[#33c3f0]">{currentTime}</div>
      </div>
      
      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherData && (
          <WeatherWidget data={weatherData} />
        )}
        
        {newsArticles && newsArticles.length > 0 && (
          <NewsWidget articles={newsArticles} />
        )}
        
        {calendarEvents && calendarEvents.length > 0 && (
          <CalendarWidget events={calendarEvents} />
        )}
      </div>
      
      {/* Compact row for mobile view */}
      <div className="md:hidden space-y-2 mt-2">
        {weatherData && (
          <WeatherWidget data={weatherData} isCompact={true} />
        )}
        
        {newsArticles && newsArticles.length > 0 && (
          <NewsWidget articles={newsArticles} isCompact={true} />
        )}
        
        {calendarEvents && calendarEvents.length > 0 && (
          <CalendarWidget events={calendarEvents} isCompact={true} />
        )}
      </div>
    </div>
  );
};

export default JarvisDashboard;
