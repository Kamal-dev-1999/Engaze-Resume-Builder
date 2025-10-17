import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { logout } from '../redux/slices/authSlice';
import { useAppDispatch } from '../utils/hooks';

interface Document {
  id: number;
  title: string;
  type: 'resume' | 'cover_letter' | 'letter';
  lastModified: string;
  preview: string;
}

const DUMMY_DOCUMENTS: Document[] = [
  {
    id: 1,
    title: 'Software Engineer Resume',
    type: 'resume',
    lastModified: 'Oct 15, 2025',
    preview: 'Senior Software Engineer with 5+ years of experience in full-stack development...',
  },
  {
    id: 2,
    title: 'Product Manager Cover Letter',
    type: 'cover_letter',
    lastModified: 'Oct 14, 2025',
    preview: 'Dear Hiring Manager, I am writing to express my interest in the Product Manager position...',
  },
  {
    id: 3,
    title: 'Designer Resume',
    type: 'resume',
    lastModified: 'Oct 12, 2025',
    preview: 'Creative Designer with expertise in UI/UX design, branding, and digital marketing...',
  },
  {
    id: 4,
    title: 'Resignation Letter Template',
    type: 'letter',
    lastModified: 'Oct 10, 2025',
    preview: 'Dear [Manager Name], Please accept this letter as formal notification of my resignation...',
  },
  {
    id: 5,
    title: 'Data Analyst Resume',
    type: 'resume',
    lastModified: 'Oct 8, 2025',
    preview: 'Data Analyst specialized in business intelligence, SQL, and Python visualization...',
  },
  {
    id: 6,
    title: 'Tech Interview Cover Letter',
    type: 'cover_letter',
    lastModified: 'Oct 5, 2025',
    preview: 'I am excited to apply for the Software Development position at your esteemed company...',
  },
];

const DocumentsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'resume' | 'cover_letter' | 'letter'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredDocuments = DUMMY_DOCUMENTS.filter((doc) => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'cover_letter':
        return 'Cover Letter';
      case 'letter':
        return 'Letter';
      default:
        return type;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'resume':
        return 'bg-blue-100 text-blue-800';
      case 'cover_letter':
        return 'bg-purple-100 text-purple-800';
      case 'letter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return '📄';
      case 'cover_letter':
        return '📝';
      case 'letter':
        return '📋';
      default:
        return '📃';
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
            <button
              onClick={() => navigate('/template-gallery')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition"
            >
              Template Gallery
            </button>
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold border-l-4 border-blue-600">
              Documents
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 py-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Documents</h1>
              <p className="text-gray-600">Manage all your resumes, cover letters, and documents</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Type Tabs */}
            <div className="mb-8 flex flex-wrap gap-3">
              {['all', 'resume', 'cover_letter', 'letter'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {type === 'all' ? 'All' : getDocumentTypeLabel(type)}
                </button>
              ))}
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className="text-3xl mt-1">{getDocumentTypeIcon(doc.type)}</div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.preview}</p>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.type)}`}>
                              {getDocumentTypeLabel(doc.type)}
                            </span>
                            <span className="text-xs text-gray-500">Modified {doc.lastModified}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                          Open
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-red-400 hover:text-red-600 transition-colors font-medium text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-500">Create or upload your first document to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
