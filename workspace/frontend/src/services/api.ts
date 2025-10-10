import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
          refresh: refreshToken,
        });
        
        localStorage.setItem('access_token', response.data.access);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/token/', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterCredentials): Promise<void> => {
    await api.post('auth/register/', userData);
  },
  
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('http://localhost:8000/api/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('auth/user/');
    return response.data;
  },
  
  logout: (): void => {
    // We don't need to call an API endpoint for logout as we're using JWT
    // Just remove the tokens from localStorage
  },
};

// Resume API calls
export const resumeAPI = {
  getResumes: async () => {
    const response = await api.get('resumes/');
    return response.data;
  },
  
  getResume: async (id: number) => {
    const response = await api.get(`resumes/${id}/`);
    return response.data;
  },
  
  createResume: async (data: { title: string; template_name: string }) => {
    const response = await api.post('resumes/', data);
    return response.data;
  },
  
  updateResume: async (id: number, data: { title?: string; template_name?: string }) => {
    const response = await api.patch(`resumes/${id}/`, data);
    return response.data;
  },
  
  deleteResume: async (id: number) => {
    await api.delete(`resumes/${id}/`);
  },
  
  shareResume: async (id: number) => {
    const response = await api.post(`resumes/${id}/share/`);
    return response.data;
  },
};

export default api;