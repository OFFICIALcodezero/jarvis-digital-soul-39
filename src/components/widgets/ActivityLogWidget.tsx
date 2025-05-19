
import React, { useEffect, useState } from 'react';
import { Activity, Clock, User, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityLog {
  id: string;
  type: 'command' | 'weather' | 'face' | 'chat' | 'alert' | 'system';
  message: string;
  user?: string;
  timestamp: Date;
}

interface ActivityLogWidgetProps {
  maxItems?: number;
  maxHeight?: string;
}

const ActivityLogWidget: React.FC<ActivityLogWidgetProps> = ({
  maxItems = 10,
  maxHeight = '250px'
}) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userId] = useState<string>(`user_${Math.random().toString(36).substring(2, 9)}`);
  const [userName] = useState<string>(`User_${Math.floor(Math.random() * 1000)}`);
  
  useEffect(() => {
    // Connect to activity log channel
    const channel = supabase.channel('activity_logs', {
      config: {
        broadcast: { self: true },
        presence: { key: userId },
      }
    });

    channel
      .on('broadcast', { event: 'new_activity' }, (payload) => {
        if (payload.payload && payload.payload.activity) {
          const activity = payload.payload.activity as ActivityLog;
          
          // Add to activity list
          setActivities(prev => {
            const newActivities = [activity, ...prev].slice(0, maxItems);
            return newActivities;
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to activity logs channel');
          
          // Track our presence
          await channel.track({
            userName,
            joinedAt: new Date().toISOString()
          });
          
          // Add system message about our own connection
          const connectActivity: ActivityLog = {
            id: `connect_${Date.now()}`,
            type: 'system',
            message: `You connected to the activity log system`,
            timestamp: new Date()
          };
          
          setActivities(prev => [connectActivity, ...prev].slice(0, maxItems));
          
          // Broadcast to others that we've connected
          await channel.send({
            type: 'broadcast',
            event: 'new_activity',
            payload: {
              activity: {
                id: `user_connect_${Date.now()}`,
                type: 'system',
                message: `${userName} connected to the system`,
                user: userName,
                timestamp: new Date()
              }
            }
          });
        }
      });

    // Listen for voice commands to log them
    const voiceChannel = supabase.channel('voice_commands');
    voiceChannel
      .on('broadcast', { event: 'voice_command' }, async (payload) => {
        if (payload.payload && payload.payload.command && payload.payload.userName) {
          // Log the command as an activity
          const commandActivity: ActivityLog = {
            id: `command_${Date.now()}`,
            type: 'command',
            message: payload.payload.command,
            user: payload.payload.userName,
            timestamp: new Date()
          };
          
          // Update our local state
          setActivities(prev => [commandActivity, ...prev].slice(0, maxItems));
          
          // Broadcast to activity log channel
          await channel.send({
            type: 'broadcast',
            event: 'new_activity',
            payload: { activity: commandActivity }
          }).catch(err => console.error('Error broadcasting activity:', err));
        }
      })
      .subscribe();
    
    // Listen for weather alerts
    const weatherChannel = supabase.channel('weather_updates');
    weatherChannel
      .on('broadcast', { event: 'weather_alert' }, async (payload) => {
        if (payload.payload && payload.payload.alert) {
          const alert = payload.payload.alert;
          
          // Log the weather alert as an activity
          const alertActivity: ActivityLog = {
            id: `weather_${Date.now()}`,
            type: 'alert',
            message: `Weather alert: ${alert.message}`,
            timestamp: new Date()
          };
          
          // Update our local state
          setActivities(prev => [alertActivity, ...prev].slice(0, maxItems));
          
          // Broadcast to activity log channel
          await channel.send({
            type: 'broadcast',
            event: 'new_activity',
            payload: { activity: alertActivity }
          }).catch(err => console.error('Error broadcasting activity:', err));
        }
      })
      .subscribe();
    
    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(voiceChannel);
      supabase.removeChannel(weatherChannel);
    };
  }, [maxItems, userId, userName]);
  
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'command':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'weather':
        return <Activity className="h-4 w-4 text-green-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'face':
        return <User className="h-4 w-4 text-purple-400" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getActivityTypeColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'command':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'weather':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'alert':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'face':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'chat':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="activity-log bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2" /> Activity Log
        </h3>
        <Badge variant="outline" className="bg-[#33c3f0]/10 text-[#33c3f0]">
          Real-time
        </Badge>
      </div>
      
      <ScrollArea className={`pr-3 -mr-3`} style={{ maxHeight }}>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-2">
              No activities recorded yet
            </div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-2 border rounded-md bg-black/30 border-gray-800/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center">
                    {getActivityIcon(activity.type)}
                    <div className="ml-2">
                      <p className="text-sm text-white">{activity.message}</p>
                      {activity.user && (
                        <p className="text-xs text-gray-400">By: {activity.user}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityLogWidget;
