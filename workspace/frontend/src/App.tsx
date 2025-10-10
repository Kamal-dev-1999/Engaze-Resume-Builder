import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './utils/hooks';
import { refreshToken } from './redux/slices/authSlice';
import ErrorBoundary from './components/ErrorBoundary';
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
    // Try to refresh token on app mount (logs removed for security)
    dispatch(refreshToken())
      .catch(error => console.error('Token refresh failed:', error));
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
            <ErrorBoundary fallback={
              <div className="p-6 bg-red-50 rounded-lg">
                <h2 className="text-xl font-bold text-red-700">Dashboard Error</h2>
                <p className="text-red-600 mb-3">We encountered an error loading the dashboard.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
                  Reload Page
                </button>
              </div>
            }>
              <DashboardPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/editor/:resumeId" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <EditorPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
