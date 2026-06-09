import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster, toast } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import LoadingScreen from './components/LoadingScreen';
import AdminRoute from './components/AdminRoute';
import LocationGate from './components/LocationGate';
import LaunchBanner from './components/LaunchBanner';
import ErrorBoundary from './components/ErrorBoundary';
// @ts-ignore
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));

// Simple fallback — black screen
const Loader = () => (
  <div style={{
    minHeight  : '100vh',
    background : '#0A0A0A',
    display    : 'flex',
    alignItems : 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width     : '40px',
      height    : '40px',
      border    : '3px solid rgba(10,255,230,0.2)',
      borderTop : '3px solid #0AFFE6',
      borderRadius: '50%',
      animation : 'spin 1s linear infinite',
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg) }
      }
    `}</style>
  </div>
)

function App() {
  useEffect(() => {
    // Only ask if we haven't stored their location yet
    if (!localStorage.getItem('userCity')) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Using Photon API to get city name from coordinates
              const res = await fetch(`https://photon.komoot.io/reverse?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
              if (res.ok) {
                const data = await res.json();
                const city = data?.features?.[0]?.properties?.city || data?.features?.[0]?.properties?.state;
                if (city) {
                  localStorage.setItem('userCity', city);
                  toast.success(`Location set to: ${city}`);
                  window.dispatchEvent(new Event('cityUpdated'));
                }
              }
            } catch (err) {
              console.error("Failed to detect city", err);
            }
          },
          (error) => {
            console.log("Geolocation error:", error);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="134114111752-ottgrphnli54187mcahlt07v7bru5ktc.apps.googleusercontent.com">
      <Router>
        <CartProvider>
        <LoadingScreen />
        <LaunchBanner />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0D1D3E',
              color: '#fff',
              border: '1px solid rgba(10, 255, 230, 0.2)',
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#0AFFE6', secondary: '#0A1628' },
            },
            error: {
              iconTheme: { primary: '#FF6B6B', secondary: '#fff' },
            },
          }}
        />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/book" element={
              <LocationGate isAdmin={
                (() => {
                  try {
                    const token = localStorage.getItem('sucihome_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
                    if (!token) return false;
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    return decoded.role === 'ADMIN';
                  } catch { return false; }
                })()
              }>
                <BookingPage />
              </LocationGate>
            } />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/admin" element={<Navigate to="/sparkadmin" replace />} />
            <Route path="/sparkadmin/*" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }/>
          </Routes>
        </Suspense>
      </CartProvider>
      </Router>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
