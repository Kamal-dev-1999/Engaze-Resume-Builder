import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";
import { logTemplateData, detectHardcodedContent, logSectionSorting } from "../../utils/debugLogger";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface ModernTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

/**
 * Helper function to normalize section content into an array.
 * This ensures the component can render data whether it's stored
 * as a single object, a correct array, or in mixed formats.
 */
const getItemsArray = (content: any): any[] => {
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

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeTitle, sections }) => {
  // Sort sections by order property to respect custom section ordering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Enable debugging by setting this to true
  const DEBUG_MODE = false;

  // Log template data for debugging
  React.useEffect(() => {
    if (DEBUG_MODE) {
      console.log('%c🎯 ModernTemplate Loaded', 'color: #0066cc; font-size: 16px; font-weight: bold;');
      logTemplateData('ModernTemplate', sections, sortedSections);
      logSectionSorting(sections, sortedSections);
      
      // Check each section for hardcoded content
      sortedSections.forEach((section) => {
        detectHardcodedContent(section.type, section.content);
      });
    }
  }, [sections, sortedSections]);

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

  return (
    <div className="w-full bg-white text-gray-900 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-full space-y-5">
        {sortedSections.map((section) => {
          switch(section.type) {
            case 'contact':
              return (
                <div key={section.id} className="mb-6 pb-6 border-b-2 border-teal-600" style={getFormattingStyles(section.content?.formatting)}>
                  {section.content.name && (
                    <h1 className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">{section.content.name}</h1>
                  )}
                  {section.content.title && (
                    <p className="text-sm text-teal-600 mb-4 font-semibold uppercase tracking-widest">{section.content.title}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {section.content.phone && <span>{section.content.phone}</span>}
                    {section.content.email && (
                      <a href={`mailto:${section.content.email}`} className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
                        {section.content.email}
                      </a>
                    )}
                    {(section.content.address || section.content.location) && (
                      <span>{section.content.address || section.content.location}</span>
                    )}
                    {section.content.linkedin && (
                      <a href={section.content.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
                        LinkedIn
                      </a>
                    )}
                    {section.content.website && (
                      <a href={section.content.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              );
            case 'summary':
              return (
                <div key={section.id} className="mb-5 pb-1" style={getFormattingStyles(section.content?.formatting)}>
                  <p className="text-gray-700 leading-relaxed text-sm">{section.content.text}</p>
                </div>
              );
            case 'experience':
              return (
                <div key={section.id} className="mb-5" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 flex items-center uppercase tracking-wider border-b border-gray-200">
                    <div className="w-1 h-5 bg-teal-600 mr-3"></div>
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-teal-600">
                      <p className="font-bold text-sm text-gray-900">{section.content.title}</p>
                      <p className="text-teal-600 text-xs font-semibold mb-1">{section.content.company}</p>
                      {section.content.startDate && section.content.endDate && (
                        <p className="text-xs text-gray-500 mb-3">{section.content.startDate} - {section.content.endDate}</p>
                      )}
                      {section.content.description && (
                        <ul className="text-xs text-gray-700 space-y-1.5">
                          {section.content.description.split('\n').map((line: string, idx: number) => (
                            line.trim() && (
                              <li key={idx} className="flex items-start">
                                <span className="text-teal-600 mr-2 font-bold flex-shrink-0">▸</span>
                                <span className="leading-relaxed">{line.trim()}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            case 'education':
              return (
                <div key={section.id} className="mb-5" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 flex items-center uppercase tracking-wider border-b border-gray-200">
                    <div className="w-1 h-5 bg-teal-600 mr-3"></div>
                    EDUCATION
                  </h2>
                  <div className="space-y-4">
                    <div className="pl-4">
                      <p className="font-bold text-sm text-gray-900">{section.content.degree}</p>
                      <p className="text-teal-600 text-xs font-semibold mb-1">{section.content.institution}</p>
                      {section.content.location && (
                        <p className="text-gray-700 text-xs mb-1">{section.content.location}</p>
                      )}
                      {section.content.start_date && section.content.end_date && (
                        <p className="text-xs text-gray-500">{section.content.start_date} - {section.content.end_date}</p>
                      )}
                      {section.content.startDate && section.content.endDate && (
                        <p className="text-xs text-gray-500">{section.content.startDate} - {section.content.endDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            case 'skills':
              const skillsByCategory = formatSkillsByCategory(section.content.items || []);
              return (
                <div key={section.id} className="mb-5" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 flex items-center uppercase tracking-wider border-b border-gray-200">
                    <div className="w-1 h-5 bg-teal-600 mr-3"></div>
                    SKILLS
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(skillsByCategory).length > 0 ? (
                      Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                        <div key={idx}>
                          <p className="text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider">
                            {getCategoryDisplayName(categoryId)}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill: string, sidx: number) => (
                              <span
                                key={sidx}
                                className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : typeof section.content.skills === 'string' ? (
                      <span className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-300">
                        {section.content.skills}
                      </span>
                    ) : (
                      <span className="text-gray-500">No skills added</span>
                    )}
                  </div>
                </div>
              );
            case 'projects':
              return (
                <div key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
                    <div className="w-1 h-5 bg-teal-600 mr-3"></div>
                    PROJECTS
                  </h2>
                  <div className="space-y-3">
                    <div className="pl-3 border-l-2 border-teal-600">
                      <p className="font-bold text-sm text-gray-900">
                        {section.content.title || section.content.name}
                        {section.content.link && (
                          <> • <a href={section.content.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline text-xs">{section.content.linkText || 'Link'}</a></>
                        )}
                      </p>
                      {section.content.description && (
                        <p className="text-xs text-gray-700 mt-1 leading-relaxed">{section.content.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            case 'custom':
              return (
                <div key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
                    <div className="w-1 h-5 bg-teal-600 mr-3"></div>
                    {section.content.title || 'ADDITIONAL INFO'}
                  </h2>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {section.content.content || section.content.text}
                  </p>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ModernTemplate;
