import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axiosInstance';
import FeedbackModal from '../components/FeedbackModal';

// Simple CSS confetti
const Confetti: React.FC = () => {
  const colors = ['#0AFFE6', '#FFD700', '#FF6B6B', '#A78BFA', '#4ADE80', '#00CDB7'];
  const pieces = Array.from({ length: 60 });

  return (
    <div className="confetti-container">
      {pieces.map((_, i) => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const size = 6 + Math.random() * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: left + '%',
              top: '-10px',
              width: size + 'px',
              height: size + 'px',
              background: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function SuccessPage() {
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const [bookingNumber, setBookingNumber] = useState('')
  const [bookingData,   setBookingData]   = useState<any>(null)
  
  const [showConfetti, setShowConfetti] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Try ALL possible sources for booking number
    // Priority: URL param -> localStorage -> API fetch

    // Source 1: URL param ?number=SH-XXXX
    const numberFromUrl = searchParams.get('number')

    // Source 2: localStorage
    const numberFromStorage = 
      localStorage.getItem('sh_booking_number') ||
      localStorage.getItem('last_booking_number') ||
      localStorage.getItem('bookingNumber')

    // Source 3: booking ID from URL -> fetch from API
    const bookingId = searchParams.get('booking')
    
    // Use best available source
    if (numberFromUrl && numberFromUrl !== 'undefined') {
      setBookingNumber(numberFromUrl)
    } else if (
      numberFromStorage && 
      numberFromStorage !== 'undefined'
    ) {
      setBookingNumber(numberFromStorage)
    } else if (bookingId && bookingId !== 'undefined') {
      // Fetch from API using booking ID
      api.get(`/bookings/${bookingId}`)
        .then(res => {
          const num = res.data.bookingNumber
          setBookingNumber(num)
          setBookingData(res.data)
          localStorage.setItem('sh_booking_number', num)
        })
        .catch(err => {
          console.error('API fetch failed:', err)
          setBookingNumber('Check your email for ID')
        })
    } else {
      console.warn('No booking number found anywhere!')
      setBookingNumber('Check your email')
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: '#F5F0E8' }}>

      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="text-center max-w-lg w-full relative z-10"
      >
        <div style={{
          textAlign    : 'center',
          padding      : '32px',
          background   : '#FFFFFF',
          border       : '1px solid #EDE8DC',
          borderRadius : '20px',
          marginBottom : '24px',
          boxShadow    : '0 10px 30px rgba(27,67,50,0.05)',
        }}>
          <img
            src  ="/logo.png"
            alt  ="SuciHome"
            loading="lazy"
            decoding="async"
            style={{
              height      : '50px',
              width       : 'auto',
              filter      : 'none',
              marginBottom: '16px',
              marginLeft  : 'auto',
              marginRight : 'auto',
            }}
          />
          {/* Animated checkmark */}
          <div style={{
            width          : '72px',
            height         : '72px',
            borderRadius   : '50%',
            background     : 'rgba(27,67,50,0.1)',
            border         : '2px solid #1B4332',
            color          : '#1B4332',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            margin         : '0 auto 20px',
            fontSize       : '32px',
            fontWeight     : 'bold',
          }}>
            ✓
          </div>

          <h2 style={{
            color      : '#2D4A35',
            fontSize   : '28px',
            fontFamily : 'Instrument Serif, serif',
            fontWeight : 'bold',
            marginBottom: '8px',
          }}>
            Booking Confirmed!
          </h2>

          <p style={{ color: '#5C6B5E', fontSize: '15px' }}>
            Your unique Booking ID
          </p>

          <div
            onClick={() => {
              if (bookingNumber && bookingNumber !== 'undefined' && bookingNumber !== 'Check your email' && bookingNumber !== 'Check your email for ID') {
                navigator.clipboard.writeText(bookingNumber)
                toast.success('Booking ID copied! 📋')
              }
            }}
            style={{
              background    : 'rgba(27,67,50,0.05)',
              border        : '1px solid #EDE8DC',
              borderRadius  : '12px',
              padding       : isMobile ? '12px 16px' : '16px 24px',
              margin        : '16px auto',
              maxWidth      : isMobile ? '290px' : '340px',
              cursor        : bookingNumber && !bookingNumber.includes('Check') ? 'pointer' : 'default',
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              gap           : isMobile ? '8px' : '12px',
              minHeight     : '60px',
            }}
          >
            {bookingNumber && bookingNumber !== 'undefined' ? (
              <>
                <span style={{
                  color        : '#1B4332',
                  fontSize     : isMobile ? '14px' : '20px',
                  fontWeight   : '700',
                  fontFamily   : 'monospace',
                  letterSpacing: isMobile ? '1px' : '2px',
                  wordBreak    : 'break-all',
                }}>
                  {bookingNumber}
                </span>
                <span style={{ color: '#5C6B5E', fontSize: '16px' }}>
                  📋
                </span>
              </>
            ) : (
              // Loading state while fetching
              <div style={{
                display   : 'flex',
                alignItems: 'center',
                gap       : '10px',
              }}>
                <svg 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <circle 
                    cx="12" cy="12" r="10"
                    stroke="#1B4332" strokeWidth="3"
                    strokeDasharray="50 30"
                  />
                </svg>
                <span style={{ color: '#5C6B5E', fontSize: '14px' }}>
                  Loading your Booking ID...
                </span>
              </div>
            )}
          </div>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg) }
              to   { transform: rotate(360deg) }
            }
          `}</style>
          
          <p style={{ 
            color   : '#5C6B5E', 
            fontSize: '12px' 
          }}>
            Tap to copy • Use this ID to track your booking
          </p>

          {/* Action buttons */}
          <div style={{
            display  : 'flex',
            gap      : '12px',
            marginTop: '20px',
          }}>
            <button
              onClick={() => {
                if (bookingNumber && bookingNumber !== 'undefined' && !bookingNumber.includes('Check')) {
                  navigate(`/track?id=${bookingNumber}`)
                } else {
                  navigate('/track')
                }
              }}
              style={{
                flex        : 1,
                padding     : '14px',
                background  : '#1B4332',
                color       : '#FFFFFF',
                fontWeight  : '700',
                borderRadius: '12px',
                border      : 'none',
                cursor      : 'pointer',
                fontSize    : '15px',
                display     : 'flex',
                alignItems  : 'center',
                justifyContent: 'center',
                gap         : '8px',
              }}
            >
              🔍 Track Booking
            </button>

            <a
              href={`https://wa.me/919392420643?text=${
                encodeURIComponent(
                  `Hi SuciHome! My booking ID is ${
                    bookingNumber && !bookingNumber.includes('Check') ? bookingNumber : 'just created'
                  }. I need help.`
                )
              }`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex           : 1,
                padding        : '14px',
                background     : '#25D366',
                color          : '#FFF',
                fontWeight     : '700',
                borderRadius   : '12px',
                textDecoration : 'none',
                fontSize       : '15px',
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
                gap            : '8px',
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div style={{
          background   : '#FFFFFF',
          border       : '1px solid #EDE8DC',
          borderRadius : '16px',
          padding      : '24px',
          textAlign    : 'center',
          marginTop    : '24px',
          marginBottom : '24px',
          boxShadow    : '0 10px 30px rgba(27,67,50,0.05)',
        }}>
          <p style={{ fontSize:'32px' }}>⭐</p>
          <h3 style={{ color:'#2D4A35' }} className="font-syne font-bold text-xl mt-2">
            How are we doing?
          </h3>
          <p style={{ color:'#5C6B5E', fontSize:'14px' }} className="font-dm mt-1">
            Take 30 seconds to share your experience
          </p>
          <button 
            onClick={() => setShowFeedback(true)}
            style={{
              background   : '#C9A84C',
              color        : '#FFFFFF',
              fontWeight   : '700',
              padding      : '12px 32px',
              borderRadius : '10px',
              border       : 'none',
              cursor       : 'pointer',
              marginTop    : '16px',
            }}
            className="font-dm hover:bg-[#B3933B] transition-colors"
          >
            ✦ Leave a Review
          </button>
          <p 
            onClick={() => navigate('/')}
            style={{ 
              color    : '#5C6B5E',
              fontSize : '13px',
              cursor   : 'pointer',
              marginTop: '12px',
            }}
            className="font-dm hover:text-[#2D4A35] transition-colors"
          >
            Skip for now
          </p>
        </div>

        <FeedbackModal
          isOpen={showFeedback}
          bookingId={bookingData?.id}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => {
            setShowFeedback(false);
            toast.success('Thank you for your feedback! 🎉');
          }}
        />
      </motion.div>
    </div>
  );
}