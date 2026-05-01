import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import TrackingPage from './pages/TrackingPage';
// @ts-ignore
import './index.css';

function App() {
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
          <Route path="/book" element={<BookingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/sparkadmin" element={<AdminPage />} />
        </Routes>
      </CartProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
