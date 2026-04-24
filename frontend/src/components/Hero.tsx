import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';


const IMAGES = [
  '/images/open-page.png',
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.6 });

    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.word');
      tl.fromTo(words,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }
    if (subRef.current) {
      tl.fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      );
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );
    }
    if (badgesRef.current) {
      const badges = badgesRef.current.querySelectorAll('.badge');
      tl.fromTo(badges,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.2'
      );
    }
  }, []);

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Single Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/open-page.png"
          alt="Clean Living Room"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Subtle radial overlay — keeps text readable */}
      <div className="absolute inset-0 z-10" style={{
        background: 'rgba(10,10,10,0.65)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
            style={{ background: 'rgba(10,255,230,0.12)', border: '1px solid rgba(10,255,230,0.35)' }}>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-sm font-medium font-dm" style={{ color: '#0AFFE6' }}>Now Serving India</span>
          </div>

          {/* Main Heading */}
          <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl leading-tight mb-6 overflow-hidden text-white">
            <span className="word inline-block mr-4">India's</span>
            <span className="word inline-block mr-4" style={{ color: '#0AFFE6' }}>Cleanest</span>
            <br />
            <span className="word inline-block mr-4 text-white">Choice</span>
          </h1>

          <p ref={subRef} className="text-lg md:text-xl font-dm leading-relaxed mb-8 max-w-xl" style={{ color: '#A0A0A0' }}>
            Professional home cleaning services starting at{' '}
            <span className="font-semibold" style={{ color: '#0AFFE6' }}>₹149</span>.
            Trained staff, eco-friendly products, same-day booking across India.
          </p>
          <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => navigate('/book')}
              className="btn-teal text-base px-8 py-4 ripple flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a Cleaning
            </button>
            <button
              onClick={scrollToServices}
              className="px-8 py-4 rounded-xl font-dm font-semibold transition-all flex items-center gap-2"
              style={{
                background: 'rgba(10,255,230,0.05)',
                border: '1.5px solid rgba(10,255,230,0.35)',
                color: '#0AFFE6',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0AFFE6';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10,255,230,0.05)';
                e.currentTarget.style.color = '#0AFFE6';
              }}
            >
              View Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Trust badges */}
          <div ref={badgesRef} className="flex flex-wrap gap-3">
            {[
              { icon: '✦', label: '500+ Happy Customers' },
              { icon: '⚡', label: 'Same-Day Booking' },
              { icon: '🌿', label: 'Eco-Friendly Products' },
              { icon: '📍', label: 'Pan India Team' },
            ].map((badge, i) => (
              <div key={i} className="badge rounded-full px-4 py-2 flex items-center gap-2"
                style={{
                  background: 'rgba(10,10,10,0.85)',
                  border: '1px solid rgba(10,255,230,0.3)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                }}>
                <span style={{ color: '#0AFFE6' }}>{badge.icon}</span>
                <span className="text-xs font-dm font-medium" style={{ color: '#A0A0A0' }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-xs font-dm tracking-widest uppercase" style={{ color: 'rgba(160,160,160,0.5)' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-teal-400/80 to-transparent" style={{ animation: 'pulse 2s ease-in-out infinite' }}></div>
      </div>
    </section>
  );
};

export default Hero;
