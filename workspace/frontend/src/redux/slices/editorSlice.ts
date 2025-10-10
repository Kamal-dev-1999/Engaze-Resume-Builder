import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../../services/api';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface Style {
  id: number;
  primary_color: string;
  font_family: string;
  font_size: number;
}

interface ResumeDetail {
  id: number;
  title: string;
  template_name: string;
  share_slug?: string;
  created_at: string;
  updated_at: string;
  sections: Section[];
  style: Style;
}

interface EditorState {
  resumeDetail: ResumeDetail | null;
  isLoading: boolean;
  error: string | Record<string, string> | null;
  isDirty: boolean; // tracks if there are unsaved changes
}

const initialState: EditorState = {
  resumeDetail: null,
  isLoading: false,
  error: null,
  isDirty: false
};

// Async thunks
export const fetchResumeDetail = createAsyncThunk(
  'editor/fetchResumeDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const resumeDetail = await resumeAPI.getResume(id);
      return resumeDetail;
    } catch (error: any) {
      console.error('Error fetching resume details:', error);
      return rejectWithValue(
        error.response?.data || 
        error.message || 
        'Failed to fetch resume details'
      );
    }
  }
);

export const updateResumeSection = createAsyncThunk(
  'editor/updateResumeSection',
  async ({ resumeId, section }: { resumeId: number; section: Section }, { rejectWithValue }) => {
    try {
      // Assuming you have an API endpoint to update a specific section
      const updatedSection = await resumeAPI.updateSection(resumeId, section);
      return updatedSection;
    } catch (error: any) {
      console.error('Error updating section:', error);
      return rejectWithValue(
        error.response?.data || 
        error.message || 
        'Failed to update section'
      );
    }
  }
);

export const reorderSections = createAsyncThunk(
  'editor/reorderSections',
  async ({ resumeId, sectionIds }: { resumeId: number; sectionIds: number[] }, { rejectWithValue }) => {
    try {
      // Assuming you have an API endpoint to reorder sections
      const updatedOrder = await resumeAPI.reorderSections(resumeId, sectionIds);
      return updatedOrder;
    } catch (error: any) {
      console.error('Error reordering sections:', error);
      return rejectWithValue(
        error.response?.data || 
        error.message || 
        'Failed to reorder sections'
      );
    }
  }
);

export const addSection = createAsyncThunk(
  'editor/addSection',
  async ({ resumeId, sectionType }: { resumeId: number; sectionType: string }, { rejectWithValue }) => {
    try {
      const newSection = await resumeAPI.addSection(resumeId, sectionType);
      return newSection;
    } catch (error: any) {
      console.error('Error adding section:', error);
      return rejectWithValue(
        error.response?.data || 
        error.message || 
        'Failed to add section'
      );
    }
  }
);

// Editor slice
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    clearEditorError: (state) => {
      state.error = null;
    },
    updateSectionLocally: (state, action) => {
      if (state.resumeDetail?.sections) {
        const index = state.resumeDetail.sections.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.resumeDetail.sections[index] = {
            ...state.resumeDetail.sections[index],
            ...action.payload
          };
          state.isDirty = true;
        }
      }
    },
    reorderSectionsLocally: (state, action) => {
      if (state.resumeDetail?.sections) {
        // Create a mapping of id to section
        const sectionMap = new Map();
        state.resumeDetail.sections.forEach(section => {
          sectionMap.set(section.id, section);
        });
        
        // Reorder sections based on the new order of IDs
        const newSections = action.payload.map((id: number) => sectionMap.get(id));
        
        // Update order property for each section
        newSections.forEach((section: Section, index: number) => {
          section.order = index;
        });
        
        state.resumeDetail.sections = newSections;
        state.isDirty = true;
      }
    },
    addSectionLocally: (state, action) => {
      if (state.resumeDetail?.sections) {
        state.resumeDetail.sections.push(action.payload);
        state.isDirty = true;
      }
    },
    removeSectionLocally: (state, action) => {
      if (state.resumeDetail?.sections) {
        state.resumeDetail.sections = state.resumeDetail.sections.filter(
          section => section.id !== action.payload
        );
        state.isDirty = true;
      }
    },
    resetDirtyState: (state) => {
      state.isDirty = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch resume detail cases
    builder.addCase(fetchResumeDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchResumeDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.resumeDetail = action.payload;
      state.isDirty = false;
    });
    builder.addCase(fetchResumeDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update section cases
    builder.addCase(updateResumeSection.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateResumeSection.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.resumeDetail?.sections) {
        const index = state.resumeDetail.sections.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.resumeDetail.sections[index] = action.payload;
        }
      }
      state.isDirty = false;
    });
    builder.addCase(updateResumeSection.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Reorder sections cases
    builder.addCase(reorderSections.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(reorderSections.fulfilled, (state) => {
      state.isLoading = false;
      state.isDirty = false;
    });
    builder.addCase(reorderSections.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Add section cases
    builder.addCase(addSection.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addSection.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.resumeDetail?.sections) {
        state.resumeDetail.sections.push(action.payload);
      }
      state.isDirty = false;
    });
    builder.addCase(addSection.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { 
  clearEditorError, 
  updateSectionLocally,
  reorderSectionsLocally,
  addSectionLocally,
  removeSectionLocally,
  resetDirtyState
} = editorSlice.actions;

export default editorSlice.reducer;