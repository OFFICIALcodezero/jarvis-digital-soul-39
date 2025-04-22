
import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, Clock, CloudSun, Wifi, Battery, Server, Activity } from 'lucide-react';

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
};

const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getRandomUsage = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const SystemData: React.FC = () => {
  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(getCurrentDate());
  const [cpuUsage, setCpuUsage] = useState(getRandomUsage(10, 40));
  const [memoryUsage, setMemoryUsage] = useState(getRandomUsage(30, 60));
  const [networkSpeed, setNetworkSpeed] = useState(getRandomUsage(50, 150));
  const [batteryLevel, setBatteryLevel] = useState(getRandomUsage(60, 95));
  const [systemTemp, setSystemTemp] = useState(getRandomUsage(35, 45));
  const [weather, setWeather] = useState({ temp: 72, condition: 'Clear' });

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(getCurrentTime());
      setDate(getCurrentDate());
    }, 1000);

    const usageInterval = setInterval(() => {
      setCpuUsage(prev => {
        const fluctuation = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + fluctuation * Math.floor(Math.random() * 3);
        return Math.max(5, Math.min(95, newValue));
      });
      
      setMemoryUsage(prev => {
        const fluctuation = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + fluctuation * Math.floor(Math.random() * 2);
        return Math.max(20, Math.min(80, newValue));
      });
      
      setNetworkSpeed(prev => {
        const fluctuation = Math.random() > 0.5 ? 5 : -5;
        const newValue = prev + fluctuation * Math.floor(Math.random() * 2);
        return Math.max(30, Math.min(200, newValue));
      });
      
      setSystemTemp(prev => {
        const fluctuation = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + fluctuation * 0.5;
        return Math.max(30, Math.min(55, newValue));
      });
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(usageInterval);
    };
  }, []);

  // Try to get actual battery level if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
      {/* Time & Date */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <Clock className="w-4 h-4 text-jarvis" />
        <div>
          <div className="text-gray-400 text-xs">System Time</div>
          <div className="text-jarvis font-mono flex flex-col">
            <span>{time}</span>
            <span className="text-jarvis/70 text-[10px]">{date}</span>
          </div>
        </div>
      </div>
      
      {/* CPU Monitor with circular gauge */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <div className="relative w-8 h-8 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-8 h-8 transform -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#1a2e3b" strokeWidth="2" />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="url(#cpuGradient)" 
              strokeWidth="2" 
              strokeDasharray={`${cpuUsage} 100`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1EAEDB" />
                <stop offset="100%" stopColor="#33C3F0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-3 h-3 text-jarvis" />
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">CPU</div>
          <div className="flex flex-col">
            <span className="text-jarvis font-mono">{cpuUsage}%</span>
            <span className="text-jarvis/70 text-[10px]">{systemTemp}°C</span>
          </div>
        </div>
      </div>
      
      {/* Memory */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <Server className="w-4 h-4 text-jarvis" />
        <div>
          <div className="text-gray-400 text-xs">Memory</div>
          <div className="flex items-center">
            <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-jarvis to-jarvisLight"
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
            <span className="text-jarvis ml-2 font-mono">{memoryUsage}%</span>
          </div>
        </div>
      </div>
      
      {/* Network Speed */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <Wifi className="w-4 h-4 text-jarvis" />
        <div>
          <div className="text-gray-400 text-xs">Network</div>
          <div className="flex items-center">
            <Activity className="w-3 h-3 text-jarvis/70 mr-1" />
            <span className="text-jarvis font-mono">{networkSpeed} Mbps</span>
          </div>
        </div>
      </div>
      
      {/* Battery Level */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <Battery className="w-4 h-4 text-jarvis" />
        <div>
          <div className="text-gray-400 text-xs">Power</div>
          <div className="flex items-center">
            <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${batteryLevel > 20 ? 'bg-gradient-to-r from-jarvis to-jarvisLight' : 'bg-red-500'}`}
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
            <span className="text-jarvis ml-2 font-mono">{batteryLevel}%</span>
          </div>
        </div>
      </div>
      
      {/* Weather Data */}
      <div className="jarvis-panel p-3 flex items-center space-x-2">
        <CloudSun className="w-4 h-4 text-jarvis" />
        <div>
          <div className="text-gray-400 text-xs">Weather</div>
          <div className="text-jarvis font-mono">{weather.temp}°F | {weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemData;
