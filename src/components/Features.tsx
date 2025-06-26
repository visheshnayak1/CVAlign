import React from 'react';
import { Target, Brain, Mail, BarChart3, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Smart CV Matching',
    description: 'Advanced AI algorithms analyze CVs against job descriptions to find the perfect candidates with precision matching.'
  },
  {
    icon: BarChart3,
    title: 'Automated Rankings',
    description: 'Get instant candidate rankings based on skills, experience, and job requirements. No manual screening needed.'
  },
  {
    icon: Mail,
    title: 'AI Interview Scheduling',
    description: 'Our intelligent agent automatically schedules interviews with top candidates and sends personalized invitations.'
  },
  {
    icon: Brain,
    title: 'Tavus AI Integration',
    description: 'Leverage cutting-edge AI for video interviews and candidate assessment with natural conversation flow.'
  },
  {
    icon: Clock,
    title: 'Time Efficiency',
    description: 'Reduce hiring time by 50% with automated processes and intelligent candidate pre-screening.'
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with GDPR compliance and data protection for all candidate information.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Powerful Features for Modern Recruiting
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Everything you need to streamline your hiring process and find the best candidates faster than ever before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-blue-50 p-8 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-6 group-hover:bg-blue-700 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-blue-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}