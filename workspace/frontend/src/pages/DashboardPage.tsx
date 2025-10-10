import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchResumes, createResume, deleteResume } from '../redux/slices/dashboardSlice';
import { logout } from '../redux/slices/authSlice';
// Import components without file extensions
import Navbar from '../components/Navbar';
import ResumeCard from '../components/ResumeCard';
import NewResumeModal from '../components/NewResumeModal';
import { authAPI } from '../services/api';

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resumes, isLoading, error } = useAppSelector(state => state.dashboard as { resumes: any[]; isLoading: boolean; error: string | null });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DashboardPage mounted, fetching resumes...');
    
    // Check if user is authenticated
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Authentication check (tokens logging removed for security)
    
    // If no tokens, redirect to login
    if (!accessToken && !refreshToken) {
      console.warn('No authentication tokens found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Verify authentication by checking if token is valid
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await authAPI.checkAuth();
        
        if (!isAuthenticated) {
          console.warn('Authentication check failed, redirecting to login');
          navigate('/login');
          return;
        }
        
        // If authenticated, fetch resumes
        try {
          const result = await dispatch(fetchResumes()).unwrap();
          console.log('Fetch resumes successful:', result);
          if (!result || !Array.isArray(result) || result.length === 0) {
            console.log('No resumes found in response');
          }
        } catch (error: any) {
          console.error('Fetch resumes failed:', error);
          // If authentication error, redirect to login
          if (typeof error === 'string' && 
              (error.includes('Authentication expired') || 
               error.includes('Authentication token is missing'))) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };
    
    checkAuthentication();
  }, [dispatch, navigate]);

  const handleCreateResume = async (data: { title: string; template_name: string }) => {
    console.log('Creating resume with data:', data);
    try {
      // Close modal first to avoid state issues
      setIsModalOpen(false);
      
      // Dispatch the action and await unwrapped result (this throws on rejection)
      const newResume = await dispatch(createResume(data)).unwrap();
      
      console.log('Resume created successfully:', newResume);
      
      if (newResume && newResume.id) {
        console.log('Navigating to editor with ID:', newResume.id);
        // Navigate to editor with the new resume ID
        navigate(`/editor/${newResume.id}`);
      } else {
        console.error('Missing resume ID in response');
        alert('Resume was created but the ID is missing. Please try again or check the dashboard.');
      }
    } catch (error: any) {
      console.error('Error in handleCreateResume:', error);
      alert(`Failed to create resume: ${error.message || 'Unknown error'}`);
      
      // Reopen the modal if there was an error
      setIsModalOpen(true);
    }
  };

  const handleDeleteResume = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await dispatch(deleteResume(id));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleEditResume = (id: number) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar onLogout={handleLogout} />
      
      <main className="py-6 sm:py-10 w-full">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 animate-fade-in-up">My Resumes</h1>
            <p className="mt-2 text-sm text-gray-600 animate-fade-in-up delay-100">
              Create, manage, and customize your professional resumes.
            </p>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow animate-fade-in-up">
              <div className="flex flex-wrap">
                <div className="py-1">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2 sm:mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">{error}</div>
              </div>
            </div>
          )}
          
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* New Resume Card */}
            <div 
              className="h-48 sm:h-60 bg-white shadow-md hover:shadow-lg rounded-xl border-2 border-dashed border-blue-300 p-4 sm:p-6 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all transform hover:-translate-y-1 animate-fade-in-up"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-blue-50 rounded-full flex items-center justify-center mb-2 animate-float">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">Create a new resume</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started with a new template</p>
              </div>
            </div>
            
            {/* Resume Cards */}
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8 sm:py-12 animate-fade-in-up">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-blue-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-blue-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ) : resumes && Array.isArray(resumes) ? (
              resumes.map((resume: any, index: number) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => handleEditResume(resume.id)}
                  onDelete={() => handleDeleteResume(resume.id)}
                  className={`animate-fade-in-up delay-${(index % 5) + 1}00`}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-8 sm:py-12 bg-white rounded-xl shadow-sm p-4 sm:p-8 animate-fade-in-up">
                <svg className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 text-center">No resumes found</h3>
                <p className="text-gray-500 text-center text-sm sm:text-base mb-4">Create your first resume to get started on your career journey.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95"
                >
                  Create Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* New Resume Modal */}
      <NewResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateResume}
      />
      
      {/* Debug panel removed for security and cleanliness */}
    </div>
  );
};

export default DashboardPage;