
import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, Clock, CloudSun } from 'lucide-react';

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
};

const getRandomUsage = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const SystemData: React.FC = () => {
  const [time, setTime] = useState(getCurrentTime());
  const [cpuUsage, setCpuUsage] = useState(getRandomUsage(10, 40));
  const [memoryUsage, setMemoryUsage] = useState(getRandomUsage(30, 60));
  const [weather, setWeather] = useState({ temp: 72, condition: 'Clear' });

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(getCurrentTime());
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
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(usageInterval);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30 flex items-center space-x-2 backdrop-blur-sm">
        <Clock className="w-4 h-4 text-cyan-400" />
        <div>
          <div className="text-slate-400">System Time</div>
          <div className="text-cyan-300 font-mono">{time}</div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30 flex items-center space-x-2 backdrop-blur-sm">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <div>
          <div className="text-slate-400">CPU Usage</div>
          <div className="flex items-center">
            <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${cpuUsage}%` }}
              ></div>
            </div>
            <span className="text-cyan-300 ml-2 font-mono">{cpuUsage}%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30 flex items-center space-x-2 backdrop-blur-sm">
        <Monitor className="w-4 h-4 text-cyan-400" />
        <div>
          <div className="text-slate-400">Memory</div>
          <div className="flex items-center">
            <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
            <span className="text-cyan-300 ml-2 font-mono">{memoryUsage}%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30 flex items-center space-x-2 backdrop-blur-sm">
        <CloudSun className="w-4 h-4 text-cyan-400" />
        <div>
          <div className="text-slate-400">Weather</div>
          <div className="text-cyan-300 font-mono">{weather.temp}°F | {weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemData;
