import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import type { AuthState, LoginCredentials, RegisterCredentials, User, AuthResponse } from '../../types';

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null
};

// Async thunks
export const login = createAsyncThunk<
  AuthResponse, 
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      await authAPI.register(userData);
      // After registration, login automatically
      const loginResponse = await authAPI.login({
        username: userData.username,
        password: userData.password
      });
      localStorage.setItem('access_token', loginResponse.access);
      localStorage.setItem('refresh_token', loginResponse.refresh);
      return loginResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  { state: { auth: AuthState }, rejectValue: string }
>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Attempting to refresh token (logs removed for security)
      const state = getState();
      const refreshTokenValue = state.auth.refreshToken;
      
      if (!refreshTokenValue) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await authAPI.refreshToken(refreshTokenValue);
      localStorage.setItem('access_token', response.access);
      return response;
    } catch (error: any) {
      // If refresh fails, log the user out
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return rejectWithValue(error.response?.data?.detail || 'Session expired');
    }
  }
);

export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user profile');
    }
  }
);

export const logout = createAsyncThunk<
  null,
  void
>(
  'auth/logout',
  async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    authAPI.logout();
    return null;
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearAuthError: (state: AuthState) => {
      state.error = null;
    }
  },
  extraReducers: (builder: any) => {
    // Login cases
    builder.addCase(login.pending, (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
    
    // Register cases
    builder.addCase(register.pending, (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
    });
    builder.addCase(register.rejected, (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
    
    // Refresh token cases
    builder.addCase(refreshToken.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(refreshToken.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.accessToken = action.payload.access;
      state.isAuthenticated = true;
    });
    builder.addCase(refreshToken.rejected, (state: AuthState) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
    
    // Get user profile cases
    builder.addCase(getUserProfile.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(getUserProfile.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state: AuthState) => {
      state.isLoading = false;
    });
    
    // Logout case
    builder.addCase(logout.fulfilled, (state: AuthState) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  }
});

export const { setUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;