import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Force complete after 3 seconds MAX
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="loading-screen"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            <div style={{
              display        : 'flex',
              flexDirection  : 'column',
              alignItems     : 'center',
              justifyContent : 'center',
              gap            : '20px',
            }}>
              {/* Pulsing logo */}
              <img
                src  ="/logo.png"
                alt  ="SuciHome"
                style={{
                  height   : '80px',
                  width    : 'auto',
                  filter   : 'brightness(0) invert(1)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <span style={{
                color      : '#FFFFFF',
                fontSize   : '28px',
                fontWeight : '700',
                fontFamily : 'Instrument Serif, serif',
              }}>
                SuciHome
              </span>

              {/* Loading bar */}
              <div style={{
                width       : '120px',
                height      : '3px',
                background  : 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                overflow    : 'hidden',
              }}>
                <div style={{
                  height    : '100%',
                  background: '#0AFFE6',
                  animation : 'loading 1.5s ease-in-out infinite',
                  borderRadius: '10px',
                }} />
              </div>
            </div>

            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1) }
                50%       { opacity: 0.7; transform: scale(0.95) }
              }
              @keyframes loading {
                0%   { width: 0%;   margin-left: 0% }
                50%  { width: 100%; margin-left: 0% }
                100% { width: 0%;   margin-left: 100% }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
