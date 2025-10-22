import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

// Determine API base URL based on environment
const getBaseURL = () => {
  // Get API base URL from environment or use Render backend
  const apiUrl = import.meta.env.VITE_API_BASE_URL 
  || 'http://31.97.111.127:8000/api/'
                //  'https://engaze-resume-builder.onrender.com/api/';
  
  // Ensure it ends with /api/ for proper routing
  return apiUrl.endsWith('/api/') ? apiUrl : `${apiUrl}/api/`;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials not needed for JWT auth (tokens sent in Authorization header)
  // Keeping it off to avoid CORS issues across different devices
});

// Request interceptor for adding token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Auth token added to request (log removed for security)
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API response error:', error);

    // If there's no response, it could be a network error
    if (!error.response) {
      console.error('No response from server, might be a network issue');
      return Promise.reject(new Error('Network error: Unable to connect to the server'));
    }

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
        
        // Use the configured api client for token refresh (respects CORS settings)
        const response = await api.post('auth/token/refresh/', {
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
  checkAuth: async (): Promise<boolean> => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      // Make a request to an endpoint that requires auth
      await api.get('resumes/');
      return true;
    } catch (error: any) {
      console.error('Auth check failed:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Clear tokens on auth failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return false;
      }
      // If it's another type of error, consider auth still valid
      return true;
    }
  },
  
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/token/', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterCredentials): Promise<void> => {
    await api.post('auth/register/', userData);
  },
  
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${getBaseURL()}auth/token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('auth/user/');
    return response.data;
  },
  
  updateProfile: async (data: { first_name?: string; last_name?: string; email?: string }) => {
    const response = await api.patch('auth/user/', data);
    return response.data;
  },
  
  changePassword: async (data: { old_password: string; new_password: string }) => {
    const response = await api.post('auth/change-password/', data);
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
    try {
      console.log('API getResumes called');
      // Auth check performed (log removed for security)
      
      // Check token first
      if (!localStorage.getItem('access_token')) {
        console.warn('No auth token found in localStorage');
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const response = await api.get('resumes/');
      console.log('API getResumes success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API getResumes error:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // If unauthorized, clear tokens
        if (error.response.status === 401 || error.response.status === 403) {
          console.warn('Authentication error, clearing tokens');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Create a more descriptive error
          throw new Error('Authentication expired. Please log in again.');
        }
      }
      
      throw error;
    }
  },
  
  getResume: async (id: number) => {
    console.log('API getResume called for ID:', id);
    try {
      const response = await api.get(`resumes/${id}/`);
      console.log('API getResume success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API getResume error:', error);
      // Create a more readable error message
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to fetch resume details';
      
      // Convert object errors to strings
      const enhancedError = new Error(typeof errorMessage === 'object' 
        ? JSON.stringify(errorMessage)
        : errorMessage);
        
      throw enhancedError;
    }
  },
  
  updateSection: async (resumeId: number, section: any) => {
    console.log('API updateSection called:', { resumeId, section });
    
    // Prepare the data to send - only send the fields that should be updated
    const dataToSend = {
      type: section.type,
      content: section.content,
      order: section.order
    };
    
    console.log('Data to send to backend:', dataToSend);
    
    try {
      const response = await api.patch(`sections/${section.id}/`, dataToSend);
      console.log('API updateSection success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API updateSection error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
  
  reorderSections: async (resumeId: number, sectionIds: number[]) => {
    console.log('API reorderSections called:', { resumeId, sectionIds });
    try {
      // Since there's no specific endpoint for reordering, update each section individually
      const updates = sectionIds.map((sectionId, index) => {
        return api.patch(`sections/${sectionId}/`, { order: index });
      });
      
      const results = await Promise.all(updates);
      console.log('API reorderSections success response:', results.map(r => r.data));
      return { success: true, sections: results.map(r => r.data) };
    } catch (error: any) {
      console.error('API reorderSections error:', error);
      // Create a more readable error message
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to reorder sections';
      
      // Convert object errors to strings
      const enhancedError = new Error(typeof errorMessage === 'object' 
        ? JSON.stringify(errorMessage)
        : errorMessage);
        
      throw enhancedError;
    }
  },
  
  addSection: async (resumeId: number, sectionType: string) => {
    console.log('API addSection called:', { resumeId, sectionType });
    try {
      // Prepare empty content structure based on section type
      const contentStructure: any = { type: sectionType };
      
      switch (sectionType) {
        case 'contact':
          contentStructure.content = {
            email: '',
            phone: '',
            address: '',
            name: '',
            title: '',
            linkedin: '',
            website: '',
            location: ''
          };
          break;
        case 'summary':
          contentStructure.content = { text: '' };
          break;
        case 'experience':
          contentStructure.content = { items: [] };
          break;
        case 'education':
          contentStructure.content = { items: [] };
          break;
        case 'skills':
          contentStructure.content = { items: [] };
          break;
        case 'projects':
          contentStructure.content = { items: [] };
          break;
        case 'languages':
          contentStructure.content = { items: [] };
          break;
        case 'custom':
          contentStructure.content = { title: '', content: '', text: '' };
          break;
        default:
          contentStructure.content = {};
      }
      
      // Try to call the real API endpoint with content
      try {
        const response = await api.post(`resumes/${resumeId}/sections/`, contentStructure);
        console.log('API addSection success response:', response.data);
        return response.data;
      } catch (apiError: any) {
        console.warn('API endpoint not available, using mock implementation:', apiError);
        
        // If this is a real API error with data.detail, propagate it
        if (apiError.response?.data?.detail) {
          const errorMessage = apiError.response.data.detail;
          const enhancedError = new Error(typeof errorMessage === 'object' 
            ? JSON.stringify(errorMessage)
            : errorMessage);
          throw enhancedError;
        }
        
        // Mock implementation for development - this creates a temporary section
        // that will work until you refresh the page
        const mockSection = {
          id: Math.floor(Math.random() * 10000) + 1000, // Generate a random ID
          type: sectionType,
          order: 1000, // Will be placed at the end
          content: {} // Empty content to be filled in later
        };
        
        // For different section types, provide empty default content (NOT placeholders)
        switch (sectionType) {
          case 'contact':
            mockSection.content = {
              email: '',
              phone: '',
              address: '',
              name: '',
              title: '',
              linkedin: '',
              website: '',
              location: ''
            };
            break;
          case 'summary':
            mockSection.content = {
              text: ''
            };
            break;
          case 'experience':
            mockSection.content = {
              items: []
            };
            break;
          case 'education':
            mockSection.content = {
              items: []
            };
            break;
          case 'skills':
            mockSection.content = {
              items: []
            };
            break;
          case 'projects':
            mockSection.content = {
              items: []
            };
            break;
          case 'languages':
            mockSection.content = {
              items: []
            };
            break;
          case 'custom':
            mockSection.content = {
              title: '',
              content: '',
              text: ''
            };
            break;
        }
        
        console.log('Created mock section:', mockSection);
        return mockSection;
      }
    } catch (error) {
      console.error('API addSection error:', error);
      throw error;
    }
  },
  
  createResume: async (data: { title: string; template_name: string }) => {
    console.log('API createResume called with:', data);
    try {
      const response = await api.post('resumes/', data);
      console.log('API createResume success response:', response.data);
      
      // Validate response data has expected structure
      if (!response.data || !response.data.id) {
        console.error('Invalid resume data returned from API:', response.data);
        throw new Error('Invalid response format: missing resume ID');
      }
      
      return response.data;
    } catch (error) {
      console.error('API createResume error:', error);
      throw error; // Re-throw to be handled by the thunk
    }
  },
  
  updateResume: async (id: number, data: { title?: string; template_name?: string }) => {
    const response = await api.patch(`resumes/${id}/`, data);
    return response.data;
  },
  
  deleteResume: async (id: number) => {
    await api.delete(`resumes/${id}/`);
  },
  
  deleteSection: async (sectionId: number) => {
    console.log('API deleteSection called:', { sectionId });
    try {
      await api.delete(`sections/${sectionId}/`);
      console.log('API deleteSection success');
    } catch (error: any) {
      console.error('API deleteSection error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to delete section';
      
      const enhancedError = new Error(typeof errorMessage === 'object' 
        ? JSON.stringify(errorMessage)
        : errorMessage);
        
      throw enhancedError;
    }
  },
  
  shareResume: async (id: number) => {
    const response = await api.post(`resumes/${id}/share/`);
    return response.data;
  },
};

export default api;