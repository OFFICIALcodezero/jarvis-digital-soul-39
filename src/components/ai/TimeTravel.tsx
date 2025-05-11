
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Hourglass, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TimeTravel: React.FC = () => {
  const [timeJumping, setTimeJumping] = React.useState(false);
  const [targetYear, setTargetYear] = React.useState<number>(2075);
  const [currentYear, setCurrentYear] = React.useState<number>(2025);
  
  const handleTimeTravel = () => {
    if (timeJumping) return;
    
    setTimeJumping(true);
    
    // Start time travel animation
    let year = currentYear;
    const direction = targetYear > currentYear ? 1 : -1;
    const interval = setInterval(() => {
      year += direction;
      setCurrentYear(year);
      
      if ((direction === 1 && year >= targetYear) || 
          (direction === -1 && year <= targetYear)) {
        clearInterval(interval);
        setTimeJumping(false);
        
        toast(`Time Travel Complete`, {
          description: `You are now in the year ${targetYear}`
        });
      }
    }, 100);
  };
  
  return (
    <Card className="p-4 bg-black/50 border-jarvis/20 mb-4">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-md font-medium text-jarvis flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Temporal Displacement
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-3">
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-jarvis/70"></div>
            <div className="absolute inset-2 rounded-full bg-black/80 flex items-center justify-center">
              {timeJumping ? (
                <Hourglass className="h-8 w-8 text-jarvis animate-pulse" />
              ) : (
                <div className="text-center">
                  <div className="text-jarvis text-xl font-bold">{currentYear}</div>
                  <div className="text-xs text-gray-400">Current Year</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Target Year</span>
            <span>{targetYear}</span>
          </div>
          <input 
            type="range" 
            min="1900" 
            max="2150" 
            value={targetYear}
            onChange={(e) => setTargetYear(parseInt(e.target.value))}
            className="w-full"
            disabled={timeJumping}
          />
        </div>
        
        <Button 
          onClick={handleTimeTravel} 
          disabled={timeJumping || targetYear === currentYear}
          className="w-full bg-gradient-to-r from-purple-600 to-jarvis hover:from-purple-700 hover:to-jarvis flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {timeJumping ? 'Traversing Timeline...' : 'Initiate Time Jump'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeTravel;
