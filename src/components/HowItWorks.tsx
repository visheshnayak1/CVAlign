import React from 'react';
import { Upload, Search, Users, Calendar } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload CVs & Job Description',
    description: 'Simply upload candidate CVs and paste your job description. Our system accepts multiple formats.',
    step: '01'
  },
  {
    icon: Search,
    title: 'AI Analysis & Matching',
    description: 'Our advanced AI analyzes skills, experience, and requirements to create detailed compatibility scores.',
    step: '02'
  },
  {
    icon: Users,
    title: 'Get Ranked Results',
    description: 'Receive automatically ranked candidates with detailed insights and matching percentages.',
    step: '03'
  },
  {
    icon: Calendar,
    title: 'Schedule Interviews',
    description: 'Our AI agent contacts top candidates and schedules interviews based on your availability.',
    step: '04'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            How CVAlign Works
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Our streamlined process makes hiring simple and efficient. Get from job posting to scheduled interviews in minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mt-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-blue-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}