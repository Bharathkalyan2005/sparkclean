import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axiosInstance';

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/feedback?approved=true&limit=6')
      .then(r => {
          if (r.data && r.data.length > 0) {
              setReviews(r.data);
          }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (paused || reviews.length === 0) return;
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, reviews.length]);

  if (reviews.length === 0) return null; // Hide if no approved reviews yet

  return (
    <section className="py-24 relative overflow-hidden section-dark">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(10,255,230,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: 'rgba(10,255,230,0.1)', border: '1px solid rgba(10,255,230,0.3)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#0AFFE6' }}>Customer Love</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#FFFFFF' }}>
            What India Says <span className="teal-gradient-text">About Us</span>
          </h2>
        </motion.div>

        {/* Main featured testimonial */}
        <div
          className="max-w-3xl mx-auto mb-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            {reviews[active] && (
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-8 md:p-10"
                style={{ background: '#161616', border: '1px solid rgba(10,255,230,0.2)', boxShadow: '0 4px 30px rgba(10,255,230,0.1), 0 2px 12px rgba(0,0,0,0.4)' }}
              >
                {/* Quote icon */}
                <svg className="w-10 h-10 text-teal-400/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>

                {/* Stars */}
                <div style={{ color:'#FFD700', fontSize:'18px', marginBottom:'12px' }}>
                  {'★'.repeat(reviews[active].rating)}
                  {'☆'.repeat(5 - reviews[active].rating)}
                </div>

                <p className="font-dm text-lg md:text-xl leading-relaxed italic mb-6" style={{ color: '#A0A0A0' }}>
                  "{reviews[active].comment}"
                </p>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(10,255,230,0.12)', border: '1.5px solid rgba(10,255,230,0.3)' }}>
                    <span className="font-syne font-bold text-lg uppercase" style={{ color: '#0AFFE6' }}>
                      {reviews[active].customerName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-syne font-bold" style={{ color: '#FFFFFF' }}>{reviews[active].customerName}</p>
                    <p className="text-sm font-dm" style={{ color: '#0AFFE6' }}>{reviews[active].area || 'Visakhapatnam'} {reviews[active].serviceName ? `• ${reviews[active].serviceName}` : ''}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span style={{
                      background   : 'rgba(10,255,230,0.1)',
                      color        : '#0AFFE6',
                      padding      : '3px 10px',
                      borderRadius : '20px',
                      fontSize     : '11px',
                    }}>
                      ✓ Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                i === active ? 'w-8 h-2 bg-teal-400' : 'w-2 h-2'
              }`}
              style={i !== active ? { background: 'rgba(10,255,230,0.25)' } : {}}
            />
          ))}
        </div>

        {/* Thumbnail row */}
        <div className="flex gap-3 justify-center overflow-x-auto no-scrollbar pb-2">
          {reviews.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 rounded-xl p-4 w-44 text-left transition-all duration-300`}
              style={i === active
                ? { background: 'rgba(10,255,230,0.08)', border: '1px solid rgba(10,255,230,0.4)' }
                : { background: '#111111', border: '1px solid rgba(10,255,230,0.12)', opacity: 0.65 }}
            >
              <p className="text-xs font-dm line-clamp-2 mb-2" style={{ color: '#A0A0A0' }}>"{t.comment.substring(0, 60)}..."</p>
              <p className="font-syne font-bold text-xs" style={{ color: '#FFFFFF' }}>{t.customerName}</p>
              <p className="text-xs font-dm" style={{ color: '#0AFFE6' }}>{t.area}</p>
            </button>
          ))}
        </div>

        {/* CTA section */}
        <div style={{ textAlign:'center', padding:'40px 20px' }}>
          <p style={{ color:'#A0A0A0', fontSize:'15px' }}>
            Used SuciHome before?
          </p>
          <h3 style={{ color:'#FFFFFF', fontSize:'24px', margin:'8px 0' }}>
            Share your experience ✦
          </h3>
          <button
            onClick={() => navigate('/feedback')}
            style={{
              background   : 'transparent',
              border       : '1px solid #0AFFE6',
              color        : '#0AFFE6',
              padding      : '12px 32px',
              borderRadius : '10px',
              cursor       : 'pointer',
              fontSize     : '15px',
              fontWeight   : '600',
              marginTop    : '16px',
            }}
          >
            ✦ Write a Review
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
