import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const name  = searchParams.get('name')
    const error = searchParams.get('error')

    if (error) {
      navigate('/auth?error=Google login failed')
      return
    }

    if (token) {
      // Save token to localStorage
      localStorage.setItem('sparkclean_token', token)
      if (name) localStorage.setItem('sparkclean_name', name)

      // Redirect to home or booking
      navigate('/')
    }
  }, [navigate, searchParams])

  return (
    <div style={{
      minHeight      : '100vh',
      background     : '#0A0A0A',
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      flexDirection  : 'column',
      gap            : '16px',
    }}>
      {/* Teal spinning loader */}
      <svg 
        width="48" height="48" 
        viewBox="0 0 48 48"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle
          cx="24" cy="24" r="20"
          fill="none" stroke="#0AFFE6"
          strokeWidth="4"
          strokeDasharray="80 40"
        />
      </svg>
      <p style={{ 
        color      : '#A0A0A0', 
        fontFamily : 'Inter, sans-serif',
        fontSize   : '15px'
      }}>
        Signing you in with Google...
      </p>
      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg) } 
          to   { transform: rotate(360deg) } 
        }
      `}</style>
    </div>
  )
}
