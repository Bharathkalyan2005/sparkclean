import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size}px`,
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

  const bookingId = searchParams.get('id') || 'N/A';
  const name = searchParams.get('name') || 'Customer';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'linear-gradient(135deg, #F0FFFE 0%, #FFFFFF 60%, #F0FFFE 100%)' }}>

      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="rounded-3xl p-10 md:p-14 text-center max-w-lg w-full relative z-10"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(10,255,230,0.25)',
          boxShadow: '0 8px 60px rgba(10,255,230,0.15), 0 2px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, #0AFFE6, #00CDB7)',
            boxShadow: '0 0 40px rgba(10,255,230,0.4)',
          }}
        >
          <svg className="w-12 h-12" fill="none" stroke="#0A1628" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </motion.div>

        {/* Sparkle accents */}
        <div className="absolute top-8 right-8 text-4xl animate-bounce" style={{ color: '#0AFFE6', opacity: 0.6 }}>✦</div>
        <div className="absolute bottom-8 left-8 text-2xl animate-spin" style={{ color: '#0AFFE6', opacity: 0.3, animationDuration: '8s' }}>✦</div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-syne font-bold text-3xl mb-2" style={{ color: '#1A1A2E' }}>Booking Confirmed! 🎉</h1>
          <p className="font-dm text-lg mb-6" style={{ color: '#00897B' }}>Thank you, {name}!</p>

          <div style={{
            background   : 'rgba(10,255,230,0.06)',
            border       : '1px solid rgba(10,255,230,0.25)',
            borderRadius : '16px',
            padding      : '20px',
            textAlign    : 'center',
            marginBottom : '24px',
          }}>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }} className="font-dm">
              Your Booking ID
            </p>
            <p style={{
              color        : '#0AFFE6',
              fontSize     : '24px',
              fontWeight   : '700',
              fontFamily   : 'monospace',
              letterSpacing: '2px',
              margin       : '8px 0',
            }}>
              {booking?.bookingNumber || (typeof bookingId === 'string' ? bookingId.substring(0, 16) : bookingId)}
            </p>
            <p style={{ color: '#A0A0A0', fontSize: '13px' }} className="font-dm">
              Save this ID to track your booking
            </p>

            <button
              onClick={() => navigate(`/track?id=${booking?.bookingNumber || bookingId}`)}
              className="font-dm"
              style={{
                marginTop    : '16px',
                padding      : '10px 24px',
                background   : 'transparent',
                border       : '1px solid #0AFFE6',
                color        : '#0AFFE6',
                borderRadius : '10px',
                cursor       : 'pointer',
                fontSize     : '14px',
                fontWeight   : '600',
              }}
            >
              Track This Booking →
            </button>
          </div>

          <div className="font-dm text-sm space-y-2 mb-8 text-left" style={{ color: '#4A4A6A' }}>
            <div className="flex items-center gap-3">
              <span style={{ color: '#0AFFE6' }}>✓</span>
              <span>WhatsApp confirmation sent to your number</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: '#0AFFE6' }}>✓</span>
              <span>Our team will confirm your booking within 30 minutes</span>
            </div>
            
            {booking && (
              <div className="mt-4 p-4 rounded-xl" style={{ border: '1.5px solid rgba(10,255,230,0.2)', background: 'rgba(10,255,230,0.02)' }}>
                <p className="font-dm text-xs uppercase" style={{ color: '#8A8AAA' }}>Order Details</p>
                <p className="mt-3 font-medium" style={{ color: '#1A1A2E' }}>Booking ID: {booking.bookingNumber}</p>
                <p className="mt-1">Date: {new Date(booking.scheduledDate).toLocaleDateString('en-IN')} at {booking.scheduledTime}</p>
                <p className="mt-1">Total Paid: <span style={{ color: '#00897B' }}>₹{booking.totalAmount}</span></p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/919392420643?text=Track%20your%20booking:%20https://sparkclean-orcin.vercel.app/track?id=${booking?.bookingNumber || (typeof bookingId === 'string' ? bookingId.substring(0, 16) : bookingId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl font-dm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Track on WhatsApp
            </a>
            <Link to="/" className="flex-1 btn-teal py-3 flex items-center justify-center gap-2 text-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
