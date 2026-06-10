import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete?: () => void;
}

const LoadingScreen = ({ onComplete }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // MAXIMUM 3 seconds - no exceptions
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position       : 'fixed',
            inset          : 0,
            background     : '#0A0A0A',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            flexDirection  : 'column',
            gap            : '24px',
            zIndex         : 99999,
          }}
        >
          <img
            src  ="/logo.png"
            alt  ="SuciHome"
            style={{
              height   : '72px',
              filter   : 'brightness(0) invert(1)',
              animation: 'pulse 1s infinite',
            }}
          />
          <p style={{
            color        : '#0AFFE6',
            letterSpacing: '4px',
            fontSize     : '12px',
            fontFamily   : 'Inter, sans-serif',
          }}>
            LOADING...
          </p>
          <div style={{
            width       : '160px',
            height      : '2px',
            background  : 'rgba(10,255,230,0.2)',
            borderRadius: '10px',
            overflow    : 'hidden',
          }}>
            <div style={{
              height    : '100%',
              background: '#0AFFE6',
              animation : 'load 3s linear forwards',
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0%,100%{opacity:1}50%{opacity:0.5}
            }
            @keyframes load {
              0%{width:0%}100%{width:100%}
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
