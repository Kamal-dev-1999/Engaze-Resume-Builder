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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');
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

  // Filter resumes based on search term and template type
  const filteredResumes = resumes?.filter((resume: any) => {
    const matchesSearch = resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true;
    const matchesTemplate = selectedTemplate === 'all' || resume.template_name === selectedTemplate;
    return matchesSearch && matchesTemplate;
  }) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-50">
      <Navbar onLogout={handleLogout} />
      
      <main className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Engaze</h2>
          <nav className="space-y-4 flex-1">
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold border-l-4 border-blue-600">
              Dashboard
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition">
              Template Gallery
            </div>
            <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition">
              Documents
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 py-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Resumes</h1>
              <p className="text-gray-600">Create, manage, and customize your professional resumes.</p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
              </div>

              {/* Template Filter */}
              <div className="sm:w-56">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white font-medium text-gray-700"
                >
                  <option value="all">All Templates</option>
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>

            {/* Results Count Badge */}
            {(searchTerm || selectedTemplate !== 'all') && (
              <div className="mb-6 inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {filteredResumes.length} result{filteredResumes.length !== 1 ? 's' : ''}
              </div>
            )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">{error}</div>
              </div>
            </div>
          )}

            {/* Resume Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New Resume Card */}
              <div 
                className="h-64 bg-white shadow-md hover:shadow-xl rounded-xl border-2 border-dashed border-blue-300 p-6 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-blue-600"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Resume</h3>
                  <p className="mt-1 text-sm text-gray-500">Start with a new template</p>
                </div>
              </div>            {/* Resume Cards */}
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8 sm:py-12 animate-fade-in-up">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-blue-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-blue-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ) : filteredResumes && Array.isArray(filteredResumes) && filteredResumes.length > 0 ? (
              filteredResumes.map((resume: any, index: number) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => handleEditResume(resume.id)}
                  onDelete={() => handleDeleteResume(resume.id)}
                  className={`animate-fade-in-up delay-${(index % 5) + 1}00`}
                />
              ))
            ) : !isLoading && resumes && resumes.length > 0 && (searchTerm || selectedTemplate !== 'all') ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm p-8">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500 text-center">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm p-8">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">No resumes yet</h3>
                <p className="text-gray-500 text-center mb-6">Create your first resume to get started</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Resume
                </button>
              </div>
            )}
            </div>
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