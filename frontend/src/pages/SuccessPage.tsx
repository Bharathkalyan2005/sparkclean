import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const bookingId = new URLSearchParams(
      window.location.search
    ).get('booking')
  
    if (bookingId) {
      import('../lib/axiosInstance').then(m => m.default)
        .then(api => api.get(`/bookings/${bookingId}`))
        .then(res => setBooking(res.data))
        .catch(err => console.error(err))
    }
  }, [])

  const bookingId = searchParams.get('booking') || 'N/A';
  const name = searchParams.get('name') || 'Customer';

  const bookingNumber = localStorage.getItem('last_booking_number')
    || searchParams.get('number') || booking?.bookingNumber;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: '#0A0A0A' }}>

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
          background   : 'rgba(10,255,230,0.05)',
          border       : '1px solid rgba(10,255,230,0.3)',
          borderRadius : '20px',
          marginBottom : '24px',
        }}>
          {/* Animated checkmark */}
          <div style={{
            width          : '72px',
            height         : '72px',
            borderRadius   : '50%',
            background     : 'rgba(34,197,94,0.15)',
            border         : '2px solid #22C55E',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            margin         : '0 auto 20px',
            fontSize       : '32px',
          }}>
            ✓
          </div>

          <h2 style={{
            color      : '#FFFFFF',
            fontSize   : '28px',
            fontFamily : 'Instrument Serif, serif',
            marginBottom: '8px',
          }}>
            Booking Confirmed!
          </h2>

          <p style={{ color: '#A0A0A0', fontSize: '15px' }}>
            Your unique Booking ID
          </p>

          {/* Booking ID — big and copyable */}
          <div
            onClick={() => {
              navigator.clipboard.writeText(bookingNumber || '')
              toast.success('Booking ID copied!')
            }}
            style={{
              background   : 'rgba(10,255,230,0.08)',
              border       : '1px solid rgba(10,255,230,0.3)',
              borderRadius : '12px',
              padding      : '16px 24px',
              margin       : '16px auto',
              maxWidth     : '320px',
              cursor       : 'pointer',
              display      : 'flex',
              alignItems   : 'center',
              justifyContent: 'center',
              gap          : '12px',
            }}
          >
            <span style={{
              color        : '#0AFFE6',
              fontSize     : '22px',
              fontWeight   : '700',
              fontFamily   : 'monospace',
              letterSpacing: '2px',
            }}>
              {bookingNumber}
            </span>
            <span style={{ 
              color   : '#A0A0A0', 
              fontSize: '14px' 
            }}>
              📋
            </span>
          </div>

          <p style={{ 
            color   : '#A0A0A0', 
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
              onClick={() => navigate(`/track?id=${bookingNumber}`)}
              style={{
                flex         : 1,
                padding      : '12px',
                background   : '#0AFFE6',
                color        : '#000',
                fontWeight   : '700',
                borderRadius : '12px',
                border       : 'none',
                cursor       : 'pointer',
                fontSize     : '14px',
              }}
            >
              🔍 Track Booking
            </button>
            
            <a
              href={`https://wa.me/919392420643?text=Hi SparkClean! My booking ID is ${bookingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex           : 1,
                padding        : '12px',
                background     : '#25D366',
                color          : '#FFF',
                fontWeight     : '700',
                borderRadius   : '12px',
                textDecoration : 'none',
                fontSize       : '14px',
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
                gap            : '6px',
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div style={{
          background   : '#161616',
          border       : '1px solid rgba(10,255,230,0.2)',
          borderRadius : '16px',
          padding      : '24px',
          textAlign    : 'center',
          marginTop    : '24px',
          marginBottom : '24px',
        }}>
          <p style={{ fontSize:'32px' }}>⭐</p>
          <h3 style={{ color:'#FFFFFF' }} className="font-syne font-bold text-xl mt-2">
            How are we doing?
          </h3>
          <p style={{ color:'#A0A0A0', fontSize:'14px' }} className="font-dm mt-1">
            Take 30 seconds to share your experience
          </p>
          <button 
            onClick={() => setShowFeedback(true)}
            style={{
              background   : '#0AFFE6',
              color        : '#000',
              fontWeight   : '700',
              padding      : '12px 32px',
              borderRadius : '10px',
              border       : 'none',
              cursor       : 'pointer',
              marginTop    : '16px',
            }}
            className="font-dm"
          >
            ✦ Leave a Review
          </button>
          <p 
            onClick={() => navigate('/')}
            style={{ 
              color    : '#A0A0A0',
              fontSize : '13px',
              cursor   : 'pointer',
              marginTop: '12px',
            }}
            className="font-dm hover:text-white transition-colors"
          >
            Skip for now
          </p>
        </div>

        <FeedbackModal
          isOpen={showFeedback}
          bookingId={booking?.id}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => {
            setShowFeedback(false);
            toast.success('Thank you for your feedback! 🎉');
          }}
        />
      </motion.div>
    </div>
  );
};

export default SuccessPage;