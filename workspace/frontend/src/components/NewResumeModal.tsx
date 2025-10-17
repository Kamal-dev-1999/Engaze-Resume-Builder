import React, { useState } from 'react';

interface NewResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; template_name: string }) => void;
}

const TEMPLATES = [
  { 
    id: 'professional', 
    name: 'Professional', 
    description: 'Clean and modern design',
    icon: '📄'
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Contemporary with bold accents',
    icon: '✨'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Stand out with unique style',
    icon: '🎨'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Simple and elegant',
    icon: '◽'
  }
];

const NewResumeModal: React.FC<NewResumeModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleBack = () => {
    setStep('template');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      onCreate({ 
        title: title.trim(), 
        template_name: selectedTemplate 
      });
      // Note: Don't reset state immediately as the parent component will close the modal
      // The parent component handles setting isOpen to false after API call succeeds
    } catch (error) {
      console.error('Error creating resume:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {step === 'template' ? 'Select a Template' : 'Create a new resume'}
          </h3>
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
        
        {step === 'template' ? (
          // Step 1: Template Selection
          <div className="px-6 py-8">
            <p className="text-sm text-gray-600 mb-6">Choose a template to get started. You can change it later.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h4 className="font-semibold text-sm text-gray-900 text-center">{template.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 text-center">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Resume Details
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5">
              {/* Selected Template Preview */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">Selected Template</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  </div>
                </div>
              </div>

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
            </div>
            
            <div className="px-6 py-5 bg-gray-50 text-right rounded-b-lg border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-colors"
              >
                ← Back
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-colors"
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewResumeModal;