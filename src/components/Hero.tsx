import React from 'react';
import { ArrowRight, Play, Users, BarChart3, Zap } from 'lucide-react';

interface HeroProps {
  onTryDemo: () => void;
}

export default function Hero({ onTryDemo }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered Recruitment Platform
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                Transform Your
                <span className="text-blue-600 block">Hiring Process</span>
              </h1>
              
              <p className="text-xl text-blue-700 mb-8 leading-relaxed">
                CVAlign uses advanced AI to match CVs with job descriptions, rank candidates automatically, 
                and schedule interviews with our intelligent recruiting agent. Streamline your hiring in minutes, not days.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg flex items-center justify-center group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button 
                  onClick={onTryDemo}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg flex items-center justify-center group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  Try Demo
                </button>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">10k+</div>
                  <div className="text-blue-600 text-sm">CVs Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">95%</div>
                  <div className="text-blue-600 text-sm">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">50%</div>
                  <div className="text-blue-600 text-sm">Time Saved</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6 mt-12 lg:mt-0">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-blue-900">Candidate Rankings</h3>
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', score: 95, match: 'Excellent Match' },
                    { name: 'Michael Chen', score: 87, match: 'Good Match' },
                    { name: 'Emily Davis', score: 82, match: 'Good Match' },
                    { name: 'David Wilson', score: 76, match: 'Fair Match' }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">{candidate.name}</div>
                          <div className="text-sm text-blue-600">{candidate.match}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-900">{candidate.score}%</div>
                        <div className="w-16 h-2 bg-blue-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}