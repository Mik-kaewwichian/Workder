import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Access Expo's environment variable for the API base URL
// Dev value could be http://192.168.x.x:4001
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Interceptor to attach Authorization Token from Zustand Store
apiClient.interceptors.request.use(
  (config) => {
    // Get token directly from the Zustand store's state
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token is invalid/expired, log out the user
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
