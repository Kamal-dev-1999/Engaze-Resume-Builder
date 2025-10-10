import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './utils/hooks';
import { refreshToken } from './redux/slices/authSlice';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import SharePage from './pages/SharePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth as { isAuthenticated: boolean; isLoading: boolean });
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// These components are now imported from their respective files

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Try to refresh token on app load
    dispatch(refreshToken() as any);
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/share/:shareSlug" element={<SharePage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/editor/:resumeId" element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
