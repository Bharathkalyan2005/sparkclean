import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section 
      className="hero-section"
      style={{
        minHeight  : '100vh',
        background : COLORS.cream,
        display    : 'flex',
        flexDirection: 'column',
        paddingTop : '72px', // navbar height
        overflow   : 'hidden',
        position   : 'relative',
        backgroundImage: isMobile ? "url('/images/hero-cleaner.png')" : "none",
        backgroundSize: isMobile ? "cover" : "none",
        backgroundPosition: isMobile ? "center right" : "none",
      }}
    >
      {/* Mobile Dark Overlay for readability */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(245,240,232,0.85)',
          zIndex: 1
        }} />
      )}

      {/* MAIN HERO CONTENT */}
      <div 
        className="hero-container"
        style={{
          flex          : 1,
          display       : 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '45% 55%',
          maxWidth      : '1400px',
          margin        : '0 auto',
          width         : '100%',
          padding       : isMobile ? '24px 20px' : '0 40px',
          alignItems    : 'center',
          minHeight     : 'calc(100vh - 72px)',
          position      : 'relative',
          zIndex        : 2,
        }}
      >
        {/* LEFT — Text Content */}
        <motion.div
          className="hero-left"
          initial   ={{ opacity: 0, x: -30 }}
          animate   ={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.7 }}
          style={{ 
            paddingRight: isMobile ? '0' : '40px',
            zIndex: 2,
          }}
        >
          {/* Top badges */}
          <div style={{
            display    : 'flex',
            gap        : '10px',
            marginBottom: '28px',
            flexWrap   : 'wrap',
          }}>
            {/* SuciHome badge */}
            <span style={{
              display     : 'inline-flex',
              alignItems  : 'center',
              gap         : '6px',
              background  : COLORS.green,
              color       : '#FFFFFF',
              borderRadius: '20px',
              padding     : '6px 14px',
              fontSize    : isMobile ? '11px' : '13px',
              fontWeight  : '700',
            }}>
              ✦ SuciHome
            </span>

            {/* Trust badge */}
            <span style={{
              display     : 'inline-flex',
              alignItems  : 'center',
              background  : 'transparent',
              color       : COLORS.darkText,
              border      : '1px solid rgba(27,67,50,0.3)',
              borderRadius: '20px',
              padding     : '6px 14px',
              fontSize    : isMobile ? '11px' : '13px',
              fontWeight  : '500',
            }}>
              India's Most Trusted Home Cleaning Service
            </span>
          </div>

          {/* Main Heading */}
          <div style={{ marginBottom: '8px' }}>
            <h1 style={{
              margin    : 0,
              lineHeight: '1.05',
            }}>
              {/* Line 1: India's */}
              <span style={{
                display   : 'block',
                color     : COLORS.darkText,
                fontSize  : isMobile ? '48px' : '72px',
                fontWeight: '800',
                fontFamily: 'Instrument Serif, serif',
              }}>
                India's
              </span>

              {/* Line 2: Cleanest (green) */}
              <span style={{
                display   : 'block',
                color     : COLORS.green,
                fontSize  : isMobile ? '48px' : '72px',
                fontWeight: '800',
                fontFamily: 'Instrument Serif, serif',
                position  : 'relative',
                width     : 'max-content',
              }}>
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
              <span style={{
                display   : 'block',
                color     : COLORS.gold,
                fontSize  : isMobile ? '48px' : '72px',
                fontWeight: '800',
                fontFamily: 'Instrument Serif, serif',
              }}>
                Choice
              </span>
            </h1>

            {/* Underline decoration */}
            <div style={{
              width       : '120px',
              height      : '3px',
              background  : `linear-gradient(90deg, 
                             ${COLORS.green}, ${COLORS.gold})`,
              borderRadius: '2px',
              marginTop   : '8px',
            }} />
          </div>

          {/* Subtext */}
          <p style={{
            color      : COLORS.mutedText,
            fontSize   : isMobile ? '14px' : '16px',
            lineHeight : '1.7',
            margin     : '24px 0 32px',
            maxWidth   : '480px',
          }}>
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
          <div style={{
            display : 'flex',
            gap     : '16px',
            flexWrap: 'wrap',
          }}>
            {/* Book a Cleaning — dark green */}
            <motion.button
              whileHover={{ 
                scale    : 1.03,
                boxShadow: '0 8px 30px rgba(27,67,50,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/book')}
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
          <div style={{
            display        : 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap            : '12px',
            marginTop      : '40px',
          }}>
            {[
              { icon: '👥', title: '500+',       sub: 'Happy Customers'  },
              { icon: '⚡', title: 'Same-Day',   sub: 'Booking'          },
              { icon: '🌿', title: 'Eco-Friendly',sub: 'Products'        },
              { icon: '🛡️', title: 'Trusted &',  sub: 'Verified Experts' },
            ].map(badge => (
              <div
                key  ={badge.title}
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
                  <p style={{
                    color     : COLORS.darkText,
                    fontSize  : '13px',
                    fontWeight: '700',
                    margin    : 0,
                  }}>
                    {badge.title}
                  </p>
                  <p style={{
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
        {!isMobile && (
          <motion.div
            className="hero-right"
            initial   ={{ opacity: 0, x: 30 }}
            animate   ={{ opacity: 1, x: 0  }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position    : 'relative',
              height      : 'calc(100vh - 120px)',
              borderRadius: '32px',
              overflow    : 'hidden',
            }}
          >
            {/* Main hero image — uploaded cleaner photo */}
            <img
              src  ="/images/hero-cleaner.png"
              alt  ="SuciHome Professional Cleaner"
              loading="lazy"
              decoding="async"
              style={{
                width        : '100%',
                height       : '100%',
                objectFit    : 'cover',
                objectPosition: 'center top',
                borderRadius : '32px',
              }}
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

            {/* WhatsApp badge floating */}
            <div style={{
              position    : 'absolute',
              bottom      : '24px',
              right       : '24px',
              background  : '#25D366',
              borderRadius: '16px',
              padding     : '12px 16px',
              display     : 'flex',
              alignItems  : 'center',
              gap         : '10px',
              boxShadow   : '0 4px 20px rgba(0,0,0,0.2)',
              cursor      : 'pointer',
            }}
            onClick={() => window.open(
              'https://wa.me/919392420643?text=' +
              encodeURIComponent(
                'Hi SuciHome! I want to book a service.'
              )
            )}
            >
              <span style={{ fontSize: '24px' }}>💬</span>
              <div>
                <p style={{
                  color     : '#FFFFFF',
                  fontSize  : '13px',
                  fontWeight: '700',
                  margin    : 0,
                }}>
                  Chat with us
                </p>
                <p style={{
                  color  : 'rgba(255,255,255,0.85)',
                  fontSize:'11px',
                  margin : '2px 0 0',
                }}>
                  We're here to help!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
