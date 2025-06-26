import React from 'react';
import Logo from './Logo';
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <div className="text-white">
                  <Logo />
                </div>
              </div>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Revolutionizing recruitment with AI-powered CV matching and intelligent interview scheduling.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">API</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-200">
                <Mail className="h-4 w-4 mr-3" />
                hello@cvalign.com
              </li>
              <li className="flex items-center text-blue-200">
                <Phone className="h-4 w-4 mr-3" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start text-blue-200">
                <MapPin className="h-4 w-4 mr-3 mt-1" />
                <span>123 Innovation Drive<br />San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2025 CVAlign. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}