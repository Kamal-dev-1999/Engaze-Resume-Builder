import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";
import { logTemplateData, detectHardcodedContent, logSectionSorting } from "../../utils/debugLogger";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface ClassicTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

/**
 * Helper function to normalize section content into an array.
 * This ensures the component can render data whether it's stored
 * as a single object, a correct array, or the incorrect string "["
 */
const getItemsArray = (content: any): any[] => {
  if (!content) {
    return [];
  }

  // 1. Data is already in the correct array format
  if (Array.isArray(content.items)) {
    return content.items;
  }
  
  // 2. FIX: Handle the specific bug where items is saved as the string "["
  if (content.items === "[") {
    return []; // Return an empty array because the data is corrupted
  }

  // 3. Handle the old format (single object)
  if (content.title || content.degree || content.name || content.jobTitle) {
    return [content]; // Wrap the single object in an array
  }

  // 4. No valid data found
  return [];
};

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
  resumeTitle,
  sections,
}) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const contactSection = sections.find((s) => s.type === "contact")?.content || {};

  // Enable debugging by setting this to true
  const DEBUG_MODE = false;

  // Log template data for debugging
  React.useEffect(() => {
    if (DEBUG_MODE) {
      console.log('%c🎯 ClassicTemplate Loaded', 'color: #0066cc; font-size: 16px; font-weight: bold;');
      logTemplateData('ClassicTemplate', sections, sortedSections);
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
    <div className="w-full bg-white text-gray-900 p-4 md:p-6 lg:p-8 font-['Georgia'] leading-relaxed">
      <div className="max-w-[794px] mx-auto">
        {/* Header */}
        <header className="text-center mb-4 pb-4 border-b-4 border-gray-800">
          {contactSection.name && (
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 tracking-tight">
              {contactSection.name}
            </h1>
          )}
          {contactSection.title && (
            <p className="text-sm text-gray-600 font-semibold mb-2">{contactSection.title}</p>
          )}
          
          {/* Contact Info */}
          <div className="text-xs text-gray-700 space-y-0.5">
            <div className="flex flex-wrap justify-center gap-3 text-[11px]">
              {contactSection.phone && <span>{contactSection.phone}</span>}
              {contactSection.email && (
                <>
                  {contactSection.phone && <span>|</span>}
                  <a href={`mailto:${contactSection.email}`} className="text-blue-600 hover:underline">
                    {contactSection.email}
                  </a>
                </>
              )}
              {(contactSection.address || contactSection.location) && (
                <>
                  {(contactSection.phone || contactSection.email) && <span>|</span>}
                  <span>{contactSection.address || contactSection.location}</span>
                </>
              )}
            </div>
            {(contactSection.website || contactSection.linkedin) && (
              <div className="flex flex-wrap justify-center gap-3 text-[11px]">
                {contactSection.website && (
                  <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {contactSection.website}
                  </a>
                )}
                {contactSection.linkedin && (
                  <>
                    {contactSection.website && <span>|</span>}
                    <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-3">
          {/* Render sections in sorted order using map */}
          {sortedSections.map((section) => {
            // Normalize data for sections that can have multiple items
            const items = getItemsArray(section.content);

            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-1 pb-0.5 border-b-2 border-gray-800">
                      Professional Summary
                    </h2>
                    <p className="text-[12px] text-gray-800 leading-tight italic">
                      {section.content?.text || "Your professional summary"}
                    </p>
                  </section>
                );
              case "experience":
                return (
                  <section key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 pb-0.5 border-b-2 border-gray-800">
                      Professional Experience
                    </h2>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((exp: any, idx: number) => (
                          <div key={idx}>
                            <div className="flex justify-between items-baseline gap-4 mb-0.5">
                              <h3 className="font-bold text-gray-900">{exp.title || exp.jobTitle}</h3>
                              {exp.start_date && exp.end_date && (
                                <span className="text-gray-600 text-xs whitespace-nowrap">
                                  {exp.start_date} – {exp.end_date}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 font-semibold text-[11px] mb-0.5">{exp.company}</p>
                            {exp.location && <p className="text-gray-600 text-xs mb-0.5">{exp.location}</p>}
                            <p className="text-[12px] text-gray-800 leading-tight">{exp.description}</p>
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
                  <section key={section.id} className="mb-3" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 pb-0.5 border-b-2 border-gray-800">
                      Education
                    </h2>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((edu: any, idx: number) => (
                          <div key={idx}>
                            <div className="flex justify-between items-baseline gap-4">
                              <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                              {edu.start_date && edu.end_date && (
                                <span className="text-gray-600 text-xs whitespace-nowrap">
                                  {edu.start_date} – {edu.end_date}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 font-semibold text-[11px]">{edu.institution}</p>
                            {edu.location && (
                              <p className="text-gray-600 text-xs">{edu.location}</p>
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
                // Skills and Languages are expected to always be in an 'items' array
                // The helper function `getItemsArray` is not needed here as 'skills' is a different structure.
                // We just need to check if 'content.items' is a valid array.
                const skillItems = Array.isArray(section.content?.items) ? section.content.items : [];
                return (
                  <section key={section.id} className="mb-3">
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-1 pb-0.5 border-b-2 border-gray-800">
                      Core Competencies
                    </h2>
                    {skillItems.length > 0 ? (
                      <p className="text-[12px] text-gray-800 leading-tight space-y-1">
                        {Object.entries(formatSkillsByCategory(skillItems)).map(([categoryId, skillList], idx) => (
                          <span key={idx} className="block">
                            <span className="font-semibold">{getCategoryDisplayName(categoryId)}:</span>{" "}
                            {skillList.join(", ")}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add your skills</p>
                    )}
                  </section>
                );
              case "languages":
                const langItems = Array.isArray(section.content?.items) ? section.content.items : [];
                return (
                  <section key={section.id} className="mb-3">
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-1 pb-0.5 border-b-2 border-gray-800">
                      Languages
                    </h2>
                    {langItems.length > 0 ? (
                      <p className="text-[12px] text-gray-800">
                        {langItems.join(", ")}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs italic">Add your languages</p>
                    )}
                  </section>
                );
              case "projects":
                return (
                  <section key={section.id} className="mb-3">
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 pb-0.5 border-b-2 border-gray-800">
                      Projects
                    </h2>
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((proj: any, idx: number) => (
                          <div key={idx}>
                            <h3 className="font-bold text-gray-900">{proj.name || proj.title}</h3>
                            {proj.description && <p className="text-[12px] text-gray-800 leading-tight">{proj.description}</p>}
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                {proj.linkText || 'View Project'}
                              </a>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your projects</p>
                      )}
                    </div>
                  </section>
                );
              case "custom":
                return (
                  <section key={section.id} className="mb-3">
                    <h2 className="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 pb-0.5 border-b-2 border-gray-800">
                      {section.content?.title || 'Additional Information'}
                    </h2>
                    {section.content?.content || section.content?.text ? (
                      <p className="text-[12px] text-gray-800 leading-tight">
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
        </main>
      </div>
    </div>
  );
};

export default ClassicTemplate;