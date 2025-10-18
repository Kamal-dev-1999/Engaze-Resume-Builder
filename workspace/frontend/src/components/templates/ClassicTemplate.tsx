import React from "react";

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

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
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
    <div className="w-full h-full bg-white text-gray-900 p-12 font-['Georgia'] leading-relaxed">
      <div className="max-w-[850px] mx-auto text-[13px]">
        {/* Header */}
        <header className="text-center mb-8 pb-6 border-b-4 border-gray-800">
          {contactSection.name && (
            <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              {contactSection.name}
            </h1>
          )}
          {contactSection.title && (
            <p className="text-lg text-gray-600 font-semibold mb-3">{contactSection.title}</p>
          )}
          
          {/* Contact Info */}
          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex flex-wrap justify-center gap-4 text-[12px]">
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
              <div className="flex flex-wrap justify-center gap-4 text-[12px]">
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
        <main className="space-y-5">
          {/* Summary */}
          {sortedSections.find((s) => s.type === "summary") && (
            <section className="mb-5" style={getFormattingStyles(sortedSections.find((s) => s.type === "summary")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2 pb-1 border-b-2 border-gray-800">
                Professional Summary
              </h2>
              <p className="text-[13px] text-gray-800 leading-relaxed italic">
                {sortedSections.find((s) => s.type === "summary")?.content.text}
              </p>
            </section>
          )}

          {/* Experience */}
          {sortedSections.find((s) => s.type === "experience") && (
            <section className="mb-5" style={getFormattingStyles(sortedSections.find((s) => s.type === "experience")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-3 pb-1 border-b-2 border-gray-800">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {sortedSections
                  .find((s) => s.type === "experience")
                  ?.content.items.map((exp: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline gap-4 mb-1">
                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                        {exp.start_date && exp.end_date && (
                          <span className="text-gray-600 text-xs whitespace-nowrap">
                            {exp.start_date} – {exp.end_date}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-semibold text-[12px] mb-1">{exp.company}</p>
                      {exp.location && <p className="text-gray-600 text-xs mb-1">{exp.location}</p>}
                      <p className="text-[13px] text-gray-800 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {sortedSections.find((s) => s.type === "education") && (
            <section className="mb-5" style={getFormattingStyles(sortedSections.find((s) => s.type === "education")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-3 pb-1 border-b-2 border-gray-800">
                Education
              </h2>
              <div className="space-y-3">
                {sortedSections
                  .find((s) => s.type === "education")
                  ?.content.items.map((edu: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        {edu.start_date && edu.end_date && (
                          <span className="text-gray-600 text-xs whitespace-nowrap">
                            {edu.start_date} – {edu.end_date}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-semibold text-[12px]">{edu.institution}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {sortedSections.find((s) => s.type === "skills") && (
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2 pb-1 border-b-2 border-gray-800">
                Core Competencies
              </h2>
              <p className="text-[13px] text-gray-800 leading-relaxed">
                {sortedSections
                  .find((s) => s.type === "skills")
                  ?.content.items.map((skill: any) => typeof skill === 'string' ? skill : skill.name || skill).join(" • ")}
              </p>
            </section>
          )}

          {/* Languages */}
          {sortedSections.find((s) => s.type === "languages") && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-2 pb-1 border-b-2 border-gray-800">
                Languages
              </h2>
              <p className="text-[13px] text-gray-800">
                {sortedSections
                  .find((s) => s.type === "languages")
                  ?.content.items.join(", ")}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClassicTemplate;
