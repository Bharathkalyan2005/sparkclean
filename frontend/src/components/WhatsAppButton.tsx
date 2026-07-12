import React from 'react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919392420643?text=Hi%20SuciHome!%20I%20want%20to%20book%20a%20service."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      style={{
        position    : 'fixed',
        bottom      : '24px',
        right       : '24px',
        zIndex      : 9999,
        display     : 'flex',
        alignItems  : 'center',
        gap         : '10px',
        background  : '#25D366',
        borderRadius: '50px',
        padding     : '12px 20px',
        boxShadow   : '0 4px 20px rgba(37,211,102,0.4)',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '22px' }}>💬</span>
      <div className="chat-text" style={{ textAlign: 'left' }}>
        <p style={{
          color    : '#FFFFFF',
          fontSize : '13px',
          fontWeight:'700',
          margin   : 0,
        }}>Chat with us</p>
        <p style={{
          color  : 'rgba(255,255,255,0.85)',
          fontSize:'11px',
          margin : 0,
        }}>We're here to help!</p>
      </div>
    </a>
  );
}
