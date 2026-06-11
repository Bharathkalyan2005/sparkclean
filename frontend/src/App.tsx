import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster, toast } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import LoadingScreen from './components/LoadingScreen';
import LocationGate from './components/LocationGate';
import LaunchBanner from './components/LaunchBanner';
import ErrorBoundary from './components/ErrorBoundary';
import PageSkeleton from './components/PageSkeleton';
// @ts-ignore
import './index.css';

// Lazy load all pages
const HomePage         = lazy(() => import('./pages/HomePage'));
const BookingPage      = lazy(() => import('./pages/BookingPage'));
const SuccessPage      = lazy(() => import('./pages/SuccessPage'));
const AdminPage        = lazy(() => import('./pages/AdminPage'));
const AuthPage         = lazy(() => import('./pages/AuthPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const TrackingPage     = lazy(() => import('./pages/TrackingPage'));
const FeedbackPage     = lazy(() => import('./pages/FeedbackPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));
const HealthPage       = lazy(() => import('./pages/HealthPage'));

// Admin route wrapper
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('sparkclean_token') 
    || localStorage.getItem('sucihome_token') 
    || localStorage.getItem('token') 
    || localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.role !== 'ADMIN') {
      toast.error('Admin access required');
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  } catch {
    return <Navigate to="/auth" replace />;
  }
};

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
              background: '#FFFFFF',
              color: '#2D4A35',
              border: '1px solid #EDE8DC',
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(27, 67, 50, 0.08)',
            },
            success: {
              iconTheme: { primary: '#1B4332', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#C62828', secondary: '#FFFFFF' },
            },
          }}
        />
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/book" element={
              <LocationGate isAdmin={
                (() => {
                  try {
                    const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('sucihome_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
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
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/*" element={
              <RequireAdmin>
                <AdminPage />
              </RequireAdmin>
            } />
            <Route path="/sparkadmin/*" element={
              <RequireAdmin>
                <AdminPage />
              </RequireAdmin>
            } />
          </Routes>
        </Suspense>
      </CartProvider>
      </Router>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
