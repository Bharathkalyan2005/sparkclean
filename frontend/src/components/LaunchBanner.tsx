import React, { useState, useEffect } from 'react';

export default function LaunchBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('vizag_launch_banner_dismissed') === 'true';
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('vizag_launch_banner_dismissed', 'true');
    setVisible(false);
    window.dispatchEvent(new Event('launchBannerClosed'));
  };

  if (!visible) return null;

  return (
    <div style={{
      background     : '#0D2B1F',
      color          : '#FFFFFF',
      textAlign      : 'center',
      padding        : '10px 16px',
      fontSize       : '14px',
      position       : 'fixed',
      top            : 0,
      left           : 0,
      right          : 0,
      height         : '38px',
      zIndex         : 9999,
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      gap            : '12px',
      boxSizing      : 'border-box',
    }}>
      <span style={{ color: '#C9A84C' }}>✦</span>
      <span>
        SuciHome now live in 6 cities! 
        Hyderabad • Bhopal • Chennai just launched —
      </span>
      
      {/* Gold Book Now button */}
      <a href="/book" style={{
        background   : '#C9A84C',
        color        : '#FFFFFF',
        padding      : '4px 18px',
        borderRadius : '20px',
        textDecoration: 'none',
        fontWeight   : '700',
        fontSize     : '12px',
      }}>
        Book Now
      </a>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position  : 'absolute',
          right     : '16px',
          background: 'transparent',
          border    : 'none',
          color     : '#FFFFFF',
          cursor    : 'pointer',
          fontSize  : '18px',
        }}
      >×</button>
    </div>
  );
}
