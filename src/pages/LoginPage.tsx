import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    // Simulate login API call
    console.log('Login attempt:', { email, password, rememberMe });
    
    // Add your authentication logic here
    // For now, we'll just simulate a successful login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to dashboard or handle successful login
    alert('Login successful! (This is a demo)');
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
          Welcome back
        </h2>
        <p className="text-center text-blue-600 mb-8">
          Sign in to your CVAlign account to continue
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-blue-100">
          <LoginForm onSubmit={handleLogin} />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-blue-600">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}