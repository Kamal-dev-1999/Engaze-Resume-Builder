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
 * as a single object, a correct array, or the incorrect string "["
 */
const getItemsArray = (content: any): any[] => {
  if (!content) {
    return [];
  }

  // 1. Data is already in the correct array format
  if (Array.isArray(content.items)) {
    // BUT check if items is EMPTY and real data exists in flat fields
    if (content.items.length === 0) {
      // Check if there's real data in flat fields (education) FIRST
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
    
    // Items array has data - check for mixed format (items with placeholder + real data in flat fields)
    const firstItem = content.items[0];
    
    // For experience: check if items has placeholder "Job Title" but real data in flat fields
    if (firstItem?.title === "Job Title" && (content.title !== "Job Title" && content.title)) {
      return [{
        title: content.title || firstItem.title,
        company: content.company || firstItem.company,
        location: content.location || firstItem.location,
        start_date: content.start_date || firstItem.start_date,
        end_date: content.end_date || firstItem.end_date,
        description: content.description || firstItem.description,
        jobTitle: content.jobTitle || firstItem.jobTitle
      }];
    }
    
    // For education: check if items has placeholder "Degree" but real data in flat fields
    if (firstItem?.degree === "Degree" && (content.degree !== "Degree" && content.degree)) {
      return [{
        degree: content.degree || firstItem.degree,
        institution: content.institution || firstItem.institution,
        location: content.location || firstItem.location,
        start_date: content.start_date || firstItem.start_date,
        end_date: content.end_date || firstItem.end_date,
        fieldOfStudy: content.fieldOfStudy || firstItem.fieldOfStudy,
        gpa: content.gpa || firstItem.gpa
      }];
    }
    
    // Normal case - items array has real data
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
  
  // Check for experience fields (after projects)
  if (content.title || content.jobTitle || content.company) {
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

  // 4. No valid data found
  return [];
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
            // Normalize data for sections that can have multiple items
            const items = getItemsArray(section.content);
            // Skills uses getItemsArray too for consistency
            const skillItems = getItemsArray(section.content);
            
            // DEBUG: Log what data we're working with
            if (section.type === 'experience' || section.type === 'education') {
              console.log(`[ExecutiveTemplate] ${section.type}:`, { 
                section_id: section.id,
                items_count: items.length,
                items: items,
                raw_content: section.content
              });
            }
            
            if (section.type === 'education') {
              console.log(`[Education Debug] Items extracted:`, items);
              console.log(`[Education Debug] Raw content keys:`, Object.keys(section.content));
            }
            
            if (section.type === 'projects') {
              console.log(`[Projects Debug] Raw content:`, section.content);
              console.log(`[Projects Debug] Items extracted:`, items);
              console.log(`[Projects Debug] Items[0]:`, items[0]);
            }

            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Professional Summary
                    </h2>
                    <p className="text-[12px] text-gray-800 leading-tight">
                      {section.content?.text || "Your professional summary"}
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
                      {items.length > 0 ? (
                        items.map((edu: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-[12px]">
                                {edu.degree}
                              </p>
                              <p className="text-xs text-gray-700 leading-tight">
                                {edu.institution}
                                {edu.location && (
                                  <> — {edu.location}</>
                                )}
                                {edu.fieldOfStudy && (
                                  <> • {edu.fieldOfStudy}</>
                                )}
                              </p>
                            </div>
                            <div className="text-xs text-gray-700 text-right whitespace-nowrap flex-shrink-0 leading-tight">
                              {(edu.start_date && edu.end_date) && (
                                <p>
                                  {edu.start_date} – {edu.end_date}
                                </p>
                              )}
                              {(edu.startDate && edu.endDate) && (
                                <p>
                                  {edu.startDate} – {edu.endDate}
                                </p>
                              )}
                              {edu.gpa && <p>GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your education</p>
                      )}
                    </div>
                  </section>
                );

              case "skills":
                const skillsByCategory = formatSkillsByCategory(skillItems);
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Skills
                    </h2>
                    <div className="text-[12px] text-gray-800 leading-tight space-y-1">
                      {skillItems.length > 0 ? (
                        Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                          <p key={idx}>
                            <span className="font-semibold">{getCategoryDisplayName(categoryId)}:</span>{" "}
                            {skillList.join(", ")}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your skills</p>
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
                      {items.length > 0 ? (
                        items.map((exp: any, idx: number) => (
                          <div key={idx}>
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="font-semibold text-[12px]">
                                  {exp.jobTitle || exp.title}
                                </p>
                                <p className="text-xs text-gray-700 leading-tight">
                                  {exp.company}
                                </p>
                              </div>
                              <div className="text-xs text-gray-700 text-right whitespace-nowrap flex-shrink-0">
                                {(exp.startDate && exp.endDate) && (
                                  <p>
                                    {exp.startDate} – {exp.endDate}
                                  </p>
                                )}
                                {(exp.start_date && exp.end_date) && (
                                  <p>
                                    {exp.start_date} – {exp.end_date}
                                  </p>
                                )}
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-[12px] text-gray-800 leading-tight pl-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                         <p className="text-gray-500 text-xs italic">Add your work experience</p>
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
                    <div className="space-y-2">
                      {items.length > 0 ? (
                        items.map((proj: any, idx: number) => (
                          <div key={idx} className="mb-2">
                            <div className="flex justify-between items-baseline gap-2">
                              <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-[12px]">
                                  {proj.name || proj.title}
                                </p>
                                {(proj.link || proj.url) && (
                                  <a
                                    href={proj.link || proj.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-[11px] whitespace-nowrap"
                                  >
                                    Link
                                  </a>
                                )}
                              </div>
                              <div className="flex gap-3 text-xs text-gray-600 whitespace-nowrap">
                                {(proj.start_date || proj.end_date) && (
                                  <p className="leading-tight">
                                    {proj.start_date && proj.end_date && `${proj.start_date} – ${proj.end_date}`}
                                    {proj.start_date && !proj.end_date && `${proj.start_date}`}
                                    {!proj.start_date && proj.end_date && `${proj.end_date}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="pl-2">
                              {proj.description && (
                                <p className="text-[12px] text-gray-700 leading-snug mt-1">
                                  {proj.description}
                                </p>
                              )}
                              {proj.technologies && (
                                <p className="text-xs text-gray-600 leading-tight mt-0.5">
                                  <span className="font-semibold">Tech:</span> {proj.technologies}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your projects</p>
                      )}
                    </div>
                  </section>
                );

              case "languages":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      Languages
                    </h2>
                    <div className="text-[12px] text-gray-800 leading-tight">
                      {items.length > 0 ? (
                        <p>{items.join(", ")}</p>
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add your languages</p>
                      )}
                    </div>
                  </section>
                );

              case "custom":
                return (
                  <section key={section.id} className="mb-2" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1 border-b border-gray-200">
                      {section.content?.title || 'Additional Information'}
                    </h2>
                    <div className="text-[12px] text-gray-800 leading-tight">
                      {section.content?.content || section.content?.text ? (
                         <p>{section.content.content || section.content.text}</p>
                      ) : (
                        <p className="text-gray-500 text-xs italic">Add custom content</p>
                      )}
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