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
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session);
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;

        // Update state immediately
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user);
          
          // Log successful sign-in
          try {
            await logSigninActivity({
              userId: session.user.id,
              email: session.user.email || '',
              signinMethod: 'email',
              success: true,
            });
          } catch (error) {
            console.error('Error logging sign-in activity:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out - state cleared');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Log failed sign-in attempt
        try {
          await logSigninActivity({
            email: email.trim().toLowerCase(),
            signinMethod: 'email',
            success: false,
            errorMessage: error.message,
          });
        } catch (logError) {
          console.error('Error logging failed sign-in:', logError);
        }
        
        return { error };
      }

      console.log('Sign in successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      
      // Log unexpected error
      try {
        await logSigninActivity({
          email: email.trim().toLowerCase(),
          signinMethod: 'email',
          success: false,
          errorMessage: 'Unexpected error occurred',
        });
      } catch (logError) {
        console.error('Error logging unexpected sign-in error:', logError);
      }
      
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    try {
      console.log('Attempting to sign up with:', email);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: options?.data || {},
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Log failed sign-up attempt
        try {
          await logSigninActivity({
            email: email.trim().toLowerCase(),
            signinMethod: 'email_signup',
            success: false,
            errorMessage: error.message,
          });
        } catch (logError) {
          console.error('Error logging failed sign-up:', logError);
        }
        
        return { error };
      }

      console.log('Sign up successful:', data);
      
      // Log successful sign-up
      try {
        await logSigninActivity({
          userId: data.user?.id,
          email: email.trim().toLowerCase(),
          signinMethod: 'email_signup',
          success: true,
        });
      } catch (logError) {
        console.error('Error logging successful sign-up:', logError);
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      
      // Log unexpected error
      try {
        await logSigninActivity({
          email: email.trim().toLowerCase(),
          signinMethod: 'email_signup',
          success: false,
          errorMessage: 'Unexpected error occurred',
        });
      } catch (logError) {
        console.error('Error logging unexpected sign-up error:', logError);
      }
      
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      const currentUser = user;
      
      // Clear state immediately to provide instant feedback
      setSession(null);
      setUser(null);

      // Log sign-out activity (do this after clearing state to avoid issues)
      if (currentUser) {
        console.log('Logging sign-out activity...');
        try {
          await logSigninActivity({
            userId: currentUser.id,
            email: currentUser.email || '',
            signinMethod: 'signout',
            success: true,
          });
        } catch (logError) {
          console.error('Error logging sign-out activity:', logError);
          // Don't fail the sign-out process if logging fails
        }
      }

      console.log('Calling supabase.auth.signOut()...');
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all sessions
      });
      
      if (error) {
        console.error('Supabase sign out error:', error);
        // Even if there's an error, we've already cleared the local state
        // This ensures the UI reflects the signed-out state
        return { error };
      }

      console.log('Sign out completed successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      
      // Even on error, ensure local state is cleared
      setSession(null);
      setUser(null);
      
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        console.error('Password reset error:', error);
        
        // Log failed password reset attempt
        try {
          await logSigninActivity({
            email: email.trim().toLowerCase(),
            signinMethod: 'password_reset',
            success: false,
            errorMessage: error.message,
          });
        } catch (logError) {
          console.error('Error logging failed password reset:', logError);
        }
        
        return { error };
      }

      console.log('Password reset email sent');
      
      // Log successful password reset request
      try {
        await logSigninActivity({
          email: email.trim().toLowerCase(),
          signinMethod: 'password_reset',
          success: true,
        });
      } catch (logError) {
        console.error('Error logging successful password reset:', logError);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      
      // Log unexpected error
      try {
        await logSigninActivity({
          email: email.trim().toLowerCase(),
          signinMethod: 'password_reset',
          success: false,
          errorMessage: 'Unexpected error occurred',
        });
      } catch (logError) {
        console.error('Error logging unexpected password reset error:', logError);
      }
      
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