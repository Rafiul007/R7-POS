import axios from 'axios';
import { getAccessToken, clearTokens } from '../auth/authStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized
      clearTokens();
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
