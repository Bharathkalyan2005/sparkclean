import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'Trained & Verified Staff',
    desc: 'All cleaners are background-checked, trained, and certified before joining SuciHome.',
    color: '#0AFFE6',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    title: 'Eco-Friendly Products',
    desc: 'We use non-toxic, plant-based cleaning solutions safe for your kids and pets.',
    color: '#4ADE80',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'On-Time Guarantee',
    desc: 'We respect your time. Our team arrives within the chosen slot — every single time.',
    color: '#FACC15',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Transparent ₹ Pricing',
    desc: 'Fixed pricing with zero hidden charges. What you see is exactly what you pay.',
    color: '#A78BFA',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    title: 'Pan-India Team',
    desc: 'We\'re a India-born business, serving our own community with pride and care.',
    color: '#F97316',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    ),
    title: 'WhatsApp Support',
    desc: 'Chat with us anytime on WhatsApp. Booking confirmations and updates instantly.',
    color: '#25D366',
  },
];

const WhySuciHome: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden section-black">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(10,255,230,0.06) 0%, transparent 60%)',
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
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#0AFFE6' }}>Why SuciHome</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#FFFFFF' }}>
            The SuciHome <span className="teal-gradient-text">Difference</span>
          </h2>
          <p className="text-lg font-dm max-w-2xl mx-auto" style={{ color: '#A0A0A0' }}>
            We don't just clean your home — we care for it like our own.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 group transition-all duration-300 card-glow"
              style={{ background: '#161616', border: '1px solid rgba(10,255,230,0.18)', boxShadow: '0 2px 16px rgba(0,0,0,0.5)', borderLeft: `3px solid ${feat.color}` }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${feat.color}18`, color: feat.color }}>
                {feat.icon}
              </div>
              <h3 className="font-syne font-bold text-lg mb-2" style={{ color: '#FFFFFF' }}>{feat.title}</h3>
              <p className="font-dm text-sm leading-relaxed" style={{ color: '#A0A0A0' }}>{feat.desc}</p>

              {/* Hover accent line */}
              <div className="h-0.5 mt-4 rounded-full transition-all duration-300 group-hover:w-full w-0"
                style={{ background: `linear-gradient(90deg, ${feat.color}, transparent)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySuciHome;
