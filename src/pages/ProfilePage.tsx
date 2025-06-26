import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SigninLogs from '../components/SigninLogs';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-600 mb-4">Please sign in to view your profile</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getUserDisplayName().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">{getUserDisplayName()}</h1>
                <p className="text-blue-600 flex items-center mt-2">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-blue-500 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Email Address
                </label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-900">{user.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Email Verified
                </label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className={`font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-orange-600'}`}>
                    {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Account Created
                </label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-900">{formatDate(user.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Last Sign In
                </label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-900">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Activity
            </h2>
            
            <SigninLogs />
          </div>
        </div>
      </div>
    </div>
  );
}