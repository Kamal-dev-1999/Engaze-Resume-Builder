import React, { useState, useEffect } from 'react';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface SectionEditorProps {
  section: Section | null;
  onSave: (section: Section) => void;
  onCancel: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (section) {
      // Initialize form data with section content
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
    
    if (validate() && section) {
      // Save the form data
      const updatedSection: Section = {
        ...section,
        content: formData
      };
      
      onSave(updatedSection);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Enter skills separated by commas</p>
            <textarea
              name="skillsText"
              value={formData.skillsText || formData.items?.join(', ') || ''}
              onChange={(e) => {
                const skillsText = e.target.value;
                const skillsArray = skillsText
                  .split(',')
                  .map(skill => skill.trim())
                  .filter(skill => skill !== '');
                
                setFormData({
                  ...formData,
                  skillsText,
                  items: skillsArray
                });
                
                // Clear error if skills are added
                if (skillsArray.length > 0 && errors.skills) {
                  setErrors({
                    ...errors,
                    skills: ''
                  });
                }
              }}
              rows={3}
              className={`w-full px-3 py-2 border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="HTML, CSS, JavaScript, React, Node.js"
            />
            {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
            
            {formData.items && formData.items.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.items.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
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