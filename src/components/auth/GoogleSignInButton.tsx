
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

interface GoogleSignInButtonProps {
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  variant = 'default', 
  size = 'sm' 
}) => {
  const { user, signIn, logOut, isLoading } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await logOut();
    } else {
      await signIn();
    }
  };

  const getButtonStyle = () => {
    if (variant === 'default') {
      return 'bg-white text-black hover:bg-gray-100';
    } else if (variant === 'outline') {
      return 'bg-transparent border border-white text-white hover:bg-white/10';
    } else {
      return 'bg-white/10 text-white hover:bg-white/20';
    }
  };

  const getSizeStyle = () => {
    if (size === 'sm') {
      return 'h-8 px-3 text-xs';
    } else if (size === 'lg') {
      return 'h-12 px-5';
    } else {
      return 'h-10 px-4';
    }
  };

  return (
    <Button
      className={`${getButtonStyle()} ${getSizeStyle()} flex items-center gap-2 transition-all rounded-md`}
      onClick={handleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : user ? (
        <>
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </>
      )}
    </Button>
  );
};

export default GoogleSignInButton;
