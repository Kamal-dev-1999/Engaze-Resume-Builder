import React from 'react';
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";
import { logTemplateData, detectHardcodedContent, logSectionSorting } from "../../utils/debugLogger";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface MinimalistTemplateProps {
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

const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({ resumeTitle, sections }) => {
  // Sort sections by order property to respect custom section ordering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Enable debugging by setting this to true
  const DEBUG_MODE = false;

  // Log template data for debugging
  React.useEffect(() => {
    if (DEBUG_MODE) {
      console.log('%c🎯 MinimalistTemplate Loaded', 'color: #0066cc; font-size: 16px; font-weight: bold;');
      logTemplateData('MinimalistTemplate', sections, sortedSections);
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
    <div className="w-full bg-white p-4 md:p-6 lg:p-8 font-['Segoe UI'] text-gray-900">
      <div className="max-w-full space-y-6">
        {sortedSections.map((section) => {
          switch(section.type) {
            case 'contact':
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  {section.content.name && (
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-1">{section.content.name}</h1>
                  )}
                  {section.content.title && (
                    <p className="text-sm text-gray-700 tracking-wide font-semibold mb-3">{section.content.title}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                    {section.content.phone && <span className="font-medium">{section.content.phone}</span>}
                    {section.content.email && (
                      <>
                        {section.content.phone && <span>·</span>}
                        <a href={`mailto:${section.content.email}`} className="text-blue-700 hover:text-blue-900 font-medium">
                          {section.content.email}
                        </a>
                      </>
                    )}
                    {(section.content.address || section.content.location) && (
                      <>
                        <span>·</span>
                        <span>{section.content.address || section.content.location}</span>
                      </>
                    )}
                    {section.content.linkedin && (
                      <>
                        <span>·</span>
                        <a href={section.content.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 font-medium">
                          LinkedIn
                        </a>
                      </>
                    )}
                    {section.content.website && (
                      <>
                        <span>·</span>
                        <a href={section.content.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 font-medium">
                          Portfolio
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            case 'summary':
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  <p className="text-sm leading-relaxed text-gray-700">{section.content.text}</p>
                </div>
              );
            case 'experience':
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-sm text-gray-900">{section.content.title}</p>
                        {section.content.startDate && section.content.endDate && (
                          <span className="text-xs text-gray-600 font-medium">{section.content.startDate} – {section.content.endDate}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 font-semibold mb-2">{section.content.company}</p>
                      {section.content.description && (
                        <ul className="text-sm text-gray-700 space-y-1.5 mt-2">
                          {section.content.description.split('\n').map((line: string, idx: number) => (
                            line.trim() && (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2.5 text-gray-500">—</span>
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
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {section.content.items && section.content.items.length > 0 ? (
                      section.content.items.map((edu: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-sm text-gray-900">{edu.degree}</p>
                            {edu.start_date && edu.end_date && (
                              <span className="text-xs text-gray-600 font-medium">{edu.start_date} – {edu.end_date}</span>
                            )}
                            {edu.startDate && edu.endDate && (
                              <span className="text-xs text-gray-600 font-medium">{edu.startDate} – {edu.endDate}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 font-semibold">{edu.institution}</p>
                          {edu.location && (
                            <p className="text-sm text-gray-700">{edu.location}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm text-gray-900">{section.content.degree}</p>
                          {section.content.start_date && section.content.end_date && (
                            <span className="text-xs text-gray-600 font-medium">{section.content.start_date} – {section.content.end_date}</span>
                          )}
                          {section.content.startDate && section.content.endDate && (
                            <span className="text-xs text-gray-600 font-medium">{section.content.startDate} – {section.content.endDate}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-semibold">{section.content.institution}</p>
                        {section.content.location && (
                          <p className="text-sm text-gray-700">{section.content.location}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            case 'skills':
              const skillsByCategory = formatSkillsByCategory(section.content.items || []);
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Skills
                  </h2>
                  <div className="text-sm text-gray-700 leading-relaxed space-y-2.5">
                    {Object.entries(skillsByCategory).length > 0 ? (
                      Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                        <p key={idx}>
                          <span className="font-bold text-gray-900">{getCategoryDisplayName(categoryId)}:</span>{" "}
                          <span className="text-gray-700">{skillList.join(", ")}</span>
                        </p>
                      ))
                    ) : typeof section.content.skills === 'string' ? (
                      <p>{section.content.skills}</p>
                    ) : (
                      <p className="text-gray-500">No skills added</p>
                    )}
                  </div>
                </div>
              );
            case 'projects':
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Projects
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-sm text-gray-900">
                        {section.content.title || section.content.name}
                        {section.content.link && (
                          <> • <a href={section.content.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-sm underline font-medium">{section.content.linkText || 'Link'}</a></>
                        )}
                      </p>
                      {section.content.description && (
                        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{section.content.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            case 'custom':
              return (
                <div key={section.id} className="pb-5 border-b-2 border-gray-300">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {section.content.title || 'Additional Information'}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
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

export default MinimalistTemplate;
