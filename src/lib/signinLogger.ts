import { supabase } from './supabase';

interface SigninLogData {
  userId?: string;
  email: string;
  signinMethod?: string;
  success: boolean;
  errorMessage?: string;
}

export const logSigninActivity = async (data: SigninLogData) => {
  try {
    // Get client IP and user agent (limited in browser environment)
    const userAgent = navigator.userAgent;
    
    const logEntry = {
      user_id: data.userId || null,
      email: data.email,
      signin_method: data.signinMethod || 'email',
      ip_address: null, // IP address is not accessible from browser
      user_agent: userAgent,
      success: data.success,
      error_message: data.errorMessage || null,
    };

    const { error } = await supabase
      .from('signin_logs')
      .insert([logEntry]);

    if (error) {
      console.error('Error logging signin activity:', error);
    } else {
      console.log('Signin activity logged successfully');
    }
  } catch (error) {
    console.error('Unexpected error logging signin activity:', error);
  }
};

export const getSigninLogs = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('signin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching signin logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching signin logs:', error);
    return [];
  }
};