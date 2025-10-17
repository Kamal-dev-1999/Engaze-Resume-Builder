import React, { useEffect, useState, useRef } from 'react';
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
  addSection,
  deleteSection,
  undo,
  redo
} from '../redux/slices/editorSlice';
import SectionList from '../components/editor/SectionList';
import SectionEditor from '../components/editor/SectionEditor';
import SectionFormattingPanel from '../components/editor/SectionFormattingPanel';
import AddSection from '../components/editor/AddSection';
import UndoRedoToolbar from '../components/editor/UndoRedoToolbar';
import ResumeImportModal from '../components/editor/ResumeImportModal';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import DownloadResumeButton from '../components/DownloadResumeButton';
import ShareResumeButton from '../components/ShareResumeButton';
import type { ParsedResume } from '../utils/resumeParser';

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
  
  // State for resume import modal
  const [showImportModal, setShowImportModal] = useState(false);
  
  // State for resume preview ref
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  
  // Fetch resume details when component mounts
  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeDetail(parseInt(resumeId)));
    }
  }, [dispatch, resumeId]);
  
  // Handle keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch(undo());
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        dispatch(redo());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleSectionEdit = (sectionId: number) => {
    console.log('handleSectionEdit called with sectionId:', sectionId);
    console.log('resumeDetail:', resumeDetail);
    console.log('resumeDetail.sections:', resumeDetail?.sections);
    
    if (resumeDetail && resumeDetail.sections) {
      const section = resumeDetail.sections.find(s => s.id === sectionId);
      console.log('Found section:', section);
      if (section) {
        setEditingSection(section);
        console.log('EditingSection set to:', section);
      } else {
        console.warn('Section not found with id:', sectionId);
      }
    } else {
      console.warn('No resumeDetail or sections available');
    }
  };
  
  const handleSectionDelete = (sectionId: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      dispatch(deleteSection(sectionId));
    }
  };
  
  const handleSectionSave = async (updatedSection: Section) => {
    console.log('handleSectionSave called with:', updatedSection);
    
    try {
      // First update locally for immediate UI feedback
      dispatch(updateSectionLocally(updatedSection));
      console.log('Updated locally');
      
      // Then save to backend
      console.log('Sending to backend...');
      const result = await dispatch(updateResumeSection({ 
        resumeId: parseInt(resumeId as string), 
        section: updatedSection 
      })).unwrap();
      
      console.log('Backend response:', result);
      
      // Update with the backend response (in case it has additional data)
      if (result && result.id) {
        dispatch(updateSectionLocally(result));
        console.log('Updated with backend response');
      }
      
      setEditingSection(null);
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Failed to save changes. Please try again.');
    }
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

  const handleImportResume = async (parsedData: ParsedResume) => {
    console.log('handleImportResume called with data:', parsedData);
    
    if (!resumeDetail) {
      console.error('No resume detail found');
      return;
    }

    try {
      // If sections are empty, we need to create default sections first
      if (!resumeDetail.sections || resumeDetail.sections.length === 0) {
        console.log('No sections found, creating default sections...');
        
        // Define default sections based on template structure
        const defaultSectionTypes = ['contact', 'summary', 'experience', 'education', 'skills', 'projects'];
        const defaultSections: Section[] = [];
        
        // Create default sections with empty content
        defaultSectionTypes.forEach((type, index) => {
          let defaultContent: any = {};
          
          switch (type) {
            case 'contact':
              defaultContent = { name: '', email: '', phone: '', location: '', address: '', website: '', linkedin: '' };
              break;
            case 'summary':
              defaultContent = { text: '' };
              break;
            case 'skills':
              defaultContent = { skills: '' };
              break;
            case 'experience':
            case 'education':
            case 'projects':
              defaultContent = {};
              break;
          }
          
          defaultSections.push({
            id: index + 1, // Temporary IDs, will be replaced by backend
            type,
            content: defaultContent,
            order: index
          });
        });
        
        // Create sections on backend
        console.log('Creating default sections on backend...');
        for (const section of defaultSections) {
          try {
            await dispatch(addSection({
              resumeId: parseInt(resumeId as string),
              sectionType: section.type
            })).unwrap();
            console.log(`Section ${section.type} created`);
          } catch (err) {
            console.error(`Failed to create section ${section.type}:`, err);
          }
        }
        
        // Refresh resume detail to get the newly created sections
        console.log('Refreshing resume detail to get new sections...');
        await dispatch(fetchResumeDetail(parseInt(resumeId as string))).unwrap();
        
        // Return early - user needs to retry import after sections are created
        console.log('Sections created. Please try importing again.');
        alert('Sections have been created. Please import your resume again.');
        return;
      }

      // Create section updates based on current resumeDetail structure
      const sectionsToSave: Section[] = [];

      // Update contact section
      if (parsedData.contact) {
        const contactSection = resumeDetail.sections.find(s => s.type === 'contact');
        if (contactSection) {
          const updatedSection = {
            ...contactSection,
            content: {
              name: parsedData.contact.name || '',
              email: parsedData.contact.email || '',
              phone: parsedData.contact.phone || '',
              location: parsedData.contact.location || '',
              address: parsedData.contact.location || '',
              website: parsedData.contact.website || '',
              linkedin: parsedData.contact.linkedin || '',
            }
          };
          sectionsToSave.push(updatedSection);
          console.log('Contact section to save:', updatedSection);
        }
      }

      // Update summary section
      if (parsedData.summary) {
        const summarySection = resumeDetail.sections.find(s => s.type === 'summary');
        if (summarySection) {
          const updatedSection = {
            ...summarySection,
            content: { text: parsedData.summary }
          };
          sectionsToSave.push(updatedSection);
          console.log('Summary section to save:', updatedSection);
        }
      }

      // Update skills section
      if (parsedData.skills && parsedData.skills.length > 0) {
        const skillsSection = resumeDetail.sections.find(s => s.type === 'skills');
        if (skillsSection) {
          const updatedSection = {
            ...skillsSection,
            content: { skills: parsedData.skills.join(', ') }
          };
          sectionsToSave.push(updatedSection);
          console.log('Skills section to save:', updatedSection);
        }
      }

      // Update experience sections
      if (parsedData.experience && parsedData.experience.length > 0) {
        const expSections = resumeDetail.sections.filter(s => s.type === 'experience');
        expSections.slice(0, parsedData.experience.length).forEach((expSection, index) => {
          const exp = parsedData.experience![index];
          const updatedSection = {
            ...expSection,
            content: {
              jobTitle: exp.position || '',
              company: exp.company || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || ''
            }
          };
          sectionsToSave.push(updatedSection);
          console.log(`Experience section ${index} to save:`, updatedSection);
        });
      }

      // Update education sections
      if (parsedData.education && parsedData.education.length > 0) {
        const eduSections = resumeDetail.sections.filter(s => s.type === 'education');
        eduSections.slice(0, parsedData.education.length).forEach((eduSection, index) => {
          const edu = parsedData.education![index];
          const updatedSection = {
            ...eduSection,
            content: {
              degree: edu.degree || '',
              institution: edu.institution || '',
              fieldOfStudy: edu.field || '',
              startDate: edu.graduationDate || '',
              endDate: edu.graduationDate || '',
              gpa: ''
            }
          };
          sectionsToSave.push(updatedSection);
          console.log(`Education section ${index} to save:`, updatedSection);
        });
      }

      // Update project sections
      if (parsedData.projects && parsedData.projects.length > 0) {
        const projSections = resumeDetail.sections.filter(s => s.type === 'projects');
        projSections.slice(0, parsedData.projects.length).forEach((projSection, index) => {
          const proj = parsedData.projects![index];
          const updatedSection = {
            ...projSection,
            content: {
              name: proj.name || '',
              description: proj.description || '',
              link: proj.link || ''
            }
          };
          sectionsToSave.push(updatedSection);
          console.log(`Project section ${index} to save:`, updatedSection);
        });
      }

      // Save all sections to backend
      console.log('Saving', sectionsToSave.length, 'sections to backend...');
      let saveCount = 0;
      for (const section of sectionsToSave) {
        try {
          const result = await dispatch(updateResumeSection({
            resumeId: parseInt(resumeId as string),
            section: section
          })).unwrap();
          console.log(`Section ${section.id} (${section.type}) saved successfully`, result);
          saveCount++;
        } catch (err) {
          console.error(`Failed to save section ${section.id}:`, err);
        }
      }

      console.log(`Successfully saved ${saveCount} out of ${sectionsToSave.length} sections`);

      // Refresh the resume detail to get all the saved sections
      console.log('Refreshing resume detail after import...');
      await dispatch(fetchResumeDetail(parseInt(resumeId as string))).unwrap();
      
      console.log('All sections saved to backend and resume detail refreshed');
      alert('Resume imported successfully!');
    } catch (error) {
      console.error('Error during import:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
              
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg relative group"
              >
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full transform group-hover:scale-110 transition-transform">
                  AI
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Import Resume
              </button>
              
              <div className="border-l border-gray-300 pl-6">
                <UndoRedoToolbar />
              </div>
            </div>
            
            {resumeDetail && (
              <div className="flex gap-3">
                <ShareResumeButton 
                  resumeId={resumeDetail.id}
                  initialShareSlug={resumeDetail.share_slug}
                />
                <DownloadResumeButton 
                  resumeTitle={resumeDetail.title}
                  resumeContent={resumePreviewRef}
                />
              </div>
            )}
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
                          <div className="aspect-[1/1.4] p-0 shadow-inner flex items-start justify-start overflow-auto bg-gray-50" ref={resumePreviewRef}>
                            {resumeDetail && resumeDetail.sections ? (
                              <div className="w-full">
                                {resumeDetail.template_name === 'modern' && (
                                  <ModernTemplate 
                                    key={JSON.stringify(resumeDetail.sections)}
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {resumeDetail.template_name === 'creative' && (
                                  <CreativeTemplate 
                                    key={JSON.stringify(resumeDetail.sections)}
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {resumeDetail.template_name === 'minimalist' && (
                                  <MinimalistTemplate 
                                    key={JSON.stringify(resumeDetail.sections)}
                                    resumeTitle={resumeDetail.title}
                                    sections={resumeDetail.sections}
                                  />
                                )}
                                {(!resumeDetail.template_name || resumeDetail.template_name === 'professional') && (
                                  <ProfessionalTemplate 
                                    key={JSON.stringify(resumeDetail.sections)}
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

      {/* Resume Import Modal */}
      <ResumeImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportResume}
      />
    </div>
  );
};

export default EditorPage;