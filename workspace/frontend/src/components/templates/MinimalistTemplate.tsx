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
    <div className="w-full bg-white p-4 md:p-6 font-sans">
      <div className="max-w-full">
        {sortedSections.map((section) => {
          switch(section.type) {
            case 'contact':
              return (
                <div key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                  {section.content.name && (
                    <h1 className="text-xl font-light tracking-widest text-gray-900">{section.content.name}</h1>
                  )}
                  {section.content.title && (
                    <p className="text-xs text-gray-600 tracking-wide mt-0.5">{section.content.title}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
                    {section.content.phone && <span>{section.content.phone}</span>}
                    {section.content.email && (
                      <>
                        {section.content.phone && <span>·</span>}
                        <a href={`mailto:${section.content.email}`} className="hover:text-gray-900">
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
                        <a href={section.content.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                          LinkedIn
                        </a>
                      </>
                    )}
                    {section.content.website && (
                      <>
                        <span>·</span>
                        <a href={section.content.website} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                          Portfolio
                        </a>
                      </>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 mt-3 mb-3"></div>
                </div>
              );
            case 'summary':
              return (
                <div key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                  <p className="text-xs leading-tight text-gray-700">{section.content.text}</p>
                  <div className="h-px bg-gray-200 mt-3 mb-3"></div>
                </div>
              );
            case 'experience':
              return (
                <div key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-2">
                    Experience
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="font-semibold text-xs text-gray-900">{section.content.title}</p>
                        {section.content.startDate && section.content.endDate && (
                          <span className="text-xs text-gray-600">{section.content.startDate} – {section.content.endDate}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-0.5">{section.content.company}</p>
                      {section.content.description && (
                        <ul className="text-xs text-gray-700 space-y-0.5 mt-1">
                          {section.content.description.split('\n').map((line: string, idx: number) => (
                            line.trim() && (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">—</span>
                                <span>{line.trim()}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 my-3"></div>
                </div>
              );
            case 'education':
              return (
                <div key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-2">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {section.content.items && section.content.items.length > 0 ? (
                      section.content.items.map((edu: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="font-semibold text-xs text-gray-900">{edu.degree}</p>
                            {edu.start_date && edu.end_date && (
                              <span className="text-xs text-gray-600">{edu.start_date} – {edu.end_date}</span>
                            )}
                            {edu.startDate && edu.endDate && (
                              <span className="text-xs text-gray-600">{edu.startDate} – {edu.endDate}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{edu.institution}</p>
                          {edu.location && (
                            <p className="text-xs text-gray-600">{edu.location}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="font-semibold text-xs text-gray-900">{section.content.degree}</p>
                          {section.content.start_date && section.content.end_date && (
                            <span className="text-xs text-gray-600">{section.content.start_date} – {section.content.end_date}</span>
                          )}
                          {section.content.startDate && section.content.endDate && (
                            <span className="text-xs text-gray-600">{section.content.startDate} – {section.content.endDate}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{section.content.institution}</p>
                        {section.content.location && (
                          <p className="text-xs text-gray-600">{section.content.location}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 my-3"></div>
                </div>
              );
            case 'skills':
              const skillsByCategory = formatSkillsByCategory(section.content.items || []);
              return (
                <div key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-2">
                    Skills
                  </h2>
                  <div className="text-xs text-gray-700 leading-tight space-y-1">
                    {Object.entries(skillsByCategory).length > 0 ? (
                      Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                        <p key={idx}>
                          <span className="font-semibold">{getCategoryDisplayName(categoryId)}:</span>{" "}
                          {skillList.join(", ")}
                        </p>
                      ))
                    ) : typeof section.content.skills === 'string' ? (
                      <p>{section.content.skills}</p>
                    ) : (
                      <p>No skills added</p>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 my-6"></div>
                </div>
              );
            case 'projects':
              return (
                <div key={section.id} className="mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-2">
                    Projects
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-xs text-gray-900">
                        {section.content.title || section.content.name}
                        {section.content.link && (
                          <> • <a href={section.content.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-xs underline">{section.content.linkText || 'Link'}</a></>
                        )}
                      </p>
                      {section.content.description && (
                        <p className="text-xs text-gray-700 mt-0.5">{section.content.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 my-3"></div>
                </div>
              );
            case 'custom':
              return (
                <div key={section.id} className="mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-2">
                    {section.content.title || 'Additional Information'}
                  </h2>
                  <p className="text-xs text-gray-700 leading-tight">
                    {section.content.content || section.content.text}
                  </p>
                  <div className="h-px bg-gray-200 my-3"></div>
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
