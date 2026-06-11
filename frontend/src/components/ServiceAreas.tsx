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
    name: 'Visakhapatnam (Vizag), Andhra Pradesh',
    isLive: true,
    premium: ['MVP Colony', 'Madhurawada'],
    standard: [
      'Seethammadhara', 'Dwaraka Nagar', 'Gajuwaka', 'Rushikonda',
      'Gopalapatnam', 'Kommadi', 'NAD Junction', 'Bheemunipatnam',
      'Siripuram', 'Jagadamba'
    ]
  },
  {
    name: 'Hyderabad, Telangana',
    isLive: true,
    badge: '🆕 Now Open!',
    premium: ['Banjara Hills', 'Jubilee Hills'],
    standard: [
      'Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur',
      'Kukatpally', 'Begumpet', 'Secunderabad', 'Ameerpet'
    ]
  },
  {
    name: 'Bhopal, Madhya Pradesh',
    isLive: true,
    badge: '🆕 Now Open!',
    premium: ['MP Nagar', 'Arera Colony'],
    standard: [
      'Kolar Road', 'Hoshangabad Road', 'Shahpura', 'Misrod',
      'Ayodhya Bypass', 'Katara Hills', 'Trilanga', 'Chunabhatti'
    ]
  },
  {
    name: 'Chennai, Tamil Nadu',
    isLive: true,
    badge: '🆕 Now Open!',
    premium: ['Anna Nagar', 'T. Nagar'],
    standard: [
      'Velachery', 'Adyar', 'Porur', 'OMR',
      'Nungambakkam', 'Mylapore', 'Perambur', 'Chromepet',
      'Tambaram', 'Sholinganallur'
    ]
  },
  {
    name: 'Delhi NCR',
    isLive: false,
    premium: [],
    standard: ['Connaught Place', 'Noida', 'Gurugram', 'Dwarka']
  },
  {
    name: 'Pune, Maharashtra',
    isLive: false,
    premium: [],
    standard: []
  },
  {
    name: 'Kolkata, West Bengal',
    isLive: false,
    premium: [],
    standard: []
  }
];

const ServiceAreas: React.FC = () => {
  const navigate = useNavigate();

  const handleAreaClick = (area: string) => {
    navigate(`/book?area=${encodeURIComponent(area)}`);
  };

  return (
    <section id="areas" className="py-24 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(ellipse at 50% 100%, rgba(27,67,50,0.06) 0%, transparent 70%)',
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
          <div className="inline-flex items-center gap-2 bg-[#1B4332]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#1B4332] text-xs font-semibold font-dm tracking-wider uppercase">Service Areas</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl text-[#2D4A35] font-syne font-bold mb-4">
            We Serve Across <span className="text-[#1B4332]">India</span>
          </h2>
          <p className="text-[#5C6B5E] text-lg font-dm max-w-2xl mx-auto">
            Live in Bengaluru, Mumbai, Visakhapatnam, Hyderabad, Bhopal & Chennai — coming soon to more cities
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
                color     : '#2D4A35',
                fontSize  : '18px',
                fontWeight: '700',
              }}>
                Our Coverage Map
              </h3>
              <p style={{ 
                color   : '#5C6B5E', 
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
                color     : '#5C6B5E',
                fontSize  : '12px',
              }}>
                <span style={{
                  width       : '10px',
                  height      : '10px',
                  borderRadius: '50%',
                  background  : '#1B4332',
                  display     : 'inline-block',
                }} />
                Live
              </span>
              <span style={{
                display   : 'flex',
                alignItems: 'center',
                gap       : '6px',
                color     : '#5C6B5E',
                fontSize  : '12px',
              }}>
                <span style={{
                  width       : '10px',
                  height      : '10px',
                  borderRadius: '50%',
                  background  : '#C9A84C',
                  display     : 'inline-block',
                }} />
                Coming Soon
              </span>
            </div>
          </div>

          {/* Map container with border */}
          <div style={{
            border       : '1px solid #EDE8DC',
            borderRadius : '20px',
            overflow     : 'hidden',
            boxShadow    : '0 10px 30px rgba(27,67,50,0.05)',
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
            className={`mb-12 rounded-2xl p-8 text-center transition-all ${
              city.isLive 
                ? 'bg-white border border-[#EDE8DC] shadow-sm hover:shadow-md' 
                : 'bg-[#1B4332]/5 border border-[#1B4332]/10'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-5 h-5 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="font-syne font-bold text-[#2D4A35] text-xl">{city.name}</span>
              {city.badge && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-dm font-semibold animate-pulse">
                  {city.badge}
                </span>
              )}
            </div>

            {city.premium.length > 0 && (
              <div className="mb-8">
                <p className="text-center text-xs font-dm text-[#5C6B5E] uppercase tracking-widest mb-4">⭐ Premium Coverage</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {city.premium.map((area, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => handleAreaClick(area)}
                        className="area-pill premium px-6 py-3 rounded-full border text-sm font-dm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))',
                          borderColor: '#C9A84C',
                          color: '#1B4332',
                        }}
                      >
                        <span>⭐</span>
                        {area}
                        <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse"></span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0D2B1F] rounded-lg text-xs font-dm text-white/95 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                        Premium Coverage Area — Priority Booking
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D2B1F] rotate-45 -mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {city.standard.length > 0 && (
              <div className="mb-8">
                <p className="text-center text-xs font-dm text-[#5C6B5E] uppercase tracking-widest mb-4">Standard Areas</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {city.standard.map((area, i) => (
                    <button
                      key={i}
                      onClick={() => handleAreaClick(area)}
                      className="area-pill px-5 py-2.5 rounded-full border border-[#EDE8DC] bg-white text-sm font-dm text-[#5C6B5E] hover:text-[#1B4332] hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-all duration-300"
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
                  className="px-8 py-3 rounded-xl font-dm font-semibold transition-all duration-300 flex items-center gap-2 bg-[#1B4332] text-white hover:bg-[#0D2B1F] hover:shadow-lg shadow-md"
                >
                  Book Now in {city.name.split(',')[0]} →
                </button>
              ) : (
                <a
                  href={`https://wa.me/919392420643?text=${encodeURIComponent(`Hi SuciHome! Notify me when you launch in ${city.name.split(',')[0]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl font-dm font-semibold transition-all duration-300 flex items-center gap-2 text-[#1B4332] border border-[#1B4332] bg-transparent hover:bg-[#1B4332] hover:text-white"
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
