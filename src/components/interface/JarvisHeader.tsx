
import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Image, Terminal, Volume2, VolumeX, Settings, Activity, Shield } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import UserProfileButton from '@/components/auth/UserProfileButton';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface JarvisHeaderProps {
  hackerModeActive: boolean;
  activeAssistant: string;
  toggleMute: () => void;
  isMuted: boolean;
}

const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  hackerModeActive,
  activeAssistant,
  toggleMute,
  isMuted
}) => {
  const { user } = useAuth();

  return (
    <div className={`w-full jarvis-panel flex items-center justify-between p-3 ${hackerModeActive ? 'border-red-500/20' : 'border-jarvis-purple/20'}`}>
      <div className="flex items-center">
        <div className={`text-xl font-bold tracking-wider ${hackerModeActive ? 'hacker-text' : 'text-jarvis-purple text-glow'} mr-2`}>JARVIS</div>
        <div className={`text-xs uppercase ${hackerModeActive ? 'bg-red-900/20 text-red-400' : 'bg-jarvis-purple/20 text-jarvis-purple'} px-2 py-0.5 rounded-full flex items-center`}>
          <span>v2.0</span>
          {!hackerModeActive && (
            <span className="ml-1 w-1.5 h-1.5 bg-jarvis-purple rounded-full animate-pulse"></span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/images" className={`flex items-center ${hackerModeActive ? 'text-red-400 hover:text-red-300' : 'text-jarvis-purple hover:text-jarvis-purple/80'} transition-colors`}>
          <Image className="h-4 w-4 mr-1" />
          <span className="text-sm">Image Studio</span>
        </Link>
        
        <Link to="/settings" className={`hidden md:flex items-center ${hackerModeActive ? 'text-red-400 hover:text-red-300' : 'text-jarvis-purple hover:text-jarvis-purple/80'} transition-colors`}>
          <Settings className="h-4 w-4 mr-1" />
          <span className="text-sm">Settings</span>
        </Link>
        
        <div className="flex items-center">
          <Badge variant={hackerModeActive ? "destructive" : "purple"} 
            className={`flex items-center gap-1 ${hackerModeActive ? 'animate-pulse' : ''}`}>
            <div className={`h-2 w-2 rounded-full ${hackerModeActive ? 'bg-red-500' : 'bg-green-400'} animate-pulse`}></div>
            <span>System Online</span>
          </Badge>
        </div>
        
        {activeAssistant !== 'jarvis' && (
          <Badge variant={hackerModeActive ? "destructive" : "purple"}>
            <Bot className="h-3 w-3 mr-1" />
            <span className="capitalize">{activeAssistant}</span>
          </Badge>
        )}
        
        {hackerModeActive && (
          <Badge variant="destructive" className="animate-pulse">
            <Terminal className="h-3 w-3 mr-1" />
            <span>HACKER MODE</span>
          </Badge>
        )}
        
        <button 
          onClick={toggleMute}
          className={`rounded-full p-1.5 transition-colors ${
            hackerModeActive 
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
              : 'text-jarvis-purple hover:text-jarvis-purple/80 hover:bg-jarvis-purple/10'
          }`}
        >
          {isMuted ? 
            <VolumeX className="h-4 w-4" /> : 
            <Volume2 className="h-4 w-4" />
          }
        </button>
        
        {/* Authentication UI */}
        {user ? (
          <UserProfileButton />
        ) : (
          <GoogleSignInButton variant="outline" size="sm" />
        )}
      </div>
    </div>
  );
};

export default JarvisHeader;
