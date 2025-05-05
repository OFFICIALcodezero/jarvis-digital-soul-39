
import React, { useEffect, useState } from 'react';
import { useJarvisChat } from './JarvisChatContext';
import { getWeatherData } from '@/services/weatherService';
import { getNewsData } from '@/services/newsService';
import WeatherWidget from './widgets/WeatherWidget';
import NewsWidget from './widgets/NewsWidget';
import BrainPanel from './BrainPanel';
import CalendarWidget from './widgets/CalendarWidget';
import ImageGenerationWidget from './widgets/ImageGenerationWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Calendar, CloudSun, Image, Newspaper } from 'lucide-react';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  forecast: {
    day: string;
    temperature: number;
    condition: string;
    icon: string;
  }[];
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category?: string;
}

interface NewsData {
  articles: NewsArticle[];
  lastUpdated?: Date;
}

interface JarvisDashboardProps {
  compact?: boolean;
}

const JarvisDashboard: React.FC<JarvisDashboardProps> = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState('brain');
  const { hackerModeActive } = useJarvisChat();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);

  useEffect(() => {
    // Fetch initial data for widgets
    const fetchData = async () => {
      try {
        const weatherData = await getWeatherData();
        setWeather(weatherData);

        const newsData = await getNewsData();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (compact) {
    // Compact dashboard for sidebar or small spaces
    return (
      <div className="space-y-4">
        <div className="p-2">
          <h3 className={`text-sm font-semibold ${hackerModeActive ? 'text-red-400' : 'text-jarvis'}`}>
            JARVIS Dashboard
          </h3>
        </div>
        
        {weather && (
          <WeatherWidget isCompact={true} />
        )}
        
        {news && news.articles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400">Latest News</h4>
            <p className="text-xs truncate">{news.articles[0].title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${hackerModeActive ? 'border-red-500/20' : 'border-jarvis/20'} overflow-hidden`}>
      <Tabs defaultValue="brain" onValueChange={setActiveTab} className="w-full">
        <div className={`px-4 py-2 ${hackerModeActive ? 'bg-black/60' : 'bg-black/40'}`}>
          <TabsList className={`grid grid-cols-4 ${hackerModeActive ? 'bg-black/60' : 'bg-black/40'}`}>
            <TabsTrigger 
              value="brain" 
              className={
                activeTab === "brain" 
                  ? (hackerModeActive ? 'text-red-400 bg-red-900/20' : 'text-jarvis bg-jarvis/20') 
                  : ''
              }
            >
              <Brain className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Brain</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="weather"
              className={
                activeTab === "weather" 
                  ? (hackerModeActive ? 'text-red-400 bg-red-900/20' : 'text-jarvis bg-jarvis/20') 
                  : ''
              }
            >
              <CloudSun className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="news"
              className={
                activeTab === "news" 
                  ? (hackerModeActive ? 'text-red-400 bg-red-900/20' : 'text-jarvis bg-jarvis/20') 
                  : ''
              }
            >
              <Newspaper className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="calendar"
              className={
                activeTab === "calendar" 
                  ? (hackerModeActive ? 'text-red-400 bg-red-900/20' : 'text-jarvis bg-jarvis/20') 
                  : ''
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="brain" className="max-h-[600px] overflow-auto">
          <BrainPanel isHackerMode={hackerModeActive} />
        </TabsContent>
        
        <TabsContent value="weather">
          <div className="p-4">
            <WeatherWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="news">
          <div className="p-4">
            <NewsWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="p-4">
            <CalendarWidget />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JarvisDashboard;
