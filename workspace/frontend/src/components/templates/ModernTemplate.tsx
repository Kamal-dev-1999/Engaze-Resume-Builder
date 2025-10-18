import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";

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

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeTitle, sections }) => {
  // Sort sections by order property to respect custom section ordering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

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
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 font-sans min-h-screen">
      <div className="max-w-full">
        {sortedSections.map((section) => {
          switch(section.type) {
            case 'contact':
              return (
                <div key={section.id} className="mb-8 pb-8 border-b-2 border-blue-500" style={getFormattingStyles(section.content?.formatting)}>
                  {section.content.name && (
                    <h1 className="text-4xl font-bold mb-2 text-blue-400">{section.content.name}</h1>
                  )}
                  {section.content.title && (
                    <p className="text-lg text-gray-300 mb-4">{section.content.title}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {section.content.phone && <span>{section.content.phone}</span>}
                    {section.content.email && (
                      <a href={`mailto:${section.content.email}`} className="text-blue-400 hover:underline">
                        {section.content.email}
                      </a>
                    )}
                    {(section.content.address || section.content.location) && (
                      <span>{section.content.address || section.content.location}</span>
                    )}
                    {section.content.linkedin && (
                      <a href={section.content.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {section.content.website && (
                      <a href={section.content.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              );
            case 'summary':
              return (
                <div key={section.id} className="mb-8" style={getFormattingStyles(section.content?.formatting)}>
                  <p className="text-gray-300 leading-relaxed text-sm">{section.content.text}</p>
                </div>
              );
            case 'experience':
              return (
                <div key={section.id} className="mb-8" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-blue-500">
                      <p className="font-bold text-lg text-white">{section.content.title}</p>
                      <p className="text-blue-400 text-sm font-semibold">{section.content.company}</p>
                      {section.content.startDate && section.content.endDate && (
                        <p className="text-xs text-gray-500 mb-2">{section.content.startDate} - {section.content.endDate}</p>
                      )}
                      {section.content.description && (
                        <ul className="text-sm text-gray-300 space-y-1 mt-2">
                          {section.content.description.split('\n').map((line: string, idx: number) => (
                            line.trim() && (
                              <li key={idx} className="flex items-start">
                                <span className="text-blue-500 mr-2">▸</span>
                                <span>{line.trim()}</span>
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
                <div key={section.id} className="mb-8" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    <div className="pl-4">
                      <p className="font-bold text-white">{section.content.degree}</p>
                      <p className="text-blue-400 text-sm">{section.content.institution}</p>
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
                <div key={section.id} className="mb-8" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                    SKILLS
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(skillsByCategory).length > 0 ? (
                      Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                        <div key={idx}>
                          <p className="text-sm font-semibold text-blue-300 mb-2">
                            {getCategoryDisplayName(categoryId)}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skillList.map((skill: string, sidx: number) => (
                              <span
                                key={sidx}
                                className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : typeof section.content.skills === 'string' ? (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
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
                <div key={section.id} className="mb-8" style={getFormattingStyles(section.content?.formatting)}>
                  <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                    PROJECTS
                  </h2>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-blue-500">
                      <p className="font-bold text-lg text-white">
                        {section.content.title}
                        {section.content.link && (
                          <> • <a href={section.content.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">{section.content.linkText || 'Link'}</a></>
                        )}
                      </p>
                      {section.content.description && (
                        <p className="text-sm text-gray-300 mt-1">{section.content.description}</p>
                      )}
                    </div>
                  </div>
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
