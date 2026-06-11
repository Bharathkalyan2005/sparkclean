import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: any }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight      : '100vh',
          background     : '#F5F0E8',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'center',
          flexDirection  : 'column',
          gap            : '16px',
          fontFamily     : 'Inter, sans-serif',
          padding        : '24px',
          textAlign      : 'center',
        }}>
          <span style={{ fontSize: '48px' }}>⚠️</span>
          <h2 style={{
            color     : '#1B4332',
            fontSize  : '24px',
            fontFamily: 'Instrument Serif, serif',
          }}>
            Something went wrong
          </h2>
          <p style={{ color: '#5C6B5E', fontSize: '15px' }}>
            Please refresh the page or contact support
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding      : '12px 28px',
              background   : '#1B4332',
              color        : '#FFFFFF',
              fontWeight   : '700',
              borderRadius : '12px',
              border       : 'none',
              cursor       : 'pointer',
              fontSize     : '15px',
            }}
          >
            Refresh Page
          </button>
          <a
            href={`https://wa.me/919392420643?text=Hi SuciHome! The website has an error.`}
            style={{
              color         : '#1B4332',
              fontSize      : '14px',
              textDecoration: 'none',
              fontWeight    : '600'
            }}
          >
            💬 Contact Support
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
