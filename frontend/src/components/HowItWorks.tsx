import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Book Online',
    desc: 'Choose your services, pick a date & time slot, and confirm your booking in under 60 seconds.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Arrive',
    desc: 'Our trained, verified team arrives at your doorstep on time with all eco-friendly products.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Sparkling Clean',
    desc: 'Your home is transformed. Inspect the results and rate our service — we guarantee satisfaction.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
      </svg>
    ),
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden section-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: 'rgba(10,255,230,0.1)', border: '1px solid rgba(10,255,230,0.3)' }}>
            <span className="text-xs font-medium font-dm tracking-wider uppercase" style={{ color: '#0AFFE6' }}>How It Works</span>
          </div>
          <h2 className="section-heading text-4xl md:text-5xl mb-4" style={{ color: '#FFFFFF' }}>
            Clean in <span className="teal-gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-lg font-dm max-w-2xl mx-auto" style={{ color: '#A0A0A0' }}>
            From booking to sparkling — it's as easy as 1, 2, 3.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-px" style={{ zIndex: 0, top: '56px' }}>
            <svg viewBox="0 0 100 1" preserveAspectRatio="none" className="w-full h-px">
              <line x1="16" y1="0" x2="84" y2="0" stroke="rgba(10,255,230,0.2)" strokeWidth="1" strokeDasharray="6 4"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center"
              >
                {/* Step icon circle */}
                <div className="relative inline-flex mb-8">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(10,255,230,0.1)', border: '2px solid rgba(10,255,230,0.3)', color: '#0AFFE6', boxShadow: '0 0 30px rgba(10,255,230,0.15)' }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#0AFFE6,#00CDB7)', boxShadow: '0 2px 8px rgba(10,255,230,0.4)' }}>
                    <span className="font-syne font-bold text-xs" style={{ color: '#000000' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <h3 className="font-syne font-bold text-2xl mb-3" style={{ color: '#FFFFFF' }}>{step.title}</h3>
                <p className="font-dm text-base leading-relaxed max-w-xs mx-auto" style={{ color: '#A0A0A0' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
