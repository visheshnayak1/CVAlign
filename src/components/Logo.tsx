import React from 'react';
import { Target, Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Target className="h-8 w-8 text-blue-600" />
        <Zap className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
      </div>
      <span className="text-2xl font-bold text-blue-800">CVAlign</span>
    </div>
  );
}