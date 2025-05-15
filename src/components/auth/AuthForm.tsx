
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { GithubIcon, Facebook, Mail } from 'lucide-react';
import { FirebaseUser } from '@/services/firebaseService';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/interface');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Here, replace with actual Firebase email auth implementation later
      const mockUser: FirebaseUser = {
        uid: '123456',
        displayName: 'Test User',
        email: email,
        photoURL: null
      };
      
      // Simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: isSignUp ? "Account Created" : "Login Successful",
        description: isSignUp ? "Your account has been created successfully" : "Welcome back!"
      });
      
      navigate('/interface');
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    
    try {
      // For now, we'll just call the existing signIn function for Google
      // and log for other providers
      if (provider === 'google') {
        await signIn();
      } else {
        console.log(`Logging in with ${provider}`);
        // Mock successful login
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Login Successful",
          description: `Logged in with ${provider}`
        });
      }
      navigate('/interface');
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to authenticate with ${provider}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp 
            ? 'Sign up to access all features' 
            : 'Sign in to your account to continue'}
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 mx-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleEmailAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-background text-foreground"
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⚙️</span> 
                    Processing...
                  </span>
                : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
              
              <Button 
                type="button"
                variant="link" 
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : 'Don\'t have an account? Sign Up'}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="social">
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In with Google
            </Button>
            
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              <Facebook className="w-5 h-5" />
              Sign In with Facebook
            </Button>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="github">
          <CardContent className="flex justify-center pt-4 pb-6">
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800" 
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
            >
              <GithubIcon className="w-5 h-5" />
              Sign In with GitHub
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
