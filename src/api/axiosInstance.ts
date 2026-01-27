import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Adjust base URL as needed
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
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
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
