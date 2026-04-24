import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
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
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <svg width="72" height="72" viewBox="0 0 36 36" fill="none">
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0AFFE6"/>
                    <stop offset="1" stopColor="#00CDB7"/>
                  </linearGradient>
                </defs>
                <motion.polygon
                  points="18,2 20.5,14 32,14 22.5,21.5 26,33 18,26 10,33 13.5,21.5 4,14 15.5,14"
                  fill="url(#loadGrad)"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 0.9, rotate: 360 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <polygon
                  points="18,8 19.2,13.5 24,13 19.8,16.5 21.5,22 18,18.5 14.5,22 16.2,16.5 12,13 16.8,13.5"
                  fill="#0AFFE6"
                />
              </svg>
              {/* Shimmer ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-teal-400/30 animate-spin"
                style={{ width: '80px', height: '80px', top: '-4px', left: '-4px' }}
              />
            </div>

            <div className="text-center">
              <h1 className="font-syne font-bold text-2xl" style={{ color: '#1A1A2E' }}>SparkClean</h1>
              <p className="font-dm text-sm mt-0.5" style={{ color: '#00897B' }}>India's Cleanest Choice</p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="w-32 h-0.5 rounded-full overflow-hidden mt-2"
              style={{ background: 'rgba(10,255,230,0.15)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0AFFE6, #00CDB7)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
