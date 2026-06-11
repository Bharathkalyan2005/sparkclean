import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axiosInstance';

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ctaHover, setCtaHover] = useState(false);
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
    <section className="py-24 relative overflow-hidden" style={{ background: '#F5F0E8' }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(27,67,50,0.02) 0%, transparent 70%)',
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
            style={{ background: 'rgba(27,67,50,0.08)', border: '1px solid rgba(27,67,50,0.2)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#1B4332' }}>Customer Love</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#0D2B1F' }}>
            What India Says <span style={{ color: '#1B4332' }}>About Us</span>
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
                style={{
                  background  : '#FFFFFF',
                  border      : '1px solid rgba(27,67,50,0.1)',
                  borderRadius: '20px',
                  boxShadow   : '0 4px 20px rgba(27,67,50,0.06)'
                }}
              >
                {/* Quote icon */}
                <svg className="w-10 h-10 mb-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(27,67,50,0.08)' }}>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>

                {/* Stars */}
                <div style={{ color:'#C9A84C', fontSize:'18px', marginBottom:'12px' }}>
                  {'★'.repeat(reviews[active].rating)}
                  {'☆'.repeat(5 - reviews[active].rating)}
                </div>

                <p className="font-dm text-lg md:text-xl leading-relaxed italic mb-6" style={{ color: '#2D4A35' }}>
                  "{reviews[active].comment}"
                </p>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(27,67,50,0.08)', border: '1.5px solid rgba(27,67,50,0.15)' }}>
                    <span className="font-syne font-bold text-lg uppercase" style={{ color: '#1B4332' }}>
                      {reviews[active].customerName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-syne font-bold" style={{ color: '#0D2B1F' }}>{reviews[active].customerName}</p>
                    <p className="text-sm font-dm" style={{ color: '#5C6B5E' }}>{reviews[active].area || 'Visakhapatnam'} {reviews[active].serviceName ? `• ${reviews[active].serviceName}` : ''}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span style={{
                      background   : 'rgba(27,67,50,0.08)',
                      color        : '#1B4332',
                      padding      : '3px 10px',
                      borderRadius : '20px',
                      fontSize     : '11px',
                      border       : '1px solid rgba(27,67,50,0.2)'
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
                i === active ? 'w-8 h-2' : 'w-2 h-2'
              }`}
              style={{
                background: i === active ? '#1B4332' : 'rgba(27,67,50,0.2)'
              }}
            />
          ))}
        </div>

        {/* Thumbnail row */}
        <div className="flex gap-3 justify-center overflow-x-auto no-scrollbar pb-2">
          {reviews.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-xl p-4 w-44 text-left transition-all duration-300"
              style={i === active
                ? { background: 'rgba(27,67,50,0.06)', border: '1px solid rgba(27,67,50,0.2)' }
                : { background: '#FFFFFF', border: '1px solid rgba(27,67,50,0.1)', opacity: 0.65 }}
            >
              <p className="text-xs font-dm line-clamp-2 mb-2" style={{ color: '#5C6B5E' }}>"{t.comment.substring(0, 60)}..."</p>
              <p className="font-syne font-bold text-xs" style={{ color: '#0D2B1F' }}>{t.customerName}</p>
              <p className="text-xs font-dm" style={{ color: '#1B4332' }}>{t.area}</p>
            </button>
          ))}
        </div>

        {/* CTA section */}
        <div style={{ textAlign:'center', padding:'40px 20px' }}>
          <p style={{ color:'#5C6B5E', fontSize:'15px' }}>
            Used SuciHome before?
          </p>
          <h3 style={{ color:'#0D2B1F', fontSize:'24px', margin:'8px 0' }}>
            Share your experience ✦
          </h3>
          <button
            onClick={() => navigate('/feedback')}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              background   : ctaHover ? '#1B4332' : 'transparent',
              border       : '1.5px solid #1B4332',
              color        : ctaHover ? '#FFFFFF' : '#1B4332',
              padding      : '12px 32px',
              borderRadius : '10px',
              cursor       : 'pointer',
              fontSize     : '15px',
              fontWeight   : '600',
              marginTop    : '16px',
              transition   : 'all 0.3s'
            }}
          >
            ✦ Write a Review
          </button>
        </div>

      </div>
    </section>
  );
};

      </div>
    </section>
  );
};

export default Testimonials;
