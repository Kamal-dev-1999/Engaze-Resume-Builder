import React from 'react';
import { format } from 'date-fns';

interface Resume {
  id: number;
  title: string;
  updated_at: string;
  template_name: string;
  share_slug?: string;
}

interface ResumeCardProps {
  resume: Resume;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onEdit, onDelete, className = '' }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className={`bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-all transform hover:-translate-y-1 ${className}`}>
      <div className="relative">
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg uppercase">
          {resume.template_name || 'Basic'}
        </div>
        <div className="h-16 sm:h-24 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      </div>
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate" title={resume.title}>
            {resume.title}
          </h3>
          
          <div className="relative inline-block text-left">
            <div className="flex">
              <button
                onClick={onEdit}
                className="mr-1 sm:mr-2 p-1 sm:p-2 rounded-full text-blue-500 hover:bg-blue-50 focus:outline-none transition-colors"
                title="Edit resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-1.414.586H4V15a2 2 0 01-.586-1.414l10-10z" />
                  <path fillRule="evenodd" d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-12 12a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l12-12z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-1 sm:p-2 rounded-full text-red-500 hover:bg-red-50 focus:outline-none transition-colors"
                title="Delete resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>Last updated: {formatDate(resume.updated_at)}</span>
        </div>

        {resume.share_slug && (
          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-blue-600 bg-blue-50 p-1.5 sm:p-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span className="truncate">Shared publicly</span>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-3 sm:px-5 py-3 sm:py-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="w-full flex justify-center items-center text-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-1.414.586H4V15a2 2 0 01-.586-1.414l10-10z" />
            <path fillRule="evenodd" d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-12 12a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l12-12z" clipRule="evenodd" />
          </svg>
          Open Editor
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;