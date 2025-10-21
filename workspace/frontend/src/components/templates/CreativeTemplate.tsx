import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Upload, X } from 'lucide-react';
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";
import { logTemplateData, detectHardcodedContent, logSectionSorting } from "../../utils/debugLogger";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface CreativeTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

/**
 * Helper function to normalize section content into an array.
 * This ensures the component can render data whether it's stored
 * as a single object, a correct array, or in mixed formats.
 */
const _getItemsArray = (content: any): any[] => {
  if (!content) {
    return [];
  }

  // 1. Data is already in the correct array format
  if (Array.isArray(content.items)) {
    // BUT check if items is EMPTY and real data exists in flat fields
    if (content.items.length === 0) {
      // Check if there's real data in flat fields (education)
      if (content.degree || content.institution) {
        return [{
          degree: content.degree,
          institution: content.institution,
          location: content.location,
          start_date: content.start_date || content.startDate,
          end_date: content.end_date || content.endDate,
          fieldOfStudy: content.fieldOfStudy,
          gpa: content.gpa
        }];
      }
      
      // Check if there's real data in flat fields (projects) - BEFORE experience
      // Projects have url/link or technologies signature
      if (content.url || content.link || content.technologies) {
        return [{
          title: content.title || content.name,
          name: content.name || content.title,
          description: content.description,
          link: content.link || content.url,
          url: content.url || content.link,
          technologies: content.technologies,
          start_date: content.start_date,
          end_date: content.end_date
        }];
      }
      
      // Check if there's real data in flat fields (experience)
      if (content.title || content.company) {
        return [{
          title: content.title || content.jobTitle,
          company: content.company,
          location: content.location,
          start_date: content.start_date || content.startDate,
          end_date: content.end_date || content.endDate,
          description: content.description,
          jobTitle: content.jobTitle
        }];
      }
      
      // Items is empty and no flat fields - return empty
      return [];
    }
    
    // Items array has data - return it
    return content.items;
  }
  
  // 2. FIX: Handle the specific bug where items is saved as the string "["
  if (content.items === "[") {
    return []; // Return an empty array because the data is corrupted
  }

  // 3. Handle the old format (single object with flat fields)
  // Check for education fields FIRST (specific check)
  if (content.degree || content.institution) {
    return [{
      degree: content.degree,
      institution: content.institution,
      location: content.location,
      start_date: content.start_date || content.startDate,
      end_date: content.end_date || content.endDate,
      fieldOfStudy: content.fieldOfStudy,
      gpa: content.gpa
    }];
  }
  
  // Check for project fields (before experience) - projects have url/link + technologies
  if (content.url || content.link || content.technologies) {
    return [{
      title: content.title,
      name: content.name || content.title,
      description: content.description,
      link: content.link || content.url,
      url: content.url || content.link,
      technologies: content.technologies,
      start_date: content.start_date,
      end_date: content.end_date
    }];
  }
  
  // Check for project fields with just name
  if (content.name) {
    return [{
      name: content.name || content.title,
      title: content.title || content.name,
      description: content.description,
      link: content.link || content.url,
      url: content.url || content.link,
      technologies: content.technologies,
      start_date: content.start_date,
      end_date: content.end_date
    }];
  }
  
  // Check for experience fields
  if (content.title || content.jobTitle || content.company) {
    return [{
      title: content.title || content.jobTitle,
      jobTitle: content.jobTitle || content.title,
      company: content.company,
      location: content.location,
      start_date: content.start_date || content.startDate,
      end_date: content.end_date || content.endDate,
      description: content.description
    }];
  }
  
  // 4. No recognized pattern - return single item
  return [content];
};

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ sections }) => {
  // keep flexible ordering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  // Enable debugging by setting this to true
  const DEBUG_MODE = false;

  // Log template data for debugging
  React.useEffect(() => {
    if (DEBUG_MODE) {
      console.log('%c🎯 CreativeTemplate Loaded', 'color: #0066cc; font-size: 16px; font-weight: bold;');
      logTemplateData('CreativeTemplate', sections, sortedSections);
      logSectionSorting(sections, sortedSections);
      
      // Check each section for hardcoded content
      sortedSections.forEach((section) => {
        detectHardcodedContent(section.type, section.content);
      });
    }
  }, [sections, sortedSections]);

  const contact = sortedSections.find(s => s.type === 'contact')?.content || {};

  // Helper function to apply formatting styles
  const getFormattingStyles = (formatting: any = {}) => {
    const style: React.CSSProperties = {};
    
    if (formatting.textColor) {
      style.color = formatting.textColor;
    }
    if (formatting.backgroundColor && formatting.backgroundColor !== 'transparent') {
      style.backgroundColor = formatting.backgroundColor;
    }
    if (formatting.fontFamily) {
      style.fontFamily = formatting.fontFamily;
    }
    if (formatting.fontSize) {
      style.fontSize = `${formatting.fontSize}px`;
    }
    if (formatting.fontWeight) {
      style.fontWeight = formatting.fontWeight as React.CSSProperties['fontWeight'];
    }
    if (formatting.textAlign) {
      style.textAlign = formatting.textAlign as React.CSSProperties['textAlign'];
    }
    if (formatting.padding !== undefined && formatting.padding > 0) {
      style.padding = `${formatting.padding}px`;
    }
    if (formatting.margin !== undefined && formatting.margin > 0) {
      style.margin = `${formatting.margin}px`;
    }
    if (formatting.borderWidth && formatting.borderWidth > 0) {
      style.border = `${formatting.borderWidth}px solid ${formatting.borderColor || '#d1d5db'}`;
      if (formatting.borderRadius) {
        style.borderRadius = `${formatting.borderRadius}px`;
      }
    }
    
    return style;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => setTempPhoto(null);

  // allocate sections to left/right columns but preserve relative order within each column
  const leftTypes = ['experience', 'projects', 'education'];
  const rightTypes = ['skills', 'summary'];

  const leftSections = sortedSections.filter(s => leftTypes.includes(s.type));
  const rightSections = sortedSections.filter(s => rightTypes.includes(s.type));

  return (
    <div className="w-full bg-white text-gray-900 font-['Segoe UI'] p-4 md:p-6 lg:p-8">
      {/* Header - Orange band with name + photo */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 md:px-8 py-6 md:py-8 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            {contact.name && <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{contact.name}</h1>}
            {contact.tagline || contact.title ? (
              <p className="mt-2 text-sm md:text-base font-semibold opacity-95">{contact.tagline || contact.title}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-5 text-sm opacity-95 font-medium">
              {contact.phone && <div className="flex items-center gap-2"><Phone size={16} /> <span>{contact.phone}</span></div>}
              {contact.email && <a className="flex items-center gap-2 hover:opacity-80 transition" href={`mailto:${contact.email}`}><Mail size={16} /> <span>{contact.email}</span></a>}
              {contact.linkedin && <a className="flex items-center gap-2 hover:opacity-80 transition" href={contact.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> <span>LinkedIn</span></a>}
              {contact.website && <a className="flex items-center gap-2 hover:opacity-80 transition" href={contact.website} target="_blank" rel="noreferrer"><Globe size={16} /> <span>Portfolio</span></a>}
              {(contact.address || contact.location) && <div className="flex items-center gap-2"><MapPin size={16} /> <span>{contact.address || contact.location}</span></div>}
            </div>
          </div>

          {/* Photo */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-lg bg-white/30 overflow-hidden flex-shrink-0 relative group shadow-md">
            {tempPhoto || contact.photo ? (
              <>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img src={tempPhoto || contact.photo} alt="profile photo" className="w-full h-full object-cover" />
                {tempPhoto && (
                  <button
                    onClick={clearPhoto}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                    title="Remove photo"
                  >
                    <X size={16} />
                  </button>
                )}
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/40 transition text-white/90 hover:text-white">
                <Upload size={22} />
                <span className="text-xs mt-1.5 text-center px-1 font-semibold">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Content area: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 py-8 md:py-10">
          {/* Left / Main column (2/3) */}
          <div className="md:col-span-2 space-y-5">
            {leftSections.map((section) => {
              switch(section.type) {
                case 'experience':
                  return (
                    <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{section.content.title}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="text-orange-600 font-semibold">{section.content.company}</div>
                        <div className="whitespace-nowrap text-gray-600 font-medium">{section.content.startDate && section.content.endDate ? `${section.content.startDate} – ${section.content.endDate}` : ''}</div>
                      </div>
                      {section.content.description && (
                        <ul className="mt-2.5 text-sm text-gray-700 list-disc list-inside space-y-1.5 leading-relaxed">
                          {section.content.description.split('\n').map((line: string, idx: number) => line.trim() ? <li key={idx}>{line.trim()}</li> : null)}
                        </ul>
                      )}
                    </div>
                  );

                case 'projects':
                  return (
                    <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{section.content.title}</h3>
                      {section.content.date && <div className="text-sm text-gray-600 font-medium mb-2">{section.content.date}</div>}
                      {section.content.description && <p className="mt-2 text-sm text-gray-700 leading-relaxed">{section.content.description}</p>}
                      {section.content.link && <a href={section.content.link} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-700 font-semibold underline">{section.content.linkText || 'View project'}</a>}
                    </div>
                  );

                case 'education':
                  return (
                    <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{section.content.degree}</h3>
                      <div className="text-sm text-orange-600 font-semibold mb-1">{section.content.institution}{section.content.location ? ` — ${section.content.location}` : ''}{section.content.fieldOfStudy ? ` • ${section.content.fieldOfStudy}` : ''}</div>
                      {section.content.start_date && section.content.end_date && <div className="text-sm text-gray-600 font-medium">{section.content.start_date} – {section.content.end_date}</div>}
                      {section.content.startDate && section.content.endDate && <div className="text-sm text-gray-600 font-medium">{section.content.startDate} – {section.content.endDate}</div>}
                    </div>
                  );

                case 'custom':
                  return (
                    <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{section.content.title || 'Additional Information'}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{section.content.content || section.content.text}</p>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Right / Sidebar */}
          <aside className="space-y-5">
            {rightSections.map((section) => {
              switch(section.type) {
                case 'summary':
                  return (
                    <div key={section.id} className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200" style={getFormattingStyles(section.content?.formatting)}>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Summary</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{section.content.text}</p>
                    </div>
                  );

                case 'skills':
                  const skillsByCategory = formatSkillsByCategory(section.content.items || []);
                  return (
                    <div key={section.id} className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200" style={getFormattingStyles(section.content?.formatting)}>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Skills</h4>
                      <div className="space-y-3">
                        {Object.entries(skillsByCategory).length > 0 ? (
                          Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                            <div key={idx}>
                              <p className="text-xs font-bold text-gray-900 mb-2 uppercase">
                                {getCategoryDisplayName(categoryId)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {skillList.map((skill: string, sidx: number) => (
                                  <span
                                    key={sidx}
                                    className="text-xs px-3 py-1.5 bg-white border-2 border-orange-300 rounded font-medium text-gray-800 hover:bg-orange-100 transition"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : typeof section.content.skills === 'string' ? (
                          section.content.skills?.split(',').map((s: string, i: number) => (
                            <span key={i} className="text-xs px-3 py-1.5 bg-white border-2 border-orange-300 rounded font-medium text-gray-800 inline-block">{s.trim()}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No skills added</span>
                        )}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}

            {/* Small footer note */}
            <div className="text-xs text-gray-600 italic pt-2">Designed with ✨ by Engaze</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
