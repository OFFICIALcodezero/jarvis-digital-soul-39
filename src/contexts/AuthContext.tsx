
import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseUser, getCurrentUser, signInWithGoogle, signOut } from '@/services/firebaseService';

interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  signIn: () => Promise<FirebaseUser | null>;
  logOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signIn = async () => {
    const user = await signInWithGoogle();
    setUser(user);
    return user;
  };

  const logOut = async () => {
    const success = await signOut();
    if (success) {
      setUser(null);
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
