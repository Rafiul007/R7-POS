import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  setAccessToken,
  clearTokens,
} from '../auth/authStorage';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// interface RefreshResponse {
//   accessToken: string;
// }

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const response = await axiosInstance.post(
    '/iam/api/auth/refresh',
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const payload = response.data?.data ?? response.data;
  const newAccessToken = payload?.accessToken;

  if (!newAccessToken || typeof newAccessToken !== 'string') {
    throw new Error('Invalid refresh response');
  }

  return newAccessToken;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? '';
    const isRefreshRequest = requestUrl.includes('/iam/api/auth/refresh');

    if (status !== 401 || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();

      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
