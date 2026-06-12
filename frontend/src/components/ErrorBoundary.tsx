import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: any; errorInfo: any }
> {
  state = { hasError: false, error: null as any, errorInfo: null as any }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('=== APP CRASH ===')
    console.error('Error:', error)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('Component Stack:', errorInfo.componentStack)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#F5F0E8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}>
          <h2 style={{ color: '#1B4332' }}>
            Something went wrong
          </h2>

          {/* TEMPORARY - shows the real error */}
          <pre style={{
            color: '#DC2626',
            fontSize: '12px',
            background: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '600px',
            overflow: 'auto',
            textAlign: 'left',
            marginTop: '16px',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {(this.state.errorInfo as any)?.componentStack}
          </pre>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '14px 32px',
              background: '#1B4332',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

