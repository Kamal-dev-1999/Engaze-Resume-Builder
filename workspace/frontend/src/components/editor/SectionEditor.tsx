import React, { useState, useEffect } from 'react';
import { SkillsModal } from './SkillsModal';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SectionEditorProps {
  section: Section | null;
  onSave: (section: Section) => void;
  onCancel: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  
  useEffect(() => {
    console.log('SectionEditor useEffect - section:', section);
    if (section) {
      // Initialize form data with section content
      console.log('Setting formData with section.content:', section.content);
      setFormData({
        ...section.content
      });
    } else {
      setFormData({});
    }
  }, [section]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Generic validation - check for required fields based on section type
    if (section) {
      switch (section.type) {
        case 'experience':
          if (!formData.title) {
            newErrors.title = 'Job title is required';
            isValid = false;
          }
          if (!formData.company) {
            newErrors.company = 'Company name is required';
            isValid = false;
          }
          break;
        case 'education':
          if (!formData.degree) {
            newErrors.degree = 'Degree is required';
            isValid = false;
          }
          if (!formData.institution) {
            newErrors.institution = 'Institution name is required';
            isValid = false;
          }
          break;
        case 'summary':
          if (!formData.text) {
            newErrors.text = 'Summary text is required';
            isValid = false;
          }
          break;
        case 'contact':
          if (!formData.email) {
            newErrors.email = 'Email address is required';
            isValid = false;
          } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
          }
          if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
          }
          break;
        case 'skills':
          if (!formData.items || formData.items.length === 0) {
            newErrors.skills = 'At least one skill is required';
            isValid = false;
          }
          break;
        case 'projects':
          if (!formData.title) {
            newErrors.title = 'Project title is required';
            isValid = false;
          }
          if (!formData.description) {
            newErrors.description = 'Project description is required';
            isValid = false;
          }
          break;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SectionEditor handleSubmit called');
    console.log('validate() result:', validate());
    console.log('section:', section);
    console.log('formData:', formData);
    
    if (validate() && section) {
      // Save the form data
      const updatedSection: Section = {
        ...section,
        content: formData
      };
      
      console.log('Calling onSave with updatedSection:', updatedSection);
      onSave(updatedSection);
    } else {
      console.warn('Validation failed or no section');
    }
  };
  
  // Render different form fields based on section type
  const renderFields = () => {
    if (!section) return null;
    
    switch (section.type) {
      case 'experience':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
        
      case 'education':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree / Certificate
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.degree ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.degree && <p className="mt-1 text-sm text-red-500">{errors.degree}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.institution ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </>
        );
        
      case 'summary':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary
            </label>
            <textarea
              name="text"
              value={formData.text || ''}
              onChange={handleChange}
              rows={5}
              className={`w-full px-3 py-2 border ${errors.text ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Write a brief summary of your professional background and key qualifications..."
            />
            {errors.text && <p className="mt-1 text-sm text-red-500">{errors.text}</p>}
          </div>
        );

      case 'contact':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Software Engineer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="(123) 456-7890"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || formData.location || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="City, State"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio/Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://johndoe.com"
              />
            </div>
          </>
        );
        
      case 'skills':
        return (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500">Click below to add, search, or organize your skills</p>
              </div>
            </div>

            {/* Skills Modal Button */}
            <button
              type="button"
              onClick={() => setSkillsModalOpen(true)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              ✎ Manage Skills ({formData.items?.length || 0})
            </button>

            {/* Display Added Skills */}
            {formData.items && formData.items.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {formData.items.map((skill: Skill, index: number) => (
                    <div
                      key={skill.id || index}
                      className="relative group p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-gray-900 text-sm">{skill.name}</p>
                      {skill.proficiency && (
                        <p className="text-xs text-blue-600 mt-1">{skill.proficiency}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{skill.category}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            items: formData.items.filter((_: Skill, i: number) => i !== index)
                          });
                        }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.items && formData.items.length === 0 && (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">No skills added yet. Click "Manage Skills" to get started.</p>
              </div>
            )}

            {errors.skills && <p className="mt-3 text-sm text-red-500">{errors.skills}</p>}

            {/* Skills Modal */}
            <SkillsModal
              isOpen={skillsModalOpen}
              onClose={() => setSkillsModalOpen(false)}
              skills={formData.items || []}
              onSkillsChange={(updatedSkills: Skill[]) => {
                setFormData({
                  ...formData,
                  items: updatedSkills
                });
                if (errors.skills) {
                  setErrors({
                    ...errors,
                    skills: ''
                  });
                }
              }}
            />
          </div>
        );

      case 'projects':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="E-commerce Website"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://project.example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Describe the project, technologies used, and your role"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </>
        );
      
      // Add more cases for other section types as needed
      
      default:
        return (
          <div className="py-4 text-center text-gray-500">
            No editor available for this section type
          </div>
        );
    }
  };
  
  if (!section) {
    return null;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
      </h3>
      
      <form onSubmit={handleSubmit}>
        {renderFields()}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionEditor;