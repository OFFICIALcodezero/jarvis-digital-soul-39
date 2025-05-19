
import React, { useEffect, useState } from 'react';
import { Activity, Server, Cpu, HardDrive, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: 'cpu' | 'memory' | 'disk' | 'network' | 'battery';
}

interface SystemStatusWidgetProps {
  refreshInterval?: number;
}

const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({
  refreshInterval = 5000
}) => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    // Create a real-time channel for system metrics
    const channel = supabase.channel('system_metrics', {
      config: {
        broadcast: { self: true },
      }
    });
    
    channel
      .on('broadcast', { event: 'metrics_update' }, (payload) => {
        if (payload.payload && payload.payload.metrics) {
          setMetrics(payload.payload.metrics);
          setLastUpdated(new Date());
          setIsConnected(true);
        }
      })
      .subscribe();
      
    // Generate mock metrics initially and at regular intervals
    const generateMetrics = () => {
      const mockMetrics: SystemMetric[] = [
        {
          id: 'cpu',
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 100),
          unit: '%',
          status: 'normal',
          icon: 'cpu'
        },
        {
          id: 'memory',
          name: 'Memory',
          value: 30 + Math.floor(Math.random() * 50),
          unit: '%',
          status: 'normal',
          icon: 'memory'
        },
        {
          id: 'disk',
          name: 'Disk Space',
          value: 50 + Math.floor(Math.random() * 40),
          unit: '%',
          status: 'normal',
          icon: 'disk'
        },
        {
          id: 'network',
          name: 'Network',
          value: Math.floor(Math.random() * 100),
          unit: 'Mbps',
          status: 'normal',
          icon: 'network'
        }
      ];
      
      // Update status based on value
      mockMetrics.forEach(metric => {
        if (metric.value > 90) {
          metric.status = 'critical';
        } else if (metric.value > 75) {
          metric.status = 'warning';
        }
      });
      
      return mockMetrics;
    };
    
    // Set initial metrics
    setMetrics(generateMetrics());
    
    // Setup interval to generate new metrics
    const intervalId = setInterval(() => {
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);
      setLastUpdated(new Date());
      
      // Broadcast metrics to other clients
      channel.send({
        type: 'broadcast',
        event: 'metrics_update',
        payload: { metrics: newMetrics }
      }).catch(err => {
        console.error('Error broadcasting metrics:', err);
        setIsConnected(false);
      });
    }, refreshInterval);
    
    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [refreshInterval]);
  
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'cpu':
        return <Cpu className="h-4 w-4 text-blue-400" />;
      case 'memory':
        return <Server className="h-4 w-4 text-purple-400" />;
      case 'disk':
        return <HardDrive className="h-4 w-4 text-green-400" />;
      case 'network':
        return <Wifi className="h-4 w-4 text-yellow-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="system-status bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium flex items-center">
          <Server className="h-4 w-4 mr-2" /> System Status
        </h3>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Badge variant="outline" className="bg-[#33c3f0]/10 text-[#33c3f0]">
            Real-time
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {getIconComponent(metric.icon)}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-200">{metric.name}</span>
                <Badge 
                  variant="outline" 
                  className={`${metric.status === 'critical' ? 'bg-red-500/20 text-red-400' : metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                >
                  {metric.value}{metric.unit}
                </Badge>
              </div>
              <Progress 
                value={metric.unit === '%' ? metric.value : (metric.value / 100) * 100} 
                className="h-1"
                indicatorClassName={getStatusColor(metric.status)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 mt-4 text-right">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SystemStatusWidget;
