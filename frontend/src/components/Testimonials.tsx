import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../data/services';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <motion.svg
        key={star}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: star * 0.08 }}
        className={`w-4 h-4 ${star <= rating ? 'star-filled' : 'text-white/20'}`}
        fill={star <= rating ? '#FFD700' : 'none'}
        stroke={star <= rating ? '#FFD700' : 'currentColor'}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </motion.svg>
    ))}
  </div>
);

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

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
            What Vizag Says <span className="teal-gradient-text">About Us</span>
          </h2>
        </motion.div>

        {/* Main featured testimonial */}
        <div
          className="max-w-3xl mx-auto mb-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
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

              <p className="font-dm text-lg md:text-xl leading-relaxed italic mb-6" style={{ color: '#A0A0A0' }}>
                "{TESTIMONIALS[active].review_text}"
              </p>

              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(10,255,230,0.12)', border: '1.5px solid rgba(10,255,230,0.3)' }}>
                  <span className="font-syne font-bold text-lg" style={{ color: '#0AFFE6' }}>
                    {TESTIMONIALS[active].customer_name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-syne font-bold" style={{ color: '#FFFFFF' }}>{TESTIMONIALS[active].customer_name}</p>
                  <p className="text-sm font-dm" style={{ color: '#0AFFE6' }}>{TESTIMONIALS[active].area}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={TESTIMONIALS[active].rating} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {TESTIMONIALS.map((_, i) => (
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
          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 rounded-xl p-4 w-44 text-left transition-all duration-300`}
              style={i === active
                ? { background: 'rgba(10,255,230,0.08)', border: '1px solid rgba(10,255,230,0.4)' }
                : { background: '#111111', border: '1px solid rgba(10,255,230,0.12)', opacity: 0.65 }}
            >
              <p className="text-xs font-dm line-clamp-2 mb-2" style={{ color: '#A0A0A0' }}>"{t.review_text.substring(0, 60)}..."</p>
              <p className="font-syne font-bold text-xs" style={{ color: '#FFFFFF' }}>{t.customer_name}</p>
              <p className="text-xs font-dm" style={{ color: '#0AFFE6' }}>{t.area}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
