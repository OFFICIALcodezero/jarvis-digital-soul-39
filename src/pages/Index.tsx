
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ArcReactor from '@/components/background/ArcReactor';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1019] to-[#121624] text-white p-4">
      <ArcReactor />
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-primary">
          J.A.R.V.I.S
        </h1>
        <div className="glow-blue-sm text-xl md:text-2xl font-light mb-8 text-[#d6d6ff]">
          Just A Rather Very Intelligent System
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg md:text-xl mb-8 text-[#c7d3ff]">
            Welcome to your personal AI assistant with advanced intelligence, voice control, and futuristic interface. Inspired by Tony Stark's companion.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link to="/startup">
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-[#1eaedb] to-[#33c3f0] hover:from-[#33c3f0] hover:to-[#1eaedb] border-none rounded-lg transition-all duration-300 transform hover:scale-105 text-white shadow-neon">
              <span>Initialize JARVIS</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {!user && (
            <div className="mt-4 md:mt-0">
              <GoogleSignInButton variant="outline" size="lg" />
            </div>
          )}
        </div>
        
        {user && (
          <div className="mt-4 text-jarvis">
            Welcome back, {user.displayName || user.email}
          </div>
        )}
        
        <div className="mt-16 text-[#8a8a9b] text-sm">
          <p>© {new Date().getFullYear()} • JARVIS Digital Soul v1.0</p>
          <p className="mt-2">Access all capabilities through voice commands or chat interface</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
