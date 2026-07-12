import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import CombosSection from '../components/CombosSection';
import HowItWorks from '../components/HowItWorks';
import WhySuciHome from '../components/WhySuciHome';
import ServiceAreas from '../components/ServiceAreas';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import WhatsAppButton from '../components/WhatsAppButton';

const HomePage: React.FC = () => {
  // Scroll progress bar
  useEffect(() => {
    const progressBar = document.getElementById('scroll-progress');
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Navbar />
      <CartSidebar />
      <main>
        <Hero />
        <ServicesSection />
        <CombosSection />
        <HowItWorks />
        <WhySuciHome />
        <ServiceAreas />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
