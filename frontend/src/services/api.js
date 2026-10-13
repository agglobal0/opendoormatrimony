import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api')
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tod_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if trying to login or register
      const url = error.config.url;
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('tod_token');
        localStorage.removeItem('tod_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
