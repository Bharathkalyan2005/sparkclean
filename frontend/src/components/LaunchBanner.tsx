import { useState, useEffect } from 'react'

export default function LaunchBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('vizag_launch_banner_dismissed') === 'true'
    if (!dismissed) {
      setVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('vizag_launch_banner_dismissed', 'true')
    setVisible(false)
    window.dispatchEvent(new Event('launchBannerClosed'))
  }

  if (!visible) return null

  return (
    <div style={{
      background     : 'linear-gradient(90deg, #0AFFE6, #088C7A)',
      color          : '#000000',
      textAlign      : 'center',
      padding        : '10px 16px',
      fontSize       : '13px',
      fontWeight     : '700',
      position       : 'fixed',
      top            : 0,
      left           : 0,
      right          : 0,
      height         : '38px',
      zIndex         : 9999,
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      gap            : '8px',
      boxSizing      : 'border-box',
    }}>
      🎉 SuciHome is NOW LIVE in Visakhapatnam (Vizag)! Book your first clean today →
      <a
        href="/book"
        style={{
          background   : '#000000',
          color        : '#0AFFE6',
          padding      : '4px 12px',
          borderRadius : '20px',
          textDecoration: 'none',
          fontSize     : '12px',
          fontWeight   : '700',
        }}
      >
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
          cursor    : 'pointer',
          fontSize  : '16px',
          color     : '#000',
          fontWeight: '700',
        }}
      >
        ×
      </button>
    </div>
  )
}
