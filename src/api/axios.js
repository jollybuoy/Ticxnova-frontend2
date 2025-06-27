// src/api/axios.js
import axios from "axios";

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production (ticxnova.com)
  if (window.location.hostname === 'ticxnova.com') {
    return 'https://your-backend-domain.azurewebsites.net/api';
  }
  
  // Check for environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginMethod");
      localStorage.removeItem("email");
      localStorage.removeItem("userName");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default API;