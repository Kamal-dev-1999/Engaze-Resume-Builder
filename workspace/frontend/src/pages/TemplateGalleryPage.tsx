import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { logout } from '../redux/slices/authSlice';
import { createResume } from '../redux/slices/dashboardSlice';
import { useAppDispatch } from '../utils/hooks';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and corporate-looking resume perfect for traditional industries',
    thumbnail: 'bg-gradient-to-br from-blue-100 to-blue-200',
    category: 'Corporate',
    color: 'blue',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold typography and modern aesthetics',
    thumbnail: 'bg-gradient-to-br from-slate-800 to-slate-900',
    category: 'Contemporary',
    color: 'slate',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Elegant and simple design focusing on content clarity',
    thumbnail: 'bg-gradient-to-br from-gray-50 to-gray-100',
    category: 'Minimal',
    color: 'gray',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique and eye-catching design for creative professionals',
    thumbnail: 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300',
    category: 'Creative',
    color: 'orange',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated dark sidebar design for senior leadership positions',
    thumbnail: 'bg-gradient-to-br from-gray-900 to-gray-700',
    category: 'Corporate',
    color: 'gray',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif-based formal resume with timeless elegance',
    thumbnail: 'bg-gradient-to-br from-amber-50 to-amber-100',
    category: 'Traditional',
    color: 'amber',
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Modern design with teal accents and contemporary styling',
    thumbnail: 'bg-gradient-to-br from-teal-500 to-teal-600',
    category: 'Contemporary',
    color: 'teal',
  },
];

const TemplateGalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const categories = ['all', ...new Set(TEMPLATES.map(t => t.category))];

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowCreateForm(true);
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeTitle.trim() || !selectedTemplateId) return;

    setIsCreating(true);
    try {
      const result = await dispatch(
        createResume({
          title: resumeTitle.trim(),
          template_name: selectedTemplateId,
        })
      ).unwrap();
      
      // Navigate to editor with the newly created resume
      if (result && result.id) {
        navigate(`/editor/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Failed to create resume. Please try again.');
    } finally {
      setIsCreating(false);
      setShowCreateForm(false);
      setResumeTitle('');
      setSelectedTemplateId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-50">
      <Navbar onLogout={handleLogout} />

      <main className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Engaze</h2>
          <nav className="space-y-4 flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition"
            >
              Dashboard
            </button>
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold border-l-4 border-blue-600">
              Template Gallery
            </div>
            <button
              onClick={() => navigate('/documents')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition"
            >
              Documents
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 py-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Template Gallery</h1>
              <p className="text-gray-600">Choose from our collection of professionally designed resume templates</p>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
                >
                  {/* Template Preview */}
                  <div className={`h-48 ${template.thumbnail} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Template Label */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                      {template.category}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Use Template
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors font-medium text-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Resume Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create Resume</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setResumeTitle('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateResume} className="p-6 space-y-4">
              {/* Template Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Template
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900 font-semibold">
                    {TEMPLATES.find(t => t.id === selectedTemplateId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {TEMPLATES.find(t => t.id === selectedTemplateId)?.description}
                  </p>
                </div>
              </div>

              {/* Resume Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Resume 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setResumeTitle('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !resumeTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGalleryPage;
