
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import UserProfileButton from './UserProfileButton';

const AuthStatus: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <span className="text-xs text-white/70">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      {user ? (
        <UserProfileButton />
      ) : (
        <GoogleSignInButton variant="subtle" size="sm" />
      )}
    </div>
  );
};

export default AuthStatus;
