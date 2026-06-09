import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Brand colors from reference image
const BRAND = {
  green : '#1B4332',   // dark forest green
  gold  : '#C9A84C',   // warm gold
  cream : '#F5F0E8',   // background
  text  : '#2D4A35',   // body text
  light : '#5C6B5E',   // muted text
}

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section style={{
      minHeight  : '100vh',
      background : `linear-gradient(135deg, 
                    ${BRAND.cream} 0%, 
                    #EDE8DC 50%, 
                    #F0EBE0 100%)`,
      position   : 'relative',
      overflow   : 'hidden',
      display    : 'flex',
      flexDirection: 'column',
    }}>

      {/* Full background image from reference */}
      <img
        src  ="images/hero-bg.png"
        alt  ="SuciHome Hero"
        style={{
          position  : 'absolute',
          inset     : 0,
          width     : '100%',
          height    : '100%',
          objectFit : 'cover',
          objectPosition: 'center',
          zIndex    : 0,
        }}
        onError={e => {
          // Hide if image not found
          e.currentTarget.style.display = 'none'
        }}
      />

      {/* Light overlay for text readability */}
      <div style={{
        position  : 'absolute',
        inset     : 0,
        background: 'rgba(245,240,232,0.3)',
        zIndex    : 1,
      }} />

      {/* MAIN CONTENT - centered overlay */}
      <div style={{
        position       : 'relative',
        zIndex         : 2,
        flex           : 1,
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : '100px 24px 60px',
      }}>
        <motion.div
          initial   ={{ opacity: 0, y: 30 }}
          animate   ={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign  : 'center',
            maxWidth   : '600px',
          }}
        >
          {/* Logo image */}
          <motion.div
            initial   ={{ opacity: 0, scale: 0.8 }}
            animate   ={{ opacity: 1, scale: 1   }}
            transition={{ duration: 0.6 }}
          >
            <img
              src  ="/logo.png"
              alt  ="SuciHome Logo"
              style={{
                height      : '80px',
                width       : 'auto',
                marginBottom: '8px',
              }}
            />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial   ={{ opacity: 0, y: 20 }}
            animate   ={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className ="hero-brand"
            style={{
              fontSize  : '64px',
              fontWeight: '800',
              margin    : '0 0 8px',
              lineHeight: '1',
              fontFamily: 'Instrument Serif, serif',
            }}
          >
            <span style={{ color: BRAND.green }}>Suci</span>
            <span style={{ color: BRAND.gold  }}>Home</span>
          </motion.h1>

          {/* Gold tagline with lines */}
          <motion.div
            initial   ={{ opacity: 0 }}
            animate   ={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display        : 'flex',
              alignItems     : 'center',
              justifyContent : 'center',
              gap            : '16px',
              margin         : '12px 0 28px',
            }}
          >
            <div style={{
              height    : '1px',
              width     : '70px',
              background: BRAND.gold,
            }} />
            <p style={{
              color        : BRAND.gold,
              fontSize     : '11px',
              fontWeight   : '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              margin       : 0,
            }}>
              Clean Homes, Better Lives
            </p>
            <div style={{
              height    : '1px',
              width     : '70px',
              background: BRAND.gold,
            }} />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial   ={{ opacity: 0, y: 20 }}
            animate   ={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className ="hero-heading"
            style={{
              color      : BRAND.green,
              fontSize   : '40px',
              fontWeight : '700',
              fontFamily : 'Instrument Serif, serif',
              lineHeight : '1.2',
              margin     : '0 0 16px',
            }}
          >
            Premium Home Cleaning
            <br />You Can Trust
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial   ={{ opacity: 0 }}
            animate   ={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              color     : BRAND.light,
              fontSize  : '17px',
              lineHeight: '1.7',
              margin    : '0 0 36px',
            }}
          >
            Professional. Reliable. Affordable.
            <br />
            Book trusted cleaning experts for your home.
          </motion.p>

          {/* BOOK A SERVICE Button */}
          <motion.button
            initial   ={{ opacity: 0, scale: 0.9 }}
            animate   ={{ opacity: 1, scale: 1   }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ 
              scale    : 1.05,
              boxShadow: '0 12px 40px rgba(27,67,50,0.35)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/book')}
            className ="hero-button"
            style={{
              background   : BRAND.green,
              color        : '#FFFFFF',
              border       : 'none',
              padding      : '18px 56px',
              borderRadius : '50px',
              fontSize     : '16px',
              fontWeight   : '700',
              cursor       : 'pointer',
              letterSpacing: '1.5px',
              display      : 'inline-flex',
              alignItems   : 'center',
              gap          : '10px',
              marginBottom : '48px',
              transition   : 'all 0.3s ease',
            }}
          >
            ✦ BOOK A SERVICE
          </motion.button>

          {/* 3 Trust Badges */}
          <motion.div
            initial   ={{ opacity: 0, y: 20 }}
            animate   ={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              display        : 'flex',
              justifyContent : 'center',
              gap            : '0',
              marginBottom   : '32px',
            }}
          >
            {[
              { icon: '🛡️', title: 'Verified',    sub: 'Experts'       },
              { icon: '🌿', title: 'Eco-Friendly', sub: 'Cleaning'      },
              { icon: '👍', title: '100%',         sub: 'Satisfaction Guaranteed' },
            ].map((badge, i) => (
              <div
                key  ={badge.title}
                style={{
                  display       : 'flex',
                  flexDirection : 'column',
                  alignItems    : 'center',
                  gap           : '8px',
                  padding       : '0 28px',
                  borderRight   : i < 2 
                    ? `1px solid rgba(27,67,50,0.2)` 
                    : 'none',
                }}
              >
                {/* Circle icon */}
                <div style={{
                  width          : '52px',
                  height         : '52px',
                  borderRadius   : '50%',
                  background     : 'rgba(27,67,50,0.08)',
                  border         : '1px solid rgba(27,67,50,0.15)',
                  display        : 'flex',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  fontSize       : '22px',
                }}>
                  {badge.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    color     : BRAND.green,
                    fontSize  : '13px',
                    fontWeight: '700',
                    margin    : 0,
                  }}>
                    {badge.title}
                  </p>
                  <p style={{
                    color   : BRAND.light,
                    fontSize: '12px',
                    margin  : '2px 0 0',
                  }}>
                    {badge.sub}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial   ={{ opacity: 0 }}
            animate   ={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              color        : BRAND.gold,
              fontSize     : '13px',
              fontWeight   : '600',
              letterSpacing: '1.5px',
              display      : 'flex',
              alignItems   : 'center',
              justifyContent: 'center',
              gap          : '10px',
            }}
          >
            ✦ Making Every Home Spotless ✦
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-heading { font-size: 28px !important }
          .hero-brand   { font-size: 48px !important }
          .hero-button  { 
            width: 100% !important; 
            max-width: 320px !important; 
          }
        }
      `}</style>
    </section>
  )
}
