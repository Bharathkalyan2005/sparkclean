import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SERVICE_AREAS } from '../data/services';
import { useNavigate } from 'react-router-dom';

const ServiceAreas: React.FC = () => {
  const navigate = useNavigate();

  const handleAreaClick = (area: string) => {
    // Navigate to booking with area pre-selected
    navigate(`/book?area=${encodeURIComponent(area)}`);
  };

  return (
    <section id="areas" className="py-24 relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(ellipse at 50% 100%, rgba(10,255,230,0.08) 0%, transparent 70%)',
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
          <div className="inline-flex items-center gap-2 glass-teal rounded-full px-4 py-1.5 mb-4">
            <span className="text-teal-400 text-xs font-medium font-dm tracking-wider uppercase">Service Areas</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl text-white mb-4">
            Serving All of <span className="teal-gradient-text">Vizag</span>
          </h2>
          <p className="text-white/50 text-lg font-dm max-w-2xl mx-auto">
            Click on your area to instantly start booking. Premium coverage in select areas.
          </p>
        </motion.div>

        {/* Premium areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-center text-xs font-dm text-white/30 uppercase tracking-widest mb-4">⭐ Premium Coverage Areas</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {SERVICE_AREAS.filter(a => a.premium).map((area, i) => (
              <div key={i} className="relative group">
                <button
                  onClick={() => handleAreaClick(area.name)}
                  className="area-pill premium px-6 py-3 rounded-full border text-sm font-dm font-semibold flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.08))',
                    borderColor: 'rgba(255,215,0,0.4)',
                    color: '#FFD700',
                  }}
                >
                  <span>⭐</span>
                  {area.name}
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 glass-dark rounded-lg text-xs font-dm text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Premium Coverage Area — Priority Booking
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 glass-dark rotate-45 -mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Standard areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-center text-xs font-dm text-white/30 uppercase tracking-widest mb-4">Standard Areas</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {SERVICE_AREAS.filter(a => !a.premium).map((area, i) => (
              <button
                key={i}
                onClick={() => handleAreaClick(area.name)}
                className="area-pill glass px-5 py-2.5 rounded-full border border-white/10 text-sm font-dm text-white/60 hover:text-teal-400"
              >
                {area.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Area map visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="font-syne font-bold text-white text-lg">Visakhapatnam, Andhra Pradesh</span>
          </div>
          <p className="text-white/40 font-dm text-sm">
            Not in the list? Call us at{' '}
            <a href="tel:9392420643" className="text-teal-400 hover:underline">9392420643</a>
            {' '}— we may still serve your area!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreas;
