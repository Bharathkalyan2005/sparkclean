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
              <img src="/logo-primary-cropped.png" alt="SparkClean" className="w-16 h-auto relative z-10 animate-pulse" />
              {/* Shimmer ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-teal-400/30 animate-spin"
                style={{ width: '80px', height: '80px', top: '-8px', left: '-8px' }}
              />
            </div>

            <div className="text-center mt-2">
              <h1 className="font-syne font-bold text-2xl text-white">SparkClean</h1>
              <p className="font-dm text-sm mt-0.5" style={{ color: '#00CDB7' }}>India's Cleanest Choice</p>
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
