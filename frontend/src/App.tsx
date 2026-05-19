import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster, toast } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import TrackingPage from './pages/TrackingPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminRoute from './components/AdminRoute';
import LocationGate from './components/LocationGate';
// @ts-ignore
import './index.css';

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
    <GoogleOAuthProvider clientId="134114111752-ottgrphnli54187mcahlt07v7bru5ktc.apps.googleusercontent.com">
      <Router>
        <CartProvider>
        <LoadingScreen />
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
                  const token = localStorage.getItem('sparkclean_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
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
      </CartProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
