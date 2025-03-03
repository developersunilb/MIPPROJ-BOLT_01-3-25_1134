// This is the updated AuthPage component with corrected imports

"use client";

import { useState } from 'react';
import { useAuth } from 'hooks/use-auth'; 
import { useToast } from 'hooks/use-toast';
import { auth, googleProvider } from 'lib/firebase'; // Import Firebase auth and Google provider
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Card } from 'components/ui/card';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const { showToast } = useToast(); // Use showToast instead of toast

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        showToast('Account created', 'Your account has been created successfully.'); // Use showToast
      } else {
        await signIn(email, password);
        showToast('Welcome back', 'You have been signed in successfully.'); // Use showToast
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      showToast('Authentication error', error.message || 'An error occurred during authentication.', 'destructive'); // Use showToast
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Signed in with Google', 'You have been signed in successfully.'); // Use showToast
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showToast('Google sign-in error', error.message || 'An error occurred during Google sign-in.', 'destructive'); // Use showToast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input 
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button 
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm"
            disabled={loading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </Button>
        </div>

        <div className="text-center">
          <Button 
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full"
            disabled={loading}
          >
            Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
}
