import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL 
  || 'https://sparkclean-x3ze.onrender.com';

console.log('API URL:', BASE_URL); // Debug

const api = axios.create({
  baseURL : BASE_URL,
  timeout : 30000, // 30 second timeout
  headers : { 'Content-Type': 'application/json' },
});

// Auto attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sparkclean_token')
    || localStorage.getItem('sucihome_token')
    || localStorage.getItem('token')
    || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle all errors
api.interceptors.response.use(
  response => response,
  error => {
    const status  = error.response?.status;
    const message = error.response?.data?.error 
                 || error.response?.data?.message
                 || error.message;

    console.error('API Error:', status, message);

    if (status === 401) {
      localStorage.removeItem('sparkclean_token');
      localStorage.removeItem('sucihome_token');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }

    if (status === 500) {
      console.error('Server error:', message);
    }

    if (!error.response) {
      // Network error = server sleeping
      console.warn('Network error - server may be sleeping');
    }

    return Promise.reject(error);
  }
);

export default api;