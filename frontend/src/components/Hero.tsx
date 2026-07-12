import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  green    : '#1B4332',
  gold     : '#C9A84C',
  cream    : '#F5F0E8',
  darkText : '#0D2B1F',
  bodyText : '#2D4A35',
  mutedText: '#5C6B5E',
};

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      {/* MAIN HERO CONTENT */}
      <div className="hero-grid">
        {/* LEFT — Text Content */}
        <motion.div
          className="hero-left"
          initial   ={{ opacity: 0, x: -30 }}
          animate   ={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.7 }}
        >
          {/* Top badges */}
          <div className="hero-badges">
            {/* SuciHome badge */}
            <span 
              className="hero-badge-pill"
              style={{
                display     : 'inline-flex',
                alignItems  : 'center',
                gap         : '6px',
                background  : COLORS.green,
                color       : '#FFFFFF',
                borderRadius: '20px',
                padding     : '6px 14px',
                fontWeight  : '700',
              }}
            >
              ✦ SuciHome
            </span>

            {/* Trust badge */}
            <span 
              className="hero-badge-pill"
              style={{
                display     : 'inline-flex',
                alignItems  : 'center',
                background  : 'transparent',
                color       : COLORS.darkText,
                border      : '1px solid rgba(27,67,50,0.3)',
                borderRadius: '20px',
                padding     : '6px 14px',
                fontWeight  : '500',
              }}
            >
              India's Most Trusted Home Cleaning Service
            </span>
          </div>

          {/* Main Heading */}
          <div style={{ marginBottom: '8px' }}>
            <h1 className="hero-h1" style={{ margin: 0 }}>
              {/* Line 1: India's */}
              <span className="hero-india">
                India's
              </span>

              {/* Line 2: Cleanest (green) */}
              <span className="hero-cleanest" style={{ position: 'relative', width: 'max-content' }}>
                Cleanest
                {/* Gold sparkle */}
                <span style={{
                  position : 'absolute',
                  top      : '-10px',
                  right    : '-30px',
                  color    : COLORS.gold,
                  fontSize : '28px',
                }}>✦</span>
              </span>

              {/* Line 3: Choice (gold) */}
              <span className="hero-choice">
                Choice
              </span>
            </h1>

            {/* Underline decoration */}
            <div className="hero-underline" />
          </div>

          {/* Subtext */}
          <p className="hero-subtext">
            Professional home cleaning services 
            starting at{' '}
            <span style={{
              textDecoration: 'line-through',
              color         : 'rgba(93,107,94,0.5)',
            }}>
              ₹249
            </span>{' '}
            <strong style={{ color: COLORS.darkText }}>
              ₹149.
            </strong>
            {' '}Trained staff, eco-friendly products, 
            same-day booking in{' '}
            <strong style={{ color: COLORS.green }}>
              Bengaluru, Mumbai, Visakhapatnam, 
              Hyderabad, Bhopal & Chennai.
            </strong>
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            {/* Book a Cleaning — dark green */}
            <motion.button
              whileHover={{ 
                scale    : 1.03,
                boxShadow: '0 8px 30px rgba(27,67,50,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/book')}
              className="hero-btn-primary"
              style={{
                display     : 'flex',
                alignItems  : 'center',
                gap         : '8px',
                background  : COLORS.green,
                color       : '#FFFFFF',
                border      : 'none',
                borderRadius: '50px',
                padding     : '16px 32px',
                fontSize    : '16px',
                fontWeight  : '700',
                cursor      : 'pointer',
              }}
            >
              📅 Book a Cleaning
            </motion.button>

            {/* View Services — outline */}
            <motion.button
              whileHover={{ background: 'rgba(27,67,50,0.08)' }}
              onClick={() => {
                document.getElementById('services')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hero-btn-secondary"
              style={{
                display     : 'flex',
                alignItems  : 'center',
                gap         : '8px',
                background  : 'transparent',
                color       : COLORS.darkText,
                border      : '1px solid rgba(27,67,50,0.3)',
                borderRadius: '50px',
                padding     : '16px 32px',
                fontSize    : '16px',
                fontWeight  : '600',
                cursor      : 'pointer',
              }}
            >
              View Services →
            </motion.button>
          </div>

          {/* 4 Trust badges row */}
          <div className="hero-trust-grid">
            {[
              { icon: '👥', title: '500+',       sub: 'Happy Customers'  },
              { icon: '⚡', title: 'Same-Day',   sub: 'Booking'          },
              { icon: '🌿', title: 'Eco-Friendly',sub: 'Products'        },
              { icon: '🛡️', title: 'Trusted &',  sub: 'Verified Experts' },
            ].map(badge => (
              <div
                key  ={badge.title}
                className="hero-trust-card"
                style={{
                  background  : '#FFFFFF',
                  borderRadius: '14px',
                  padding     : '14px 12px',
                  boxShadow   : '0 2px 12px rgba(27,67,50,0.08)',
                  border      : '1px solid rgba(27,67,50,0.08)',
                  display     : 'flex',
                  alignItems  : 'center',
                  gap         : '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {badge.icon}
                </span>
                <div>
                  <p className="hero-trust-title" style={{
                    color     : COLORS.darkText,
                    fontSize  : '13px',
                    fontWeight: '700',
                    margin    : 0,
                  }}>
                    {badge.title}
                  </p>
                  <p className="hero-trust-sub" style={{
                    color   : COLORS.mutedText,
                    fontSize: '11px',
                    margin  : '2px 0 0',
                  }}>
                    {badge.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Cleaner Photo */}
        <motion.div
          className="hero-right"
          initial   ={{ opacity: 0, x: 30 }}
          animate   ={{ opacity: 1, x: 0  }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Main hero image — uploaded cleaner photo */}
          <img
            src  ="/images/hero-cleaner.png"
            alt  ="SuciHome Professional Cleaner"
            loading="lazy"
            decoding="async"
          />

          {/* Subtle green overlay at bottom */}
          <div style={{
            position  : 'absolute',
            bottom    : 0,
            left      : 0,
            right     : 0,
            height    : '200px',
            background: 'linear-gradient(to top, rgba(13,43,31,0.3), transparent)',
            borderRadius: '0 0 32px 32px',
          }} />
        </motion.div>
      </div>
    </section>
  );
}
