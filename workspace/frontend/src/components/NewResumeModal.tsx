import React, { useState } from 'react';

interface NewResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; template_name: string }) => void;
}

const TEMPLATES = [
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimalist', name: 'Minimalist' }
];

const NewResumeModal: React.FC<NewResumeModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    onCreate({ 
      title: title.trim(), 
      template_name: selectedTemplate 
    });
    // Reset form state
    setTitle('');
    setSelectedTemplate(TEMPLATES[0].id);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Create a new resume</h3>
          <button 
            type="button" 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <div className="mb-5">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Resume Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Software Engineer Resume"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-1.414.586H4V15a2 2 0 01-.586-1.414l10-10z" />
                  <path fillRule="evenodd" d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-12 12a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l12-12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Template
              </label>
              <div className="grid grid-cols-2 gap-4">
                {TEMPLATES.map((template) => (
                  <div key={template.id} className="relative">
                    <input
                      type="radio"
                      id={`template-${template.id}`}
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`template-${template.id}`}
                      className={`
                        block rounded-xl px-4 py-3 text-sm cursor-pointer transition-all hover:shadow-md
                        ${selectedTemplate === template.id
                          ? 'bg-blue-50 border-2 border-blue-500 shadow'
                          : 'border border-gray-300 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${selectedTemplate === template.id ? 'bg-blue-500' : 'border-2 border-gray-400'} mr-2`}></div>
                        <span className={selectedTemplate === template.id ? 'font-medium' : ''}>{template.name}</span>
                      </div>
                    </label>
                    {selectedTemplate === template.id && (
                      <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5 bg-gray-50 text-right rounded-b-lg border-t border-gray-100 flex justify-end items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg mr-3 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className={`
                px-5 py-2.5 text-sm font-medium text-white rounded-lg flex items-center
                ${!title.trim() || isSubmitting
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewResumeModal;