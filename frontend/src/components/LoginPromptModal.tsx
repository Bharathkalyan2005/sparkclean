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
      background: 'rgba(0,0,0,0.4)',
      display   : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex    : 9999,
    }}>
      <div style={{
        background   : '#FFFFFF',
        border       : '1px solid #EDE8DC',
        borderRadius : '20px',
        padding      : '40px',
        maxWidth     : '400px',
        width        : '90%',
        textAlign    : 'center',
        boxShadow    : '0 8px 30px rgba(27,67,50,0.1)',
      }}>
        {/* Icon */}
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          🔒
        </div>

        {/* Title */}
        <h2 style={{
          color      : '#1B4332',
          fontSize   : '24px',
          fontFamily : 'Instrument Serif, serif',
          marginBottom: '12px',
        }}>
          Login Required
        </h2>

        {/* Message */}
        <p style={{
          color        : '#5C6B5E',
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
            background   : '#1B4332',
            color        : '#FFFFFF',
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
            color        : '#1B4332',
            fontWeight   : '600',
            fontSize     : '15px',
            borderRadius : '12px',
            border       : '1px solid #1B4332',
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
            color      : '#5C6B5E',
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
