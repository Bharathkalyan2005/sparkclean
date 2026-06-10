import React, { useState, useEffect } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || 'https://sparkclean-x3ze.onrender.com';
    
    // Check backend
    fetch(`${API}/api/health`)
      .then(r => r.json())
      .then(d => setStatus((prev: any) => ({
        ...prev, backend: '✅ Online', data: JSON.stringify(d)
      })))
      .catch(() => setStatus((prev: any) => ({
        ...prev, backend: '❌ Offline/Sleeping'
      })));

    // Check env vars
    setStatus((prev: any) => ({
      ...prev,
      apiUrl   : API || '❌ MISSING',
      razorpay : process.env.REACT_APP_RAZORPAY_KEY_ID 
                 ? '✅ Set' : '❌ MISSING',
      maps     : process.env.REACT_APP_GOOGLE_MAPS_KEY 
                 ? '✅ Set' : '❌ MISSING',
      token    : (localStorage.getItem('sparkclean_token') || localStorage.getItem('sucihome_token'))
                 ? '✅ Logged in' : '⚠️ Not logged in',
    }));
  }, []);

  return (
    <div style={{
      minHeight : '100vh',
      background: '#0A0A0A',
      padding   : '100px 24px',
      fontFamily: 'monospace',
      color     : '#FFFFFF',
    }}>
      <h1 style={{ color:'#0AFFE6', marginBottom:'24px' }}>
        SuciHome System Health
      </h1>
      {Object.entries(status).map(([key, val]) => (
        <div key={key} style={{
          display      : 'flex',
          gap          : '16px',
          padding      : '12px',
          background   : 'rgba(255,255,255,0.03)',
          borderRadius : '8px',
          marginBottom : '8px',
        }}>
          <span style={{ color:'#A0A0A0', width:'120px' }}>
            {key}:
          </span>
          <span>{String(val)}</span>
        </div>
      ))}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop   : '24px',
          padding     : '12px 24px',
          background  : '#0AFFE6',
          color       : '#000',
          border      : 'none',
          borderRadius: '10px',
          cursor      : 'pointer',
          fontWeight  : '700',
        }}
      >
        Refresh Check
      </button>
    </div>
  );
}
