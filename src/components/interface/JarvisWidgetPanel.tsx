
import React from 'react';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import LocationStatus from '@/components/widgets/LocationStatus';
import QuickChat from '@/components/widgets/QuickChat';

interface JarvisWidgetPanelProps {
  isHackerMode?: boolean;
  className?: string;
}

const JarvisWidgetPanel: React.FC<JarvisWidgetPanelProps> = ({
  isHackerMode = false,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <WeatherWidget isHackerMode={isHackerMode} />
      <LocationStatus isHackerMode={isHackerMode} />
      <QuickChat isHackerMode={isHackerMode} className="md:col-span-1" />
    </div>
  );
};

export default JarvisWidgetPanel;
