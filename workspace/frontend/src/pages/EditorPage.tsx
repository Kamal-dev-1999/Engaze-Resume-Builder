import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppDispatch } from '../utils/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const EditorPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Resume Editor
              </h1>
              <div className="p-4 bg-blue-50 rounded-md text-blue-700 mb-6">
                <p>
                  You're editing resume ID: {resumeId}
                </p>
                <p className="mt-2">
                  This is a placeholder for the resume editor which will be implemented soon.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Editor Controls</h3>
                  <p className="text-gray-600 text-sm">
                    This panel will contain section controls, add/remove/reorder functionality, 
                    and template selection.
                  </p>
                </div>
                
                <div className="col-span-2 bg-white border border-gray-200 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Resume Preview</h3>
                  <div className="bg-white aspect-[1/1.4] border border-gray-300 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2">Resume preview will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;