import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete?: () => void;
  children?: React.ReactNode;
}

const LoadingScreen = ({ onComplete, children }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hard limit 2.5 seconds NO EXCEPTIONS
    const hardStop = setTimeout(() => {
      setVisible(false)
      onComplete?.()
    }, 2500)

    return () => clearTimeout(hardStop)
  }, [])

  // Make sure when done it shows children:
  if (!visible) return <>{children}</>

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
            background     : '#F5F0E8', // match new theme
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
              animation: 'pulse 1s infinite',
            }}
          />
          <p style={{
            color        : '#1B4332',
            letterSpacing: '4px',
            fontSize     : '12px',
            fontFamily   : 'Inter, sans-serif',
            fontWeight   : '600',
          }}>
            LOADING...
          </p>
          <div style={{
            width       : '160px',
            height      : '2px',
            background  : 'rgba(27,67,50,0.2)',
            borderRadius: '10px',
            overflow    : 'hidden',
          }}>
            <div style={{
              height    : '100%',
              background: '#1B4332',
              animation : 'load 2.5s linear forwards',
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
