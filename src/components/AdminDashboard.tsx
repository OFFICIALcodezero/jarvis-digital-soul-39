
import React, { useState, useEffect } from 'react';
import { getActivityLogs, clearActivityLogs, UserActivity } from '@/services/moderationService';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, UserX, Filter, Download, BarChart, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<UserActivity[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<UserActivity[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'image' | 'ai' | 'hacker'>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    flaggedActions: 0,
    imageGenerations: 0,
    aiQueries: 0,
    hackerModeUses: 0
  });

  // Load logs and calculate stats
  const loadLogs = () => {
    const activityLogs = getActivityLogs();
    setLogs(activityLogs);
    
    // Apply current filter
    applyFilter(filter, activityLogs);
    
    // Calculate stats
    const uniqueUsers = new Set(activityLogs.map(log => log.userId)).size;
    const flagged = activityLogs.filter(log => log.flagged).length;
    const imageGen = activityLogs.filter(log => log.action === 'image_generation').length;
    const aiQuery = activityLogs.filter(log => log.action === 'ai_query').length;
    const hackerMode = activityLogs.filter(log => log.action === 'hacker_mode').length;
    
    setStats({
      totalUsers: uniqueUsers,
      flaggedActions: flagged,
      imageGenerations: imageGen,
      aiQueries: aiQuery,
      hackerModeUses: hackerMode
    });
  };

  // Apply filter to logs
  const applyFilter = (filterType: 'all' | 'flagged' | 'image' | 'ai' | 'hacker', logsToFilter = logs) => {
    setFilter(filterType);
    
    switch (filterType) {
      case 'flagged':
        setFilteredLogs(logsToFilter.filter(log => log.flagged));
        break;
      case 'image':
        setFilteredLogs(logsToFilter.filter(log => log.action === 'image_generation'));
        break;
      case 'ai':
        setFilteredLogs(logsToFilter.filter(log => log.action === 'ai_query'));
        break;
      case 'hacker':
        setFilteredLogs(logsToFilter.filter(log => log.action === 'hacker_mode'));
        break;
      default:
        setFilteredLogs(logsToFilter);
    }
  };

  // Handle clear logs
  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
      clearActivityLogs();
      loadLogs();
      toast({
        title: "Logs Cleared",
        description: "All activity logs have been cleared.",
        variant: "default"
      });
    }
  };

  // Export logs as CSV
  const exportLogs = () => {
    const headers = ['User ID', 'IP Address', 'Location', 'Timestamp', 'Action', 'Content', 'Flagged', 'Flag Reason'];
    
    const csvRows = [headers];
    logs.forEach(log => {
      const row = [
        log.userId,
        log.ipAddress,
        log.location || 'Unknown',
        new Date(log.timestamp).toISOString(),
        log.action,
        log.content || '',
        log.flagged ? 'YES' : 'NO',
        log.flagReason || ''
      ];
      csvRows.push(row);
    });
    
    const csvContent = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jarvis_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ban user (mock functionality)
  const banUser = (userId: string) => {
    toast({
      title: "User Banned",
      description: `User ${userId} has been banned. This is a demonstration - no actual ban has occurred.`,
      variant: "destructive"
    });
  };

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
    // Refresh logs every 30 seconds
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-purple-500 mr-2" />
          <h1 className="text-2xl font-bold">JARVIS Admin Dashboard</h1>
        </div>
        <div className="space-x-2">
          <Button onClick={loadLogs} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button onClick={exportLogs} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Button onClick={handleClearLogs} size="sm" variant="outline" className="text-red-500 hover:text-red-700">
            Clear Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Unique Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.flaggedActions > 0 ? "border-red-500" : ""}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className={`text-2xl font-bold ${stats.flaggedActions > 0 ? "text-red-500" : ""}`}>
                {stats.flaggedActions}
              </p>
              <p className="text-sm text-gray-500">Flagged Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.imageGenerations}</p>
              <p className="text-sm text-gray-500">Image Generations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.aiQueries}</p>
              <p className="text-sm text-gray-500">AI Queries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.hackerModeUses}</p>
              <p className="text-sm text-gray-500">Hacker Mode Uses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.flaggedActions > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {stats.flaggedActions} action(s) have been flagged for suspicious or prohibited content.
            Please review them below.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Activity Logs
          </CardTitle>
          <CardDescription>
            View and filter user activity across the JARVIS platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all" onClick={() => applyFilter('all')}>All Logs</TabsTrigger>
              <TabsTrigger value="flagged" onClick={() => applyFilter('flagged')} 
                className={stats.flaggedActions > 0 ? "text-red-500" : ""}>
                Flagged
              </TabsTrigger>
              <TabsTrigger value="image" onClick={() => applyFilter('image')}>Image Gen</TabsTrigger>
              <TabsTrigger value="ai" onClick={() => applyFilter('ai')}>AI Queries</TabsTrigger>
              <TabsTrigger value="hacker" onClick={() => applyFilter('hacker')}>Hacker Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value={filter}>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP / Location</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log, index) => (
                        <TableRow key={index} className={log.flagged ? "bg-red-50" : ""}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                            <div className="text-gray-400 text-[10px]">
                              {format(new Date(log.timestamp), 'yyyy-MM-dd')}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.userId.substring(0, 10)}...</TableCell>
                          <TableCell>
                            {log.ipAddress}
                            <div className="text-xs text-gray-500">{log.location}</div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              log.action === 'image_generation' ? 'bg-blue-100 text-blue-800' :
                              log.action === 'ai_query' ? 'bg-green-100 text-green-800' :
                              log.action === 'hacker_mode' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.action.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {log.content ? log.content.substring(0, 50) + (log.content.length > 50 ? '...' : '') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {log.flagged ? (
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                                Flagged
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                OK
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => banUser(log.userId)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Stats</CardTitle>
          <CardDescription>Usage analytics and system performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <BarChart className="h-24 w-24 text-gray-300" />
            <p className="text-center text-gray-500">Analytics charts would appear here in a full implementation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
