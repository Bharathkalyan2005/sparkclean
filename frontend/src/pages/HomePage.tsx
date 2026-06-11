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
      <a
        href="https://wa.me/919392420643?text=Hi%20SuciHome%2C%20I%20want%20to%20book%20a%20service"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <div style={{
          position    : 'fixed',
          bottom      : '24px',
          right       : '24px',
          zIndex      : 9999,
          display     : 'flex',
          alignItems  : 'center',
          gap         : '10px',
          background  : '#25D366',
          borderRadius: '50px',
          padding     : '12px 20px',
          boxShadow   : '0 4px 20px rgba(37,211,102,0.4)',
          cursor      : 'pointer',
        }}>
          <span style={{ fontSize: '22px' }}>💬</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{
              color    : '#FFFFFF',
              fontSize : '13px',
              fontWeight:'700',
              margin   : 0,
            }}>Chat with us</p>
            <p style={{
              color  : 'rgba(255,255,255,0.8)',
              fontSize:'11px',
              margin : 0,
            }}>We're here to help!</p>
          </div>
        </div>
      </a>
    </div>
  );
};

export default HomePage;
