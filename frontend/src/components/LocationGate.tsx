import { useEffect, useState } from 'react'
import api                     from '../lib/axiosInstance'

type LocationStatus = 
  | 'checking'
  | 'serviceable'
  | 'coming_soon'
  | 'outside_india'
  | 'error'
  | 'denied'

interface LocationGateProps {
  children : React.ReactNode
  isAdmin  : boolean
}

export default function LocationGate({
  children,
  isAdmin,
}: LocationGateProps) {
  const [status,      setStatus]      = useState<LocationStatus>('checking')
  const [locationData, setLocationData] = useState<any>(null)
  const [skipped,     setSkipped]     = useState(false)

  useEffect(() => {
    // Admin bypasses location check completely
    if (isAdmin) {
      setStatus('serviceable')
      return
    }

    checkLocation()
  }, [isAdmin])

  const checkLocation = () => {
    setStatus('checking')

    if (!navigator.geolocation) {
      // Browser doesn't support geolocation
      // Allow access but show note
      setStatus('serviceable')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Call BACKEND to check serviceability
          // Never expose Google API key to frontend
          const res = await api.post(
            '/location/check',
            { lat: latitude, lng: longitude }
          )

          setLocationData(res.data)

          if (res.data.serviceable) {
            setStatus('serviceable')
          } else if (res.data.status === 'OUTSIDE_INDIA') {
            setStatus('outside_india')
          } else {
            setStatus('coming_soon')
          }

        } catch (err) {
          // If API fails, allow access (don't block)
          console.error('Location check failed:', err)
          setStatus('serviceable')
        }
      },
      (error) => {
        // User denied location or error
        if (error.code === 1) {
          setStatus('denied')
        } else {
          // Other error — allow access
          setStatus('serviceable')
        }
      },
      {
        timeout           : 10000,
        maximumAge        : 300000, // cache 5 mins
        enableHighAccuracy: false,
      }
    )
  }

  // ── CHECKING STATE ──
  if (status === 'checking') {
    return (
      <div style={{
        minHeight      : '100vh',
        background     : '#F5F0E8',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        flexDirection  : 'column',
        gap            : '20px',
      }}>
        <div style={{
          width        : '64px',
          height       : '64px',
          borderRadius : '50%',
          border       : '3px solid rgba(27,67,50,0.15)',
          borderTop    : '3px solid #1B4332',
          animation    : 'spin 1s linear infinite',
        }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color     : '#2D4A35',
            fontSize  : '18px',
            fontWeight: '600',
            fontFamily: 'Instrument Serif, serif',
          }}>
            Detecting your location...
          </p>
          <p style={{ color: '#5C6B5E', fontSize: '14px' }}>
            Checking service availability in your area
          </p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg) }
            to   { transform: rotate(360deg) }
          }
        `}</style>
      </div>
    )
  }

  // ── COMING SOON STATE ──
  if (status === 'coming_soon' && !skipped) {
    return (
      <div style={{
        minHeight      : '100vh',
        background     : '#F5F0E8',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : '24px',
      }}>
        <div style={{
          maxWidth     : '480px',
          width        : '100%',
          textAlign    : 'center',
        }}>
          {/* Animated location pin */}
          <div style={{
            width          : '80px',
            height         : '80px',
            borderRadius   : '50%',
            background     : 'rgba(27,67,50,0.08)',
            border         : '2px solid rgba(27,67,50,0.3)',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            margin         : '0 auto 24px',
            fontSize       : '36px',
            animation      : 'pulse 2s infinite',
          }}>
            📍
          </div>

          <h1 style={{
            color      : '#1B4332',
            fontSize   : '28px',
            fontFamily : 'Instrument Serif, serif',
            fontWeight : '700',
            marginBottom: '12px',
            lineHeight : '1.3',
          }}>
            We haven't reached
            your location yet!
          </h1>

          <p style={{
            color      : '#5C6B5E',
            fontSize   : '16px',
            lineHeight : '1.6',
            marginBottom: '8px',
          }}>
            SuciHome is currently live in
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              {' '}Bengaluru,{' '}
            </span>
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              Mumbai,{' '}
            </span>
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              Visakhapatnam,{' '}
            </span>
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              Hyderabad,{' '}
            </span>
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              Bhopal{' '}
            </span>
            and
            <span style={{
              color      : '#1B4332',
              fontWeight : '600',
            }}>
              {' '}Chennai
            </span>
          </p>

          <p style={{
            color      : '#5C6B5E',
            fontSize   : '15px',
            lineHeight : '1.6',
            marginBottom: '32px',
          }}>
            We are expanding fast and will be
            launching in your city soon.
            Stay connected to get notified first!  🚀
          </p>

          {/* Nearest area info */}
          {locationData?.nearestArea && (
            <div style={{
              background   : '#FFFFFF',
              border       : '1px solid #EDE8DC',
              borderRadius : '12px',
              padding      : '16px',
              marginBottom : '24px',
              boxShadow    : '0 4px 12px rgba(27,67,50,0.04)',
            }}>
              <p style={{
                color   : '#5C6B5E',
                fontSize: '13px',
              }}>
                Nearest service area from you
              </p>
              <p style={{
                color     : '#2D4A35',
                fontWeight: '600',
                fontSize  : '16px',
                margin    : '4px 0',
              }}>
                {locationData.nearestArea.name},
                {' '}{locationData.nearestArea.city}
              </p>
              <p style={{
                color   : '#1B4332',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                ~{locationData.distance} km away
              </p>
            </div>
          )}

          {/* Coming soon cities */}
          <div style={{
            display      : 'flex',
            gap          : '8px',
            flexWrap     : 'wrap',
            justifyContent: 'center',
            marginBottom : '28px',
          }}>
            {[
              'Delhi NCR', 'Pune', 'Kolkata'
            ].map(city => (
              <span key={city} style={{
                background   : 'rgba(27,67,50,0.05)',
                border       : '1px solid rgba(27,67,50,0.1)',
                color        : '#5C6B5E',
                borderRadius : '20px',
                padding      : '4px 12px',
                fontSize     : '13px',
              }}>
                🔒 {city}
              </span>
            ))}
          </div>

          {/* Waitlist WhatsApp button */}
          <a
            href={`https://wa.me/919392420643?text=${
              encodeURIComponent(
                'Hi SuciHome! I want to be notified when you launch in my city. Please add me to the waitlist.'
              )
            }`}
            target="_blank"
            rel="noreferrer"
            style={{
              display        : 'block',
              width          : '100%',
              padding        : '16px',
              background     : '#25D366',
              color          : '#FFFFFF',
              fontWeight     : '700',
              fontSize       : '16px',
              borderRadius   : '14px',
              textDecoration : 'none',
              marginBottom   : '12px',
              boxShadow      : '0 4px 12px rgba(37,211,102,0.2)',
            }}
          >
            💬 Join Waitlist on WhatsApp
          </a>

          {/* Browse website anyway */}
          <button
            onClick={() => setSkipped(true)}
            style={{
              width        : '100%',
              padding      : '14px',
              background   : 'transparent',
              border       : '1px solid rgba(27,67,50,0.15)',
              color        : 'rgba(27,67,50,0.6)',
              fontSize     : '14px',
              borderRadius : '14px',
              cursor       : 'pointer',
            }}
          >
            Browse website anyway →
          </button>

          <style>{`
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(27,67,50,0.3) }
              50%       { box-shadow: 0 0 0 16px rgba(27,67,50,0) }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // ── OUTSIDE INDIA STATE ──
  if (status === 'outside_india' && !skipped) {
    return (
      <div style={{
        minHeight      : '100vh',
        background     : '#F5F0E8',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : '24px',
      }}>
        <div style={{
          maxWidth : '440px',
          width    : '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>
            🌏
          </div>

          <h1 style={{
            color      : '#1B4332',
            fontSize   : '26px',
            fontFamily : 'Instrument Serif, serif',
            marginBottom: '12px',
          }}>
            SuciHome is India-only
            for now!
          </h1>

          <p style={{
            color      : '#5C6B5E',
            fontSize   : '15px',
            lineHeight : '1.6',
            marginBottom: '28px',
          }}>
            We currently operate only within India.
            We're working on expanding globally.
            Stay connected for updates!
          </p>

          <a
            href={`https://wa.me/919392420643?text=${
              encodeURIComponent(
                'Hi SuciHome! I am accessing from outside India. Please notify me when you expand internationally.'
              )
            }`}
            target="_blank"
            rel="noreferrer"
            style={{
              display       : 'block',
              padding       : '14px',
              background    : '#25D366',
              color         : '#FFFFFF',
              fontWeight    : '700',
              borderRadius  : '14px',
              textDecoration: 'none',
              marginBottom  : '12px',
              boxShadow      : '0 4px 12px rgba(37,211,102,0.2)',
            }}
          >
             💬 Get Notified on WhatsApp
          </a>

          <button
            onClick={() => setSkipped(true)}
            style={{
              width       : '100%',
              padding     : '12px',
              background  : 'transparent',
              border      : '1px solid rgba(27,67,50,0.15)',
              color       : 'rgba(27,67,50,0.6)',
              fontSize    : '13px',
              borderRadius: '12px',
              cursor      : 'pointer',
            }}
          >
            Continue browsing →
          </button>
        </div>
      </div>
    )
  }

  // ── LOCATION DENIED STATE ──
  if (status === 'denied' && !skipped) {
    return (
      <div style={{
        minHeight      : '100vh',
        background     : '#F5F0E8',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        padding        : '24px',
      }}>
        <div style={{
          maxWidth : '420px',
          width    : '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>
            🔒
          </div>
          <h2 style={{
            color      : '#1B4332',
            fontSize   : '22px',
            fontFamily : 'Instrument Serif, serif',
            marginBottom: '10px',
          }}>
            Location Access Denied
          </h2>
          <p style={{
            color      : '#5C6B5E',
            fontSize   : '14px',
            lineHeight : '1.6',
            marginBottom: '24px',
          }}>
            We use your location only to check
            service availability. We never store
            or share your location data.
          </p>

          <button
            onClick={checkLocation}
            style={{
              width        : '100%',
              padding      : '14px',
              background   : '#1B4332',
              color        : '#FFFFFF',
              fontWeight   : '700',
              borderRadius : '12px',
              border       : 'none',
              cursor       : 'pointer',
              marginBottom : '10px',
              fontSize     : '15px',
            }}
          >
            📍 Allow Location Access
          </button>

          <button
            onClick={() => setSkipped(true)}
            style={{
              width       : '100%',
              padding     : '12px',
              background  : 'transparent',
              border      : '1px solid rgba(27,67,50,0.15)',
              color       : 'rgba(27,67,50,0.6)',
              fontSize    : '13px',
              borderRadius: '12px',
              cursor      : 'pointer',
            }}
          >
            Select area manually →
          </button>
        </div>
      </div>
    )
  }

  // ── SERVICEABLE or SKIPPED — show children ──
  return <>{children}</>
}