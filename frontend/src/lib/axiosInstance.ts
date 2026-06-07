import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://sparkclean-x3ze.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auto-inject token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sucihome_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Token attached:', !!token);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized — clearing token');
      localStorage.removeItem('sucihome_token');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;