// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

// Resume Types
export interface Resume {
  id: number;
  title: string;
  user: number;
  created_at: string;
  updated_at: string;
  template_name: string;
  share_slug?: string;
}

export interface Section {
  id: number;
  resume: number;
  section_type: string;
  content: Record<string, any>;
  order: number;
}

export interface Style {
  id: number;
  resume: number;
  style_data: Record<string, any>;
}

export interface DashboardState {
  resumes: Resume[];
  isLoading: boolean;
  error: string | null;
}

export interface EditorState {
  resume: Resume | null;
  sections: Section[];
  style: Style | null;
  isLoading: boolean;
  error: string | null;
}

// Form types for resume creation/editing
export interface NewResumeFormData {
  title: string;
  template_name: string;
}

export interface SectionFormData {
  section_type: string;
  content: Record<string, any>;
  order?: number;
}

export interface StyleFormData {
  style_data: Record<string, any>;
}