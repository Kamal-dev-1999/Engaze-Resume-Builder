import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../../services/api';
import type { DashboardState } from '../../types';

// Initial state
const initialState: DashboardState = {
  resumes: [],
  isLoading: false,
  error: null
};

// Async thunks
export const fetchResumes = createAsyncThunk(
  'dashboard/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching resumes from API...');
      const resumes = await resumeAPI.getResumes();
      console.log('Fetched resumes successfully:', resumes);
      return resumes;
    } catch (error: any) {
      console.error('Error fetching resumes:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      return rejectWithValue(error.response?.data || 'Failed to fetch resumes');
    }
  }
);

export const createResume = createAsyncThunk(
  'dashboard/createResume',
  async (data: { title: string; template_name: string }, { rejectWithValue }) => {
    try {
      console.log('createResume thunk called with data:', data);
      const newResume = await resumeAPI.createResume(data);
      console.log('API returned new resume:', newResume);
      return newResume;
    } catch (error: any) {
      console.error('Error in createResume thunk:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      return rejectWithValue(error.response?.data || 'Failed to create resume');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'dashboard/deleteResume',
  async (id: number, { rejectWithValue }) => {
    try {
      await resumeAPI.deleteResume(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete resume');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch resumes cases
    builder.addCase(fetchResumes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchResumes.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Handle paginated API response format
      if (action.payload && typeof action.payload === 'object') {
        // Check if this is a Django REST Framework paginated response
        if (action.payload.results && Array.isArray(action.payload.results)) {
          // If we have paginated response with results field
          state.resumes = action.payload.results;
        } else if (Array.isArray(action.payload)) {
          // Direct array response
          state.resumes = action.payload;
        } else {
          // Fallback
          state.resumes = [];
        }
      } else {
        state.resumes = [];
      }
    });
    builder.addCase(fetchResumes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create resume cases
    builder.addCase(createResume.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createResume.fulfilled, (state, action) => {
      state.isLoading = false;
      // Make sure action.payload exists and has expected structure
      if (action.payload && typeof action.payload === 'object') {
        // Ensure state.resumes is an array before using array methods
        if (!Array.isArray(state.resumes)) {
          state.resumes = [];
        }
        
        // Add to resumes if not already present
        const exists = state.resumes.some(resume => resume && resume.id === action.payload.id);
        if (!exists) {
          state.resumes.push(action.payload);
        }
      }
    });
    builder.addCase(createResume.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete resume cases
    builder.addCase(deleteResume.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteResume.fulfilled, (state, action) => {
      state.isLoading = false;
      // Ensure state.resumes is an array before using array methods
      if (Array.isArray(state.resumes)) {
        state.resumes = state.resumes.filter(resume => resume && resume.id !== action.payload);
      }
    });
    builder.addCase(deleteResume.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;