import "leaflet/dist/leaflet.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import L from 'leaflet';
import { wakeUpServer } from './lib/serverWakeUp';

if (process.env.NODE_ENV === 'production') {
  console.log  = () => {}
  console.warn = () => {}
  // Keep console.error for debugging
}

// Wake server before React even renders
wakeUpServer().then(ok => {
  console.log('Server status:', ok ? 'online' : 'waking up')
})

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
