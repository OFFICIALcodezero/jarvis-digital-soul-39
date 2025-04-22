
import React from 'react';
import { NewsArticle } from '@/services/newsService';
import { Newspaper } from 'lucide-react';

interface NewsWidgetProps {
  articles: NewsArticle[];
  isCompact?: boolean;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ articles, isCompact = false }) => {
  if (!articles || articles.length === 0) return null;
  
  if (isCompact) {
    return (
      <div className="news-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center">
          <Newspaper className="h-5 w-5 text-[#33c3f0]" />
          <div className="ml-2 text-sm">
            <span className="text-white font-medium">Latest:</span>
            <span className="text-gray-300 ml-1">{articles[0].title}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="news-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Latest News</h3>
        <span className="text-xs text-gray-300">Top Headlines</span>
      </div>
      
      <div className="space-y-3">
        {articles.slice(0, 3).map((article, index) => (
          <div key={index} className="border-b border-gray-700 pb-2 last:border-0">
            <div className="text-sm font-medium text-white">{article.title}</div>
            <div className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>{article.source}</span>
              <span className="capitalize">{article.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget;
