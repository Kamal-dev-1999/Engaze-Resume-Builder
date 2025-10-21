import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface DynamicTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

/**
 * Helper function to normalize section content into an array.
 * This ensures the component can render data whether it's stored
 * as a single object or an array of objects.
 */
const getItemsArray = (content: any): any[] => {
  if (!content) {
    return [];
  }
  // Data is already in the correct array format
  if (Array.isArray(content.items)) {
    return content.items;
  }
  // Data is a single object (the old format)
  // Check for common properties to ensure it's not empty
  if (content.title || content.degree || content.name || content.jobTitle) {
    return [content]; // Wrap the single object in an array
  }
  // No valid data found
  return [];
};

const DynamicTemplate: React.FC<DynamicTemplateProps> = ({
  sections,
}) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const contactSection = sections.find((s) => s.type === "contact")?.content || {};

  // Helper function to apply formatting styles
  const getFormattingStyles = (formatting: any = {}) => {
    const style: React.CSSProperties = {};
        
    if (formatting.textColor) style.color = formatting.textColor;
    if (formatting.backgroundColor && formatting.backgroundColor !== 'transparent') {
      style.backgroundColor = formatting.backgroundColor;
    }
    if (formatting.fontFamily) style.fontFamily = formatting.fontFamily;
    if (formatting.fontSize) style.fontSize = `${formatting.fontSize}px`;
    if (formatting.fontWeight) style.fontWeight = formatting.fontWeight as React.CSSProperties['fontWeight'];
    if (formatting.textAlign) style.textAlign = formatting.textAlign as React.CSSProperties['textAlign'];
    if (formatting.padding !== undefined && formatting.padding > 0) {
      style.padding = `${formatting.padding}px`;
    }
    if (formatting.margin !== undefined && formatting.margin > 0) {
      style.margin = `${formatting.margin}px`;
    }
    if (formatting.borderWidth && formatting.borderWidth > 0) {
      style.border = `${formatting.borderWidth}px solid ${formatting.borderColor || '#d1d5db'}`;
      if (formatting.borderRadius) style.borderRadius = `${formatting.borderRadius}px`;
    }
        
    return style;
  };

  return (
    <div className="w-full bg-white text-gray-900 p-4 md:p-6 font-['Inter'] leading-relaxed tracking-tight">
      <div className="max-w-[794px] mx-auto text-[12px]">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg px-6 md:px-8 py-6 md:py-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {contactSection.name && (
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {contactSection.name}
                </h1>
              )}
              {contactSection.title && (
                <p className="text-sm font-light opacity-90">{contactSection.title}</p>
              )}
            </div>
          </div>

          {/* Contact Bar */}
          <div className="mt-4 pt-4 border-t border-teal-400 space-y-1 text-xs">
            <div className="flex flex-wrap gap-4">
              {contactSection.phone && (
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{contactSection.phone}</span>
                </div>
              )}
              {contactSection.email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a href={`mailto:${contactSection.email}`} className="hover:opacity-80">
                    {contactSection.email}
                  </a>
                </div>
              )}
              {(contactSection.address || contactSection.location) && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{contactSection.address || contactSection.location}</span>
                </div>
              )}
            </div>
            {(contactSection.website || contactSection.linkedin) && (
              <div className="flex flex-wrap gap-6">
                {contactSection.website && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                      Website
                    </a>
                  </div>
                )}
                {contactSection.linkedin && (
                  <div className="flex items-center gap-2">
                    <span>💼</span>
                    <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content Sections - Direct Rendering */}
        <div className="space-y-4">
          {sortedSections.map((section) => {
            // Normalize data for sections that can have multiple items
            const items = getItemsArray(section.content);

            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Professional Summary
                      </h2>
                    </div>
                    <p className="text-gray-800 leading-tight bg-white px-4 py-3 rounded-lg border-l-4 border-teal-500 text-xs">
                      {section.content?.text || "Your professional summary"}
                    </p>
                  </section>
                );

              case "experience":
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Work Experience
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((exp: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-baseline gap-4 mb-1">
                              {/* Handle both 'title' and 'jobTitle' property names */}
                              <h3 className="text-xs font-bold text-gray-900">{exp.title || exp.jobTitle}</h3>
                              {exp.start_date && exp.end_date && (
                                <span className="text-gray-600 text-xs whitespace-nowrap">
                                  {exp.start_date} – {exp.end_date}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1 h-1 rounded-full bg-teal-500"></div>
                              <p className="text-gray-700 font-semibold text-xs">{exp.company}</p>
                            </div>
                            {exp.location && <p className="text-gray-600 text-xs mb-1 ml-2">{exp.location}</p>}
                            {exp.description && <p className="text-gray-800 text-xs leading-tight">{exp.description}</p>}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your work experience</p>
                      )}
                    </div>
                  </section>
                );

              case "education":
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Education
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((edu: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-0.5 text-xs">{edu.degree}</h3>
                            <p className="text-gray-700 font-semibold text-xs mb-0.5">{edu.institution}</p>
                            {edu.location && <p className="text-gray-600 text-xs mb-0.5">{edu.location}</p>}
                            {edu.start_date && edu.end_date && (
                              <p className="text-gray-600 text-xs">{edu.start_date} – {edu.end_date}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your education</p>
                      )}
                    </div>
                  </section>
                );

              case "skills":
                // Skills data structure is often just content.items
                const skillItems = section.content?.items || [];
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Skills
                      </h2>
                    </div>
                    {skillItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formatSkillsByCategory(skillItems)).map(([categoryId, skillList], idx) => (
                          <div key={idx} className="w-full">
                            <p className="text-xs font-semibold text-teal-700 mb-1">
                              {getCategoryDisplayName(categoryId)}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {(skillList as string[]).map((skill: string, sidx: number) => (
                                <span
                                  key={sidx}
                                  className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium border border-teal-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add your skills</p>
                    )}
                  </section>
                );

              case "languages":
                // Languages also often uses content.items
                const langItems = section.content?.items || [];
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Languages
                      </h2>
                    </div>
                    {langItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {langItems.map((lang: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium border border-teal-200"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add your languages</p>
                    )}
                  </section>
                );

              case "projects":
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        Projects
                      </h2>
                    </div>
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((proj: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                            <h3 className="font-bold text-gray-900 text-xs mb-0.5">{proj.name || proj.title}</h3>
                            {proj.description && (
                              <p className="text-gray-800 text-xs leading-tight mb-1">{proj.description}</p>
                            )}
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:underline text-xs"
                              >
                                View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add your projects</p>
                    )}
                  </section>
                );

              case "custom":
                return (
                  <section key={section.id} style={getFormattingStyles(section.content?.formatting)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        {section.content?.title || 'Additional Information'}
                      </h2>
                    </div>
                    {section.content?.content || section.content?.text ? (
                      <p className="text-gray-800 text-xs leading-tight bg-white rounded-lg p-3 shadow-sm">
                        {section.content.content || section.content.text}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add custom content</p>
                    )}
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicTemplate;