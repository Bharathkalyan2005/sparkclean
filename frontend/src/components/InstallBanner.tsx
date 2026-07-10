import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = 
    useState<any>(null)
  const [showBanner, setShowBanner] = 
    useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia(
      '(display-mode: standalone)'
    ).matches) return

    // Check if user dismissed before
    const dismissed = localStorage.getItem(
      'install-banner-dismissed'
    )
    if (dismissed) return

    window.addEventListener(
      'beforeinstallprompt', 
      (e: any) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowBanner(true)
      }
    )
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt
      .userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem(
      'install-banner-dismissed', 
      'true'
    )
  }

  if (!showBanner) return null

  return (
    <div style={{
      position    : 'fixed',
      bottom      : '80px',
      left        : '16px',
      right       : '16px',
      background  : '#FFFFFF',
      borderRadius: '20px',
      padding     : '20px',
      boxShadow   : '0 8px 40px rgba(27,67,50,0.2)',
      border      : '1px solid rgba(27,67,50,0.15)',
      zIndex      : 9998,
      display     : 'flex',
      alignItems  : 'center',
      gap         : '16px',
    }}>
      <img
        src="/logo.png"
        alt="SuciHome"
        style={{ height: '52px', width: 'auto' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{
          color     : '#0D2B1F',
          fontWeight: '700',
          fontSize  : '15px',
          margin    : '0 0 2px',
        }}>
          Install SuciHome App
        </p>
        <p style={{
          color   : '#5C6B5E',
          fontSize: '13px',
          margin  : 0,
        }}>
          Add to home screen for faster booking
        </p>
      </div>
      <div style={{
        display      : 'flex',
        flexDirection: 'column',
        gap          : '8px',
      }}>
        <button
          onClick={handleInstall}
          style={{
            background  : '#1B4332',
            color       : '#FFFFFF',
            border      : 'none',
            borderRadius: '10px',
            padding     : '8px 16px',
            fontWeight  : '700',
            fontSize    : '13px',
            cursor      : 'pointer',
            whiteSpace  : 'nowrap',
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background  : 'transparent',
            color       : '#5C6B5E',
            border      : '1px solid rgba(27,67,50,0.2)',
            borderRadius: '10px',
            padding     : '6px 16px',
            fontSize    : '12px',
            cursor      : 'pointer',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
