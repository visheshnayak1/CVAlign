import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Monitor, Smartphone, RefreshCw } from 'lucide-react';
import { getSigninLogs } from '../lib/signinLogger';
import { useAuth } from '../contexts/AuthContext';

interface SigninLog {
  id: string;
  user_id: string;
  email: string;
  signin_method: string;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export default function SigninLogs() {
  const [logs, setLogs] = useState<SigninLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getSigninLogs(20);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching signin logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    
    return <Monitor className="h-4 w-4" />;
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'email':
        return 'Email/Password';
      case 'email_signup':
        return 'Sign Up';
      case 'password_reset':
        return 'Password Reset';
      case 'signout':
        return 'Sign Out';
      default:
        return method;
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <p className="text-blue-600">Please sign in to view your activity logs</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Sign-in Activity
          </h3>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-blue-600 text-sm mt-1">Recent authentication activity for your account</p>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                    <div className="h-3 bg-blue-50 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-600">No sign-in activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <div className={`p-2 rounded-full ${
                  log.success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {log.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-900">
                      {getMethodLabel(log.signin_method)}
                      {log.success ? ' - Success' : ' - Failed'}
                    </p>
                    <div className="flex items-center text-blue-600">
                      {getDeviceIcon(log.user_agent)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-blue-600 mt-1">
                    {formatDate(log.created_at)}
                  </p>
                  
                  {!log.success && log.error_message && (
                    <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                      Error: {log.error_message}
                    </p>
                  )}
                  
                  {log.user_agent && (
                    <p className="text-xs text-blue-500 mt-1 truncate">
                      {log.user_agent}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}