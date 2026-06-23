import axios from 'axios';
import { getCookie, deleteCookie } from './cookies';

// Backend Base URL as specified
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-travel-planner-wq37.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from cookie into every protected request
api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Catch token expiration/unauthorized errors (401) and handle them globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      deleteCookie('token');
      deleteCookie('user');
      // Dispatch a custom event to notify components to redirect or reload
      window.dispatchEvent(new Event('auth-clear'));
    }
    return Promise.reject(error);
  }
);

export default api;
