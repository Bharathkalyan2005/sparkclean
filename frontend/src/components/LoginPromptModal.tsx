import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) => {
  const navigate = useNavigate()
  
  if (!isOpen) return null
  
  return (
    <div style={{
      position  : 'fixed',
      inset     : 0,
      background: 'rgba(0,0,0,0.7)',
      display   : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex    : 9999,
    }}>
      <div style={{
        background   : '#111111',
        border       : '1px solid rgba(10,255,230,0.3)',
        borderRadius : '20px',
        padding      : '40px',
        maxWidth     : '400px',
        width        : '90%',
        textAlign    : 'center',
      }}>
        {/* Icon */}
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          🔒
        </div>

        {/* Title */}
        <h2 style={{
          color      : '#FFFFFF',
          fontSize   : '24px',
          fontFamily : 'Instrument Serif, serif',
          marginBottom: '12px',
        }}>
          Login Required
        </h2>

        {/* Message */}
        <p style={{
          color        : 'rgba(255,255,255,0.6)',
          fontSize     : '15px',
          lineHeight   : '1.6',
          marginBottom : '28px',
        }}>
          Please login or create an account
          to book SuciHome services
        </p>

        {/* Login Button */}
        <button
          onClick={() => {
            onClose()
            navigate('/auth?redirect=/book')
          }}
          style={{
            width        : '100%',
            padding      : '14px',
            background   : '#0AFFE6',
            color        : '#000000',
            fontWeight   : '700',
            fontSize     : '15px',
            borderRadius : '12px',
            border       : 'none',
            cursor       : 'pointer',
            marginBottom : '12px',
          }}
        >
          ✦ Login to SuciHome
        </button>

        {/* Sign Up Button */}
        <button
          onClick={() => {
            onClose()
            navigate('/auth?tab=signup&redirect=/book')
          }}
          style={{
            width        : '100%',
            padding      : '14px',
            background   : 'transparent',
            color        : '#0AFFE6',
            fontWeight   : '600',
            fontSize     : '15px',
            borderRadius : '12px',
            border       : '1px solid rgba(10,255,230,0.3)',
            cursor       : 'pointer',
            marginBottom : '12px',
          }}
        >
          Create New Account
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            background : 'transparent',
            border     : 'none',
            color      : 'rgba(255,255,255,0.4)',
            cursor     : 'pointer',
            fontSize   : '14px',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

export default LoginPromptModal;
