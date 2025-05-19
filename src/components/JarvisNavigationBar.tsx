
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MobileNav, DesktopNav } from '@/components/ui/mobile-nav';

const JarvisNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  const handleLaunchClick = () => {
    navigate('/interface');
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-jarvis to-purple-600 flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold text-white">JARVIS</span>
          </Link>
          
          <div className="hidden md:flex space-x-4 items-center">
            <DesktopNav />
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 hidden md:inline">
                  {user.displayName || user.email}
                </span>
                <Button onClick={handleLaunchClick}>
                  Launch JARVIS
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={handleLoginClick} className="hidden md:inline-flex">
                  Sign In
                </Button>
                <Button onClick={handleLaunchClick} className="bg-jarvis hover:bg-jarvis/90 text-white">
                  Launch JARVIS
                </Button>
              </div>
            )}
            
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JarvisNavigationBar;
