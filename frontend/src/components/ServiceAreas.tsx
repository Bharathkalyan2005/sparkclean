import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SuciHomeMap from './SuciHomeMap';

const CITIES_DATA = [
  {
    name: 'Bengaluru, Karnataka',
    isLive: true,
    premium: ['Koramangala', 'Indiranagar'],
    standard: ['Whitefield', 'HSR Layout', 'Marathahalli', 'BTM Layout']
  },
  {
    name: 'Mumbai, Maharashtra',
    isLive: true,
    premium: ['Bandra', 'Andheri'],
    standard: ['Powai', 'Thane', 'Juhu', 'Worli']
  },
  {
    name: 'Visakhapatnam, Andhra Pradesh',
    isLive: false,
    premium: [],
    standard: ['MVP Colony', 'Madhurawada', 'Seethammadhara', 'Dwaraka Nagar']
  },
  {
    name: 'Hyderabad, Telangana',
    isLive: false,
    premium: [],
    standard: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City']
  },
  {
    name: 'Chennai, Tamil Nadu',
    isLive: false,
    premium: [],
    standard: ['Anna Nagar', 'T.Nagar', 'Velachery', 'Adyar']
  },
  {
    name: 'Delhi NCR',
    isLive: false,
    premium: [],
    standard: ['Connaught Place', 'Noida', 'Gurugram', 'Dwarka']
  }
];

const ServiceAreas: React.FC = () => {
  const navigate = useNavigate();

  const handleAreaClick = (area: string) => {
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
            We Serve Across <span className="teal-gradient-text">India</span>
          </h2>
          <p className="text-white/50 text-lg font-dm max-w-2xl mx-auto">
            Live in Bengaluru & Mumbai — coming soon to more cities
          </p>
        </motion.div>

        {/* --- MAP ADDED HERE --- */}
        <div style={{ marginBottom: '48px' }}>
          {/* Map heading */}
          <div style={{
            display      : 'flex',
            alignItems   : 'center',
            gap          : '12px',
            marginBottom : '20px',
          }}>
            <span style={{ fontSize: '20px' }}>🗺️</span>
            <div>
              <h3 style={{
                color     : '#FFFFFF',
                fontSize  : '18px',
                fontWeight: '700',
              }}>
                Our Coverage Map
              </h3>
              <p style={{ 
                color   : '#A0A0A0', 
                fontSize: '13px' 
              }}>
                Click any pin to see areas and book
              </p>
            </div>

            {/* Legend */}
            <div style={{
              marginLeft : 'auto',
              display    : 'flex',
              gap        : '16px',
            }}>
              <span style={{
                display   : 'flex',
                alignItems: 'center',
                gap       : '6px',
                color     : '#A0A0A0',
                fontSize  : '12px',
              }}>
                <span style={{
                  width       : '10px',
                  height      : '10px',
                  borderRadius: '50%',
                  background  : '#0AFFE6',
                  display     : 'inline-block',
                }} />
                Live
              </span>
              <span style={{
                display   : 'flex',
                alignItems: 'center',
                gap       : '6px',
                color     : '#A0A0A0',
                fontSize  : '12px',
              }}>
                <span style={{
                  width       : '10px',
                  height      : '10px',
                  borderRadius: '50%',
                  background  : 'rgba(255,255,255,0.3)',
                  display     : 'inline-block',
                }} />
                Coming Soon
              </span>
            </div>
          </div>

          {/* Map container with border */}
          <div style={{
            border       : '1px solid rgba(10,255,230,0.2)',
            borderRadius : '20px',
            overflow     : 'hidden',
            boxShadow    : '0 0 40px rgba(10,255,230,0.05)',
          }}>
            <SuciHomeMap />
          </div>
        </div>
        {/* --- MAP END --- */}

        {CITIES_DATA.map((city, cityIndex) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + cityIndex * 0.1 }}
            className="mb-12 glass rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="font-syne font-bold text-white text-xl">{city.name}</span>
            </div>

            {city.premium.length > 0 && (
              <div className="mb-8">
                <p className="text-center text-xs font-dm text-white/30 uppercase tracking-widest mb-4">⭐ Premium Coverage</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {city.premium.map((area, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => handleAreaClick(area)}
                        className="area-pill premium px-6 py-3 rounded-full border text-sm font-dm font-semibold flex items-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.08))',
                          borderColor: 'rgba(255,215,0,0.4)',
                          color: '#FFD700',
                        }}
                      >
                        <span>⭐</span>
                        {area}
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 glass-dark rounded-lg text-xs font-dm text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Premium Coverage Area — Priority Booking
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 glass-dark rotate-45 -mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {city.standard.length > 0 && (
              <div className="mb-8">
                <p className="text-center text-xs font-dm text-white/30 uppercase tracking-widest mb-4">Standard Areas</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {city.standard.map((area, i) => (
                    <button
                      key={i}
                      onClick={() => handleAreaClick(area)}
                      className="area-pill glass px-5 py-2.5 rounded-full border border-white/10 text-sm font-dm text-white/60 hover:text-teal-400 gap-2"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              {city.isLive ? (
                <button
                  onClick={() => navigate('/book')}
                  className="px-8 py-3 rounded-xl font-dm font-semibold transition-all flex items-center gap-2"
                  style={{
                    background: 'rgba(10,255,230,0.1)',
                    border: '1px solid rgba(10,255,230,0.4)',
                    color: '#0AFFE6',
                  }}
                >
                  Book Now in {city.name.split(',')[0]} →
                </button>
              ) : (
                <a
                  href={`https://wa.me/919392420643?text=${encodeURIComponent(`Hi SuciHome! Notify me when you launch in ${city.name.split(',')[0]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl font-dm font-semibold transition-all flex items-center gap-2 text-white/70 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  🔔 Notify me when live in {city.name.split(',')[0]}
                </a>
              )}
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default ServiceAreas;
