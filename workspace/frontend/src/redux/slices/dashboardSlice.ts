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
      const resumes = await resumeAPI.getResumes();
      return resumes;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch resumes');
    }
  }
);

export const createResume = createAsyncThunk(
  'dashboard/createResume',
  async (data: { title: string; template_name: string }, { rejectWithValue }) => {
    try {
      const newResume = await resumeAPI.createResume(data);
      return newResume;
    } catch (error: any) {
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
      state.resumes = action.payload;
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
      state.resumes.push(action.payload);
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
      state.resumes = state.resumes.filter(resume => resume.id !== action.payload);
    });
    builder.addCase(deleteResume.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;