import "leaflet/dist/leaflet.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import L from 'leaflet';

if (process.env.NODE_ENV === 'production') {
  console.log  = () => {}
  console.warn = () => {}
  // Keep console.error for debugging
}

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Wake Render backend immediately
const API = process.env.REACT_APP_API_URL 
  || 'https://sparkclean-x3ze.onrender.com';

fetch(`${API}/api/health`, { 
  method: 'GET',
  cache : 'no-store' 
}).catch(() => {
  // Retry after 3 seconds
  setTimeout(() => {
    fetch(`${API}/api/health`).catch(() => {})
  }, 3000)
});

// Then render app normally
ReactDOM.createRoot(
  document.getElementById('root')!
).render(<App />)

reportWebVitals();
