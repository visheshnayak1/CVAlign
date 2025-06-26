import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logSigninActivity } from '../lib/signinLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user);
          
          // Log successful sign-in
          if (session?.user) {
            await logSigninActivity({
              userId: session.user.id,
              email: session.user.email || '',
              signinMethod: 'email',
              success: true,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Log failed sign-in attempt
        await logSigninActivity({
          email,
          signinMethod: 'email',
          success: false,
          errorMessage: error.message,
        });
        
        return { error };
      }

      console.log('Sign in successful:', data);
      
      // Note: Successful sign-in will be logged by the auth state change listener
      // to ensure we have the user ID available
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      
      // Log unexpected error
      await logSigninActivity({
        email,
        signinMethod: 'email',
        success: false,
        errorMessage: 'Unexpected error occurred',
      });
      
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Log failed sign-up attempt
        await logSigninActivity({
          email,
          signinMethod: 'email_signup',
          success: false,
          errorMessage: error.message,
        });
        
        return { error };
      }

      console.log('Sign up successful:', data);
      
      // Log successful sign-up
      await logSigninActivity({
        userId: data.user?.id,
        email,
        signinMethod: 'email_signup',
        success: true,
      });
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required');
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      
      // Log unexpected error
      await logSigninActivity({
        email,
        signinMethod: 'email_signup',
        success: false,
        errorMessage: 'Unexpected error occurred',
      });
      
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const currentUser = user;
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      console.log('Sign out successful');
      
      // Log sign-out activity
      if (currentUser) {
        await logSigninActivity({
          userId: currentUser.id,
          email: currentUser.email || '',
          signinMethod: 'signout',
          success: true,
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        
        // Log failed password reset attempt
        await logSigninActivity({
          email,
          signinMethod: 'password_reset',
          success: false,
          errorMessage: error.message,
        });
        
        return { error };
      }

      console.log('Password reset email sent');
      
      // Log successful password reset request
      await logSigninActivity({
        email,
        signinMethod: 'password_reset',
        success: true,
      });
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      
      // Log unexpected error
      await logSigninActivity({
        email,
        signinMethod: 'password_reset',
        success: false,
        errorMessage: 'Unexpected error occurred',
      });
      
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}