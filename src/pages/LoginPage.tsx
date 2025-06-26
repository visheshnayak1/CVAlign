import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (
    email: string, 
    password: string, 
    rememberMe: boolean, 
    isSignUp: boolean = false,
    fullName?: string
  ) => {
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          data: {
            full_name: fullName,
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Don't navigate immediately for sign up - user needs to verify email
        return;
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Navigate to dashboard or home page after successful sign in
        navigate('/');
      }
    } catch (error: any) {
      // Re-throw the error to be handled by the form
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <h2 className="text-center text-3xl font-bold text-blue-900 mb-2">
          Welcome to CVAlign
        </h2>
        <p className="text-center text-blue-600 mb-8">
          Sign in to your account or create a new one to get started
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-blue-100">
          <LoginForm onSubmit={handleAuth} />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-blue-600 text-sm">
            By signing up, you agree to our{' '}
            <a href="#" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}