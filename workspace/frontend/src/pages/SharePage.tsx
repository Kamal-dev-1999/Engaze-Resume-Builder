import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface SharedResumeData {
  title: string;
  template_name: string;
  created_at: string;
  sections: Array<{
    id: number;
    section_type: string;
    content: Record<string, any>;
    order: number;
  }>;
  style: {
    style_data: Record<string, any>;
  };
}

const SharePage: React.FC = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const [resumeData, setResumeData] = useState<SharedResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedResume = async () => {
      try {
        setLoading(true);
        const response = await api.get(`resumes/share/${shareSlug}/`);
        setResumeData(response.data);
        setError(null);
      } catch (err) {
        setError('This resume does not exist or is no longer shared');
        console.error('Error fetching shared resume:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shareSlug) {
      fetchSharedResume();
    }
  }, [shareSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Resume Not Found</h1>
          <p className="mt-2 text-gray-600">{error || 'This resume is not available'}</p>
          <div className="mt-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {resumeData.title}
            </h1>
            <div>
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create Your Own Resume
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold">{resumeData.title}</h2>
            <p className="text-gray-600 mt-1">Template: {resumeData.template_name}</p>
          </div>
          
          <div className="bg-white aspect-[1/1.4] border border-gray-300 rounded-md flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">Resume content will be rendered here</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This resume was created with Engaze Resume Builder. 
              <Link to="/" className="ml-1 text-blue-600 hover:text-blue-800">
                Create your own resume for free.
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharePage;