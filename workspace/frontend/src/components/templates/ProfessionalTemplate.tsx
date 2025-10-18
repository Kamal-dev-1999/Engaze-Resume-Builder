import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";

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

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
  resumeTitle,
  sections,
}) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const contactSection = sections.find((s) => s.type === "contact")?.content || {};

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
    <div className="w-full h-full bg-white text-gray-900 p-10 font-['Inter'] leading-relaxed tracking-tight">
      <div className="max-w-[800px] mx-auto text-[13px]">
        {/* Header - Contact Section */}
        <header className="border-b-2 border-gray-400 pb-4 mb-6 text-center">
          {contactSection.name && (
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-3">
              {contactSection.name}
            </h1>
          )}
          <div className="text-xs text-gray-700 space-y-1">
            {/* Contact Details Row 1 */}
            <div className="flex flex-wrap justify-center gap-3 text-[12px]">
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
        <main className="space-y-3">
          {sortedSections.map((section) => {
            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Professional Summary
                    </h2>
                    <p className="text-[13px] text-gray-800 leading-relaxed">
                      {section.content.text}
                    </p>
                  </section>
                );

              case "education":
                return (
                  <section key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Education
                    </h2>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[13px]">
                            {section.content.degree}
                          </p>
                          <p className="text-xs text-gray-700">
                            {section.content.institution}
                            {section.content.fieldOfStudy && (
                              <> — {section.content.fieldOfStudy}</>
                            )}
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 text-right whitespace-nowrap flex-shrink-0">
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
                  <section key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Skills
                    </h2>
                    <div className="text-[13px] text-gray-800 leading-relaxed space-y-1">
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
                  <section key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Work Experience
                    </h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[13px]">
                            {section.content.jobTitle}
                          </p>
                          <p className="text-xs text-gray-700">
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
                        <p className="text-[13px] text-gray-800 leading-relaxed pl-2">
                          {section.content.description}
                        </p>
                      )}
                    </div>
                  </section>
                );

              case "projects":
                return (
                  <section key={section.id} className="mb-4" style={getFormattingStyles(section.content?.formatting)}>
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Projects
                    </h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-[13px]">
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
                        <p className="text-[13px] text-gray-800 leading-relaxed pl-2">
                          {section.content.description}
                        </p>
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
