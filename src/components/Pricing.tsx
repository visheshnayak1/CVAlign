import React from 'react';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    period: '14 days',
    description: 'Perfect for trying out CVAlign',
    features: [
      'Up to 10 CV analyses',
      'Basic matching algorithm',
      'Email support',
      'Dashboard access'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Pro',
    price: '49',
    period: 'per month',
    description: 'Ideal for small to medium teams',
    features: [
      'Unlimited CV analyses',
      'Advanced AI matching',
      'Interview scheduling agent',
      'Priority support',
      'Custom job templates',
      'Analytics dashboard'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Organization',
    price: '149',
    period: 'per month',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Tavus AI integration',
      'Multi-team management',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'White-label options'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include our core AI matching technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{plan.name}</h3>
                <p className="text-blue-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-900">${plan.price}</span>
                  <span className="text-blue-600 ml-2">/{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-blue-600">
            Need a custom solution? 
            <a href="#" className="font-semibold hover:text-blue-800 ml-1">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
}