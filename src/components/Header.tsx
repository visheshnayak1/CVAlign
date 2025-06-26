import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium">
              Try Demo
            </button>
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
                <Link 
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium text-left"
                >
                  Sign In
                </Link>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Try Demo
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}