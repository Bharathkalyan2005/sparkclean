import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TrackingPage: React.FC = () => {
  const [query, setQuery]       = useState('')
  const [booking, setBooking]   = useState<any>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [notFound, setNotFound] = useState(false)

  // Check URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      setQuery(id)
      handleTrack(id)  // auto-track if ID in URL
    }
  }, [])

  const handleTrack = async (searchQuery?: string) => {
    const trackQuery = (searchQuery || query).trim()
    
    if (!trackQuery) {
      setError('Please enter a Booking ID or Phone Number')
      return
    }

    setLoading(true)
    setError('')
    setBooking(null)
    setNotFound(false)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

      // Detect if phone number or booking ID
      const isPhone = /^\d{10}$/.test(trackQuery)

      let response

      if (isPhone) {
        // Track by phone
        response = await fetch(`${API_URL}/api/bookings/track-by-phone`, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ phone: trackQuery })
        })
      } else {
        // Track by booking ID
        const bookingId = trackQuery.toUpperCase()
        response = await fetch(
          `${API_URL}/api/bookings/track/${bookingId}`
        )
      }

      const data = await response.json()

      console.log('Track response:', data)

      if (!response.ok) {
        setNotFound(true)
        setError(data.error || 'Booking not found')
        return
      }

      // Handle both single booking and array
      if (data.bookings) {
        setBooking(data.bookings[0]) // show latest
      } else {
        setBooking(data)
      }

    } catch (err: any) {
      console.error('Track error:', err)
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-syne font-bold text-4xl mb-4 text-white"
          >
            Track Your Booking
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 font-dm"
          >
            Enter your Booking ID or Phone Number to check status
          </motion.p>
        </div>

        <div style={{
          display      : 'flex',
          gap          : '0',
          maxWidth     : '600px',
          margin       : '0 auto',
          background   : 'rgba(255,255,255,0.05)',
          border       : `1px solid ${error 
                          ? '#EF4444' 
                          : 'rgba(10,255,230,0.25)'}`,
          borderRadius : '14px',
          overflow     : 'hidden',
          padding      : '4px',
        }}>
          {/* Search Icon */}
          <span style={{
            padding    : '0 12px',
            display    : 'flex',
            alignItems : 'center',
            color      : '#0AFFE6',
            fontSize   : '18px',
          }}>
            🔍
          </span>

          {/* Input */}
          <input
            type        ="text"
            value       ={query}
            onChange    ={e => {
              setQuery(e.target.value)
              setError('')
            }}
            onKeyDown   ={e => e.key === 'Enter' && handleTrack()}
            placeholder ="Enter Booking ID (SC-20260501-XXXXX) or Phone"
            style={{
              flex       : 1,
              background : 'transparent',
              border     : 'none',
              outline    : 'none',
              color      : '#FFFFFF',
              fontSize   : '15px',
              padding    : '14px 8px',
            }}
          />

          {/* Track Button */}
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            style={{
              padding      : '12px 28px',
              background   : loading 
                            ? 'rgba(10,255,230,0.5)' 
                            : '#0AFFE6',
              color        : '#000000',
              fontWeight   : '700',
              fontSize     : '15px',
              border       : 'none',
              borderRadius : '10px',
              cursor       : loading ? 'not-allowed' : 'pointer',
              transition   : 'all 0.2s',
              whiteSpace   : 'nowrap',
            }}
          >
            {loading ? 'Searching...' : 'Track Now'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p style={{
            color     : '#EF4444',
            textAlign : 'center',
            marginTop : '12px',
            fontSize  : '14px',
          }}>
            ⚠️ {error}
          </p>
        )}

        {/* Not Found State */}
        {notFound && (
          <div style={{
            textAlign    : 'center',
            marginTop    : '40px',
            padding      : '32px',
            background   : 'rgba(239,68,68,0.05)',
            border       : '1px solid rgba(239,68,68,0.2)',
            borderRadius : '16px',
            maxWidth     : '500px',
            margin       : '40px auto 0',
          }}>
            <p style={{ fontSize: '40px' }}>🔍</p>
            <p style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '18px' }}>
              Booking Not Found
            </p>
            <p style={{ color: '#A0A0A0', fontSize: '14px', marginTop: '8px' }}>
              Check your Booking ID or use the phone 
              number you registered with
            </p>
            
            <a 
              href={`https://wa.me/919392420643?text=Hi! I can't find my booking.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display      : 'inline-block',
                marginTop    : '16px',
                padding      : '10px 24px',
                background   : '#25D366',
                color        : '#FFFFFF',
                borderRadius : '10px',
                textDecoration: 'none',
                fontSize     : '14px',
                fontWeight   : '600',
              }}
            >
              💬 Contact Support
            </a>
          </div>
        )}

        {/* Booking Details & Timeline */}
        {booking && (
          <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>

            {/* Booking ID Card */}
            <div style={{
              background   : 'rgba(10,255,230,0.06)',
              border       : '1px solid rgba(10,255,230,0.25)',
              borderRadius : '16px',
              padding      : '24px',
              marginBottom : '24px',
              display      : 'flex',
              justifyContent: 'space-between',
              alignItems   : 'center',
              flexWrap     : 'wrap',
              gap          : '12px',
            }}>
              <div>
                <p style={{ color: '#A0A0A0', fontSize: '12px' }}>
                  BOOKING ID
                </p>
                <p style={{
                  color        : '#0AFFE6',
                  fontSize     : '20px',
                  fontWeight   : '700',
                  fontFamily   : 'monospace',
                  letterSpacing: '1px',
                }}>
                  {booking.bookingNumber}
                </p>
              </div>

              {/* Status Badge */}
              <span style={{
                padding      : '6px 16px',
                borderRadius : '20px',
                fontSize     : '13px',
                fontWeight   : '700',
                background   : booking.status === 'COMPLETED' 
                  ? 'rgba(34,197,94,0.15)'
                  : booking.status === 'CONFIRMED'
                  ? 'rgba(10,255,230,0.15)'
                  : booking.status === 'CANCELLED'
                  ? 'rgba(239,68,68,0.15)'
                  : 'rgba(245,158,11,0.15)',
                color: booking.status === 'COMPLETED' 
                  ? '#22C55E'
                  : booking.status === 'CONFIRMED'
                  ? '#0AFFE6'
                  : booking.status === 'CANCELLED'
                  ? '#EF4444'
                  : '#F59E0B',
                border: `1px solid ${
                  booking.status === 'COMPLETED' 
                  ? 'rgba(34,197,94,0.3)'
                  : booking.status === 'CONFIRMED'
                  ? 'rgba(10,255,230,0.3)'
                  : booking.status === 'CANCELLED'
                  ? 'rgba(239,68,68,0.3)'
                  : 'rgba(245,158,11,0.3)'
                }`,
              }}>
                {booking.status}
              </span>
            </div>

            {/* Timeline */}
            {[
              { 
                label: 'Booking Received', 
                done : true,
                time : new Date(booking.createdAt)
                        .toLocaleString('en-IN'),
              },
              { 
                label: 'Payment Confirmed', 
                done : booking.paymentStatus === 'PAID',
                time : booking.paymentStatus === 'PAID' 
                      ? 'Paid via ' + booking.paymentMethod 
                      : 'Pending',
              },
              { 
                label: 'Cleaner Assigned', 
                done : ['ASSIGNED','IN_PROGRESS','COMPLETED']
                      .includes(booking.status),
                time : 'Will be notified via WhatsApp',
              },
              { 
                label: 'Service In Progress', 
                done : ['IN_PROGRESS','COMPLETED']
                      .includes(booking.status),
                time : `Scheduled: ${
                  new Date(booking.scheduledDate)
                  .toLocaleDateString('en-IN')} at ${booking.scheduledTime}`,
              },
              { 
                label: 'Service Completed', 
                done : booking.status === 'COMPLETED',
                time : booking.status === 'COMPLETED' 
                      ? 'Done ✓' : 'Pending',
              },
            ].map((step, i) => (
              <div key={i} style={{
                display      : 'flex',
                gap          : '16px',
                marginBottom : '8px',
                opacity      : step.done ? 1 : 0.4,
              }}>
                {/* Dot + Line */}
                <div style={{
                  display       : 'flex',
                  flexDirection : 'column',
                  alignItems    : 'center',
                }}>
                  <div style={{
                    width        : '28px',
                    height       : '28px',
                    borderRadius : '50%',
                    background   : step.done 
                                  ? '#0AFFE6' 
                                  : 'rgba(255,255,255,0.1)',
                    border       : step.done 
                                  ? 'none' 
                                  : '2px solid rgba(255,255,255,0.2)',
                    display      : 'flex',
                    alignItems   : 'center',
                    justifyContent:'center',
                    fontSize     : '13px',
                    flexShrink   : 0,
                  }}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  {i < 4 && (
                    <div style={{
                      width     : '2px',
                      height    : '40px',
                      background: step.done 
                                  ? '#0AFFE6' 
                                  : 'rgba(255,255,255,0.1)',
                      margin    : '4px 0',
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingTop: '4px' }}>
                  <p style={{
                    color     : step.done ? '#FFFFFF' : '#A0A0A0',
                    fontWeight: '600',
                    fontSize  : '15px',
                  }}>
                    {step.label}
                  </p>
                  <p style={{
                    color    : '#A0A0A0',
                    fontSize : '13px',
                    marginTop: '2px',
                  }}>
                    {step.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Booking Details */}
            <div style={{
              background   : 'rgba(255,255,255,0.03)',
              border       : '1px solid rgba(255,255,255,0.08)',
              borderRadius : '16px',
              padding      : '20px',
              marginTop    : '24px',
            }}>
              {[
                ['Services',  (booking.services as any[])
                              .map((s:any) => s.name).join(', ')],
                ['Date',      new Date(booking.scheduledDate)
                              .toLocaleDateString('en-IN')],
                ['Time',      booking.scheduledTime],
                ['Area',      booking.area + ', ' + booking.city],
                ['Amount',    '₹' + booking.totalAmount],
                ['Payment',   booking.paymentStatus],
                ['Customer',  booking.customerPhone],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display        : 'flex',
                  justifyContent : 'space-between',
                  padding        : '10px 0',
                  borderBottom   : '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ color: '#A0A0A0', fontSize: '14px' }}>
                    {label}
                  </span>
                  <span style={{
                    color     : '#FFFFFF',
                    fontSize  : '14px',
                    fontWeight: '500',
                    maxWidth  : '60%',
                    textAlign : 'right',
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* WhatsApp Support */}
            <a 
              href={`https://wa.me/919392420643?text=Hi SparkClean! My booking ID is ${booking.bookingNumber}. I need help.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
                gap            : '8px',
                marginTop      : '20px',
                padding        : '14px',
                background     : '#25D366',
                color          : '#FFFFFF',
                borderRadius   : '12px',
                textDecoration : 'none',
                fontWeight     : '600',
                fontSize       : '15px',
              }}
            >
              💬 Need Help? Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
