import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import PlaygroundModal from '../components/PlaygroundModal';

export default function LandingPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  return (
    <>
      <Header />
      <Hero onTryDemo={() => setIsPlaygroundOpen(true)} />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
      <PlaygroundModal 
        isOpen={isPlaygroundOpen} 
        onClose={() => setIsPlaygroundOpen(false)} 
      />
    </>
  );
}