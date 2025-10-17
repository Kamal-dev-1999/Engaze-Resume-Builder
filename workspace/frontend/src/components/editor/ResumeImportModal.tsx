import React, { useState, useRef } from 'react';
import { parseResume, readFile, type ParsedResume } from '../../utils/resumeParser';
import { parseResumeWithAI, validateResumeData } from '../../services/geminiParser';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (parsedData: ParsedResume) => void;
}

const ResumeImportModal: React.FC<ResumeImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx)$/i)) {
      setError('Please select a valid file (TXT, PDF, or DOCX)');
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Try to preview the parsed data using AI
    try {
      setIsLoading(true);
      const text = await readFile(file);
      
      // Try AI parsing first
      console.log('Attempting to parse resume with AI...');
      try {
        const aiParsed = await parseResumeWithAI(text);
        
        // Validate AI parsed data
        if (validateResumeData(aiParsed)) {
          console.log('Successfully parsed with AI');
          setPreview(aiParsed);
        } else {
          throw new Error('AI parsing returned incomplete data');
        }
      } catch (aiError) {
        console.warn('AI parsing failed, falling back to basic parser:', aiError);
        // Fallback to basic parsing
        const basicParsed = parseResume(text);
        setPreview(basicParsed);
      }
    } catch (err) {
      setError('Failed to parse file. Please ensure it contains valid resume content.');
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">Import Resume</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Section */}
          {!preview ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Your Resume
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    {isLoading ? 'Parsing your resume with AI...' : 'Drag and drop your resume here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Supported formats: TXT, PDF, DOCX (Max 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {selectedFile && !preview && !isLoading && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Selected file:</strong> {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Preview Section
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Preview Extracted Data</h4>

              {preview.contact && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Contact Information</h5>
                  <div className="space-y-1 text-sm text-blue-800">
                    {preview.contact.name && <p><strong>Name:</strong> {preview.contact.name}</p>}
                    {preview.contact.email && <p><strong>Email:</strong> {preview.contact.email}</p>}
                    {preview.contact.phone && <p><strong>Phone:</strong> {preview.contact.phone}</p>}
                    {preview.contact.location && <p><strong>Location:</strong> {preview.contact.location}</p>}
                  </div>
                </div>
              )}

              {preview.summary && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900 mb-2">Professional Summary</h5>
                  <p className="text-sm text-green-800 line-clamp-3">{preview.summary}</p>
                </div>
              )}

              {preview.experience && preview.experience.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-2">
                    Work Experience ({preview.experience.length} entries found)
                  </h5>
                  <ul className="space-y-1 text-sm text-purple-800">
                    {preview.experience.slice(0, 3).map((exp: any, idx: number) => (
                      <li key={idx}>
                        <strong>{exp.position}</strong> at {exp.company}
                      </li>
                    ))}
                    {preview.experience.length > 3 && (
                      <li className="text-purple-600 italic">+{preview.experience.length - 3} more entries</li>
                    )}
                  </ul>
                </div>
              )}

              {preview.education && preview.education.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h5 className="font-medium text-amber-900 mb-2">
                    Education ({preview.education.length} entries found)
                  </h5>
                  <ul className="space-y-1 text-sm text-amber-800">
                    {preview.education.slice(0, 3).map((edu: any, idx: number) => (
                      <li key={idx}>
                        <strong>{edu.degree}</strong> from {edu.institution}
                      </li>
                    ))}
                    {preview.education.length > 3 && (
                      <li className="text-amber-600 italic">+{preview.education.length - 3} more entries</li>
                    )}
                  </ul>
                </div>
              )}

              {preview.skills && preview.skills.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h5 className="font-medium text-indigo-900 mb-2">
                    Skills ({preview.skills.length} found)
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {preview.skills.slice(0, 10).map((skill: string, idx: number) => (
                      <span key={idx} className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {preview.skills.length > 10 && (
                      <span className="text-indigo-600 text-xs italic">+{preview.skills.length - 10} more</span>
                    )}
                  </div>
                </div>
              )}

              {preview.projects && preview.projects.length > 0 && (
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h5 className="font-medium text-pink-900 mb-2">
                    Projects ({preview.projects.length} found)
                  </h5>
                  <ul className="space-y-1 text-sm text-pink-800">
                    {preview.projects.slice(0, 2).map((proj: any, idx: number) => (
                      <li key={idx}><strong>{proj.name}</strong></li>
                    ))}
                    {preview.projects.length > 2 && (
                      <li className="text-pink-600 italic">+{preview.projects.length - 2} more projects</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  ✓ Resume data has been extracted and will be imported into your template
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {preview ? 'Cancel' : 'Close'}
            </button>
            {preview && (
              <>
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Choose Different File
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Import to Resume
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImportModal;
