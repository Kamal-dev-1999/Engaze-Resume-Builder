import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";
import { logTemplateData, detectHardcodedContent, logSectionSorting } from "../../utils/debugLogger";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface ProfessionalTemplateProps {
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

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
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
      console.log('%c🎯 ProfessionalTemplate Loaded', 'color: #0066cc; font-size: 16px; font-weight: bold;');
      logTemplateData('ProfessionalTemplate', sections, sortedSections);
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
    <div className="w-full bg-white text-gray-900 p-4 md:p-6 font-['Inter'] leading-relaxed tracking-tight">
      <div className="max-w-[794px] mx-auto text-[12px]">
        {/* Header - Contact Section */}
        <header className="border-b-2 border-gray-400 pb-3 mb-4 text-center">
          {contactSection.name && (
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight mb-2">
              {contactSection.name}
            </h1>
          )}
          <div className="text-xs text-gray-700 space-y-0.5">
            {/* Contact Details Row 1 */}
            <div className="flex flex-wrap justify-center gap-2 text-[11px]">
              {contactSection.phone && (
                <span className="inline-block">{contactSection.phone}</span>
              )}
              {contactSection.email && (
                <>
                  {contactSection.phone && <span className="inline-block">•</span>}
                  <a
                    href={`mailto:${contactSection.email}`}
                    className="text-blue-600 hover:underline inline-block"
                  >
                    {contactSection.email}
                  </a>
                </>
              )}
              {(contactSection.address || contactSection.location) && (
                <>
                  {(contactSection.phone || contactSection.email) && <span className="inline-block">•</span>}
                  <span className="inline-block">{contactSection.address || contactSection.location}</span>
                </>
              )}
            </div>
            
            {/* Contact Details Row 2 */}
            <div className="flex flex-wrap justify-center gap-3 text-[12px]">
              {contactSection.linkedin && (
                <a
                  href={contactSection.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-block"
                >
                  LinkedIn
                </a>
              )}
              {contactSection.website && (
                <>
                  {contactSection.linkedin && <span className="inline-block">•</span>}
                  <a
                    href={contactSection.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-block"
                  >
                    Portfolio
                  </a>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Sections */}
        <main className="space-y-2">
          {sortedSections.map((section) => {
            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Professional Summary
                    </h2>
                    <p className="text-[12px] text-gray-800 leading-tight">
                      {section.content.text}
                    </p>
                  </section>
                );

              case "education":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Education
                    </h2>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[12px]">
                            {section.content.degree}
                          </p>
                          <p className="text-xs text-gray-700 leading-tight">
                            {section.content.institution}
                            {section.content.location && (
                              <> — {section.content.location}</>
                            )}
                            {section.content.fieldOfStudy && (
                              <> • {section.content.fieldOfStudy}</>
                            )}
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 text-right whitespace-nowrap flex-shrink-0 leading-tight">
                          {section.content.start_date && section.content.end_date && (
                            <p>
                              {section.content.start_date} – {section.content.end_date}
                            </p>
                          )}
                          {section.content.startDate && section.content.endDate && (
                            <p>
                              {section.content.startDate} – {section.content.endDate}
                            </p>
                          )}
                          {section.content.gpa && <p>GPA: {section.content.gpa}</p>}
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case "skills":
                const skillsByCategory = formatSkillsByCategory(section.content.items || []);
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Skills
                    </h2>
                    <div className="text-[12px] text-gray-800 leading-tight space-y-1">
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
                        <p className="text-gray-500">No skills added</p>
                      )}
                    </div>
                  </section>
                );

              case "experience":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Work Experience
                    </h2>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[12px]">
                            {section.content.jobTitle}
                          </p>
                          <p className="text-xs text-gray-700 leading-tight">
                            {section.content.company}
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 text-right whitespace-nowrap flex-shrink-0">
                          {section.content.startDate && section.content.endDate && (
                            <p>
                              {section.content.startDate} – {section.content.endDate}
                            </p>
                          )}
                        </div>
                      </div>
                      {section.content.description && (
                        <p className="text-[12px] text-gray-800 leading-tight pl-2">
                          {section.content.description}
                        </p>
                      )}
                    </div>
                  </section>
                );

              case "projects":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Projects
                    </h2>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[12px]">
                            {section.content.name}
                            {section.content.link && (
                              <a
                                href={section.content.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline text-xs ml-2"
                              >
                                (Link)
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                      {section.content.description && (
                        <p className="text-[12px] text-gray-800 leading-tight pl-2">
                          {section.content.description}
                        </p>
                      )}
                    </div>
                  </section>
                );

              case "custom":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      {section.content.title || 'Additional Information'}
                    </h2>
                    <div className="text-[12px] text-gray-800 leading-tight">
                      <p>{section.content.content || section.content.text}</p>
                    </div>
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

export default ProfessionalTemplate;
