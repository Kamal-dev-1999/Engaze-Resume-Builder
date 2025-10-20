import React, { useState, useEffect } from 'react';
import { SkillsModal } from './SkillsModal';
import { Trash2, Plus } from 'lucide-react';

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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    console.log('SectionEditor useEffect - section:', section);
    if (section) {
      // Initialize form data with section content
      console.log('Setting formData with section.content:', section.content);
      
      // For multi-item sections (experience, education, projects)
      if (['experience', 'education', 'projects'].includes(section.type)) {
        // Ensure items array exists
        if (!section.content.items) {
          setFormData({ items: [] });
        } else {
          setFormData(section.content);
          // Expand first item by default
          if (section.content.items && section.content.items.length > 0) {
            setExpandedItems(new Set([0]));
          }
        }
      } else {
        setFormData(section.content);
      }
    } else {
      setFormData({});
    }
  }, [section]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, itemIndex?: number) => {
    const { name, value } = e.target;
    
    if (itemIndex !== undefined && ['experience', 'education', 'projects'].includes(section?.type || '')) {
      // Update items array
      const items = formData.items || [];
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        [name]: value
      };
      
      setFormData({
        ...formData,
        items: updatedItems
      });
    } else {
      // Update root level fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    const errorKey = itemIndex !== undefined ? `${itemIndex}_${name}` : name;
    if (errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: ''
      });
    }
  };
  
  const addItem = () => {
    const items = formData.items || [];
    let newItem = {};
    
    // Create empty item template based on section type
    if (section?.type === 'experience') {
      newItem = {
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
      };
    } else if (section?.type === 'education') {
      newItem = {
        degree: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
        fieldOfStudy: '',
        gpa: ''
      };
    } else if (section?.type === 'projects') {
      newItem = {
        title: '',
        name: '',
        description: '',
        url: '',
        link: '',
        technologies: '',
        start_date: '',
        end_date: ''
      };
    }
    
    setFormData({
      ...formData,
      items: [...items, newItem]
    });
    
    // Expand the new item
    setExpandedItems(new Set([...Array.from(expandedItems), items.length]));
  };
  
  const removeItem = (itemIndex: number) => {
    const items = formData.items || [];
    const updatedItems = items.filter((_: any, idx: number) => idx !== itemIndex);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
    
    // Clear any errors for this item
    const keysToRemove = Object.keys(errors).filter(key => key.startsWith(`${itemIndex}_`));
    const newErrors = { ...errors };
    keysToRemove.forEach(key => delete newErrors[key]);
    setErrors(newErrors);
    
    // Update expanded items
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(itemIndex);
    setExpandedItems(newExpanded);
  };
  
  const toggleItemExpanded = (itemIndex: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemIndex)) {
      newExpanded.delete(itemIndex);
    } else {
      newExpanded.add(itemIndex);
    }
    setExpandedItems(newExpanded);
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!section) return false;
    
    // Generic validation based on section type
    if (['experience', 'education', 'projects'].includes(section.type)) {
      const items = formData.items || [];
      
      if (items.length === 0) {
        newErrors['items'] = `Please add at least one ${section.type} entry`;
        isValid = false;
      } else {
        items.forEach((item: any, idx: number) => {
          if (section.type === 'experience') {
            if (!item.title?.trim()) {
              newErrors[`${idx}_title`] = 'Job title is required';
              isValid = false;
            }
            if (!item.company?.trim()) {
              newErrors[`${idx}_company`] = 'Company is required';
              isValid = false;
            }
          } else if (section.type === 'education') {
            if (!item.degree?.trim()) {
              newErrors[`${idx}_degree`] = 'Degree is required';
              isValid = false;
            }
            if (!item.institution?.trim()) {
              newErrors[`${idx}_institution`] = 'Institution is required';
              isValid = false;
            }
          } else if (section.type === 'projects') {
            if (!item.title?.trim()) {
              newErrors[`${idx}_title`] = 'Project title is required';
              isValid = false;
            }
            if (!item.description?.trim()) {
              newErrors[`${idx}_description`] = 'Description is required';
              isValid = false;
            }
          }
        });
      }
    } else {
      // Single-item sections
      switch (section.type) {
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
  
  // Helper to render experience item form
  const renderExperienceItem = (item: any, itemIndex: number, isExpanded: boolean) => (
    <div key={itemIndex} className="mb-4 border border-gray-200 rounded-lg">
      <div className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => toggleItemExpanded(itemIndex)}>
        <div className="flex-1">
          <p className="font-semibold text-sm">{item.title || item.company || `Experience ${itemIndex + 1}`}</p>
          {item.company && <p className="text-xs text-gray-600">{item.company}</p>}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); removeItem(itemIndex); }}
          className="text-red-500 hover:text-red-700 transition-colors ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={item.title || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_title`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_title`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_title`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={item.company || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_company`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_company`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_company`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={item.location || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={item.start_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={item.end_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={item.description || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
  
  // Helper to render education item form
  const renderEducationItem = (item: any, itemIndex: number, isExpanded: boolean) => (
    <div key={itemIndex} className="mb-4 border border-gray-200 rounded-lg">
      <div className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => toggleItemExpanded(itemIndex)}>
        <div className="flex-1">
          <p className="font-semibold text-sm">{item.degree || item.institution || `Education ${itemIndex + 1}`}</p>
          {item.institution && <p className="text-xs text-gray-600">{item.institution}</p>}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); removeItem(itemIndex); }}
          className="text-red-500 hover:text-red-700 transition-colors ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Certificate</label>
            <input
              type="text"
              name="degree"
              value={item.degree || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_degree`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_degree`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_degree`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
            <input
              type="text"
              name="institution"
              value={item.institution || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_institution`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_institution`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_institution`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={item.location || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={item.start_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={item.end_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
            <input
              type="text"
              name="fieldOfStudy"
              value={item.fieldOfStudy || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
            <input
              type="text"
              name="gpa"
              value={item.gpa || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
  
  // Helper to render projects item form
  const renderProjectsItem = (item: any, itemIndex: number, isExpanded: boolean) => (
    <div key={itemIndex} className="mb-4 border border-gray-200 rounded-lg">
      <div className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => toggleItemExpanded(itemIndex)}>
        <div className="flex-1">
          <p className="font-semibold text-sm">{item.title || item.name || `Project ${itemIndex + 1}`}</p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); removeItem(itemIndex); }}
          className="text-red-500 hover:text-red-700 transition-colors ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={item.title || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_title`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_title`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_title`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={item.description || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              rows={3}
              className={`w-full px-3 py-2 border ${errors[`${itemIndex}_description`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors[`${itemIndex}_description`] && <p className="mt-1 text-xs text-red-500">{errors[`${itemIndex}_description`]}</p>}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
            <input
              type="url"
              name="url"
              value={item.url || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
            <input
              type="text"
              name="technologies"
              value={item.technologies || ''}
              onChange={(e) => handleChange(e, itemIndex)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={item.start_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={item.end_date || ''}
                onChange={(e) => handleChange(e, itemIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render different form fields based on section type
  const renderFields = () => {
    if (!section) return null;
    
    switch (section.type) {
      case 'experience':
        return (
          <>
            {errors['items'] && <p className="mb-3 text-sm text-red-500">{errors['items']}</p>}
            <div className="mb-4">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
                Add Experience
              </button>
            </div>
            {(formData.items || []).map((item: any, idx: number) => renderExperienceItem(item, idx, expandedItems.has(idx)))}
          </>
        );
        
      case 'education':
        return (
          <>
            {errors['items'] && <p className="mb-3 text-sm text-red-500">{errors['items']}</p>}
            <div className="mb-4">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
                Add Education
              </button>
            </div>
            {(formData.items || []).map((item: any, idx: number) => renderEducationItem(item, idx, expandedItems.has(idx)))}
          </>
        );
      
      case 'projects':
        return (
          <>
            {errors['items'] && <p className="mb-3 text-sm text-red-500">{errors['items']}</p>}
            <div className="mb-4">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={18} />
                Add Project
              </button>
            </div>
            {(formData.items || []).map((item: any, idx: number) => renderProjectsItem(item, idx, expandedItems.has(idx)))}
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