import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  fetchResumeDetail, 
  updateSectionLocally,
  reorderSectionsLocally,
  updateResumeSection,
  reorderSections,
  addSection
} from '../redux/slices/editorSlice';
import SectionList from '../components/editor/SectionList';
import SectionEditor from '../components/editor/SectionEditor';
import SectionFormattingPanel from '../components/editor/SectionFormattingPanel';
import AddSection from '../components/editor/AddSection';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

const EditorPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const resumeDetail = useAppSelector(state => state.editor.resumeDetail);
  const isLoading = useAppSelector(state => state.editor.isLoading);
  const error = useAppSelector(state => state.editor.error);
  const isDirty = useAppSelector(state => state.editor.isDirty);
  
  // State for the section editor
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  
  // State for the section formatting
  const [formattingSection, setFormattingSection] = useState<Section | null>(null);
  
  // Fetch resume details when component mounts
  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeDetail(parseInt(resumeId)));
    }
  }, [dispatch, resumeId]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleSectionEdit = (sectionId: number) => {
    if (resumeDetail && resumeDetail.sections) {
      const section = resumeDetail.sections.find(s => s.id === sectionId);
      if (section) {
        setEditingSection(section);
      }
    }
  };
  
  const handleSectionDelete = (sectionId: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      // Implement section deletion logic here
      console.log('Delete section:', sectionId);
    }
  };
  
  const handleSectionSave = (updatedSection: Section) => {
    dispatch(updateSectionLocally(updatedSection));
    dispatch(updateResumeSection({ 
      resumeId: parseInt(resumeId as string), 
      section: updatedSection 
    }));
    setEditingSection(null);
  };
  
  const handleSectionReorder = (newOrderIds: number[]) => {
    dispatch(reorderSectionsLocally(newOrderIds));
    dispatch(reorderSections({ 
      resumeId: parseInt(resumeId as string), 
      sectionIds: newOrderIds 
    }));
  };
  
  const handleSectionFormat = (sectionId: number) => {
    if (resumeDetail && resumeDetail.sections) {
      const section = resumeDetail.sections.find(s => s.id === sectionId);
      if (section) {
        setFormattingSection(section);
      }
    }
  };
  
  // Preview formatting changes without saving to server
  const handleFormatPreview = (sectionId: number, formatting: any) => {
    if (resumeDetail && resumeDetail.sections) {
      const section = resumeDetail.sections.find(s => s.id === sectionId);
      if (section) {
        // Create a new section with formatting
        const updatedSection = {
          ...section,
          content: {
            ...section.content,
            formatting: formatting
          }
        };
        
        // Update the section locally only (not on the server)
        // Using the same action creator as the save function
        // but we won't dispatch any API calls later
        dispatch(updateSectionLocally(updatedSection));
      }
    }
  };
  
  const handleFormatSave = (sectionId: number, formatting: any) => {
    if (resumeDetail && resumeDetail.sections) {
      const section = resumeDetail.sections.find(s => s.id === sectionId);
      if (section) {
        // Create a new section with formatting
        const updatedSection = {
          ...section,
          content: {
            ...section.content,
            formatting: formatting
          }
        };
        
        // Update the section locally and on the server
        dispatch(updateSectionLocally(updatedSection));
        dispatch(updateResumeSection({ 
          resumeId: parseInt(resumeId as string), 
          section: updatedSection 
        }));
        
        // Close the formatting panel
        setFormattingSection(null);
      }
    }
  };
  
  const handleAddSection = (sectionType: string) => {
    if (resumeId) {
      console.log('Adding section of type:', sectionType);
      dispatch(addSection({ 
        resumeId: parseInt(resumeId), 
        sectionType 
      }));
    }
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
              {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-50 text-red-700 rounded-md">
                  <p className="font-medium">Error loading resume</p>
                  <p className="mt-1">
                    {typeof error === 'string' 
                      ? error
                      : error && typeof error === 'object' && 'detail' in error
                        ? String(error.detail)
                        : 'An error occurred while loading the resume'}
                  </p>
                  <button 
                    onClick={() => resumeId && dispatch(fetchResumeDetail(parseInt(resumeId)))} 
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : !resumeDetail ? (
                <div className="p-6 text-center text-gray-500">
                  <p>Resume not found</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 rounded-md text-blue-700 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-blue-800">{resumeDetail.title}</h2>
                        <p>Template: {resumeDetail.template_name}</p>
                      </div>
                      {isDirty && (
                        <div className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                          Unsaved Changes
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Editor Controls Panel */}
                    <div className="col-span-1">
                      <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Resume Sections</h3>
                        
                        {editingSection ? (
                          <SectionEditor 
                            section={editingSection} 
                            onSave={handleSectionSave}
                            onCancel={() => setEditingSection(null)}
                          />
                        ) : formattingSection ? (
                          <SectionFormattingPanel 
                            section={formattingSection}
                            onSave={handleFormatSave}
                            onPreview={handleFormatPreview}
                            onCancel={() => setFormattingSection(null)}
                          />
                        ) : (
                          <>
                            {resumeDetail.sections && resumeDetail.sections.length > 0 ? (
                              <SectionList 
                                sections={resumeDetail.sections}
                                onEdit={handleSectionEdit}
                                onDelete={handleSectionDelete}
                                onReorder={handleSectionReorder}
                                onFormat={handleSectionFormat}
                              />
                            ) : (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                                <p>No sections added yet</p>
                                <p className="text-sm mt-1">Add a section to get started</p>
                              </div>
                            )}
                            
                            <div className="mt-4">
                              <AddSection onAdd={handleAddSection} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Resume Preview Panel */}
                    <div className="col-span-2">
                      <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Resume Preview</h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="aspect-[1/1.4] p-0 shadow-inner flex items-start justify-start overflow-auto bg-gray-50">
                            {resumeDetail && resumeDetail.sections ? (
                              <div className="w-full">
                                {resumeDetail.template_name === 'modern' && (
                                  <ModernTemplate 
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {resumeDetail.template_name === 'creative' && (
                                  <CreativeTemplate 
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {resumeDetail.template_name === 'minimalist' && (
                                  <MinimalistTemplate 
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {(!resumeDetail.template_name || resumeDetail.template_name === 'professional') && (
                                  <ProfessionalTemplate 
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">Loading resume...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;