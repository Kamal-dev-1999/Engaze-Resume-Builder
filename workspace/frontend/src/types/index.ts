export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Resume {
  id: number;
  title: string;
  template_name: string;
  share_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeDetail extends Resume {
  sections: Section[];
  style: Style;
}

export interface Style {
  id: number;
  primary_color: string;
  font_family: string;
  font_size: number;
}

export interface Section {
  id: number;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'summary' | 'contact' | 'custom';
  content: any;
  order: number;
}

export interface ExperienceContent {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  description: string;
}

export interface EducationContent {
  degree: string;
  field: string;
  institution: string;
  location: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface SkillsContent {
  skills: string[];
}

export interface DashboardState {
  resumes: Resume[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}