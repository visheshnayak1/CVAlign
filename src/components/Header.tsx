import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, User, LogOut, Settings, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      setIsUserMenuOpen(false);
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
      } else {
        // Navigate to home page after successful sign out
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error signing out:', error);
      alert('Unexpected error signing out. Please try again.');
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
              How It Works
            </a>
            <a href="#pricing" className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
              Pricing
            </a>
            <a href="#about" className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
              About
            </a>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <span className="text-blue-900 font-medium">{getUserDisplayName()}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-blue-100">
                      <p className="text-sm font-medium text-blue-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-blue-600">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center"
                    >
                      <Activity className="h-4 w-4 mr-3" />
                      Activity Logs
                    </Link>
                    
                    <hr className="my-2 border-blue-100" />
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium">
                  Try Demo
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-blue-700 hover:text-blue-900 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-blue-700 hover:text-blue-900 font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-blue-700 hover:text-blue-900 font-medium">
                Pricing
              </a>
              <a href="#about" className="text-blue-700 hover:text-blue-900 font-medium">
                About
              </a>
              
              <div className="flex flex-col space-y-2 pt-4">
                {loading ? (
                  <div className="w-full h-10 bg-blue-100 rounded-lg animate-pulse"></div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-3 py-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">{getUserDisplayName()}</p>
                        <p className="text-xs text-blue-600">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center block"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 font-medium text-left"
                    >
                      Sign In
                    </Link>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                      Try Demo
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}