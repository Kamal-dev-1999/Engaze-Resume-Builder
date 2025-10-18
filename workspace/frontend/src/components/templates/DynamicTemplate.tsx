import React from "react";

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

const DynamicTemplate: React.FC<DynamicTemplateProps> = ({
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900 font-['Segoe UI'] leading-relaxed">
      <div className="max-w-[900px] mx-auto">
        {/* Header with Accent */}
        <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-10 py-10 mb-8">
          <div className="flex justify-between items-start gap-8">
            <div>
              {contactSection.name && (
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  {contactSection.name}
                </h1>
              )}
              {contactSection.title && (
                <p className="text-lg font-light opacity-90">{contactSection.title}</p>
              )}
            </div>
          </div>

          {/* Contact Bar */}
          <div className="mt-6 pt-6 border-t border-teal-400 space-y-2 text-sm">
            <div className="flex flex-wrap gap-6">
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
                      {contactSection.website}
                    </a>
                  </div>
                )}
                {contactSection.linkedin && (
                  <div className="flex items-center gap-2">
                    <span>💼</span>
                    <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="px-10 pb-10 space-y-8">
          {/* Summary */}
          {sortedSections.find((s) => s.type === "summary") && (
            <section style={getFormattingStyles(sortedSections.find((s) => s.type === "summary")?.content?.formatting)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                  Professional Summary
                </h2>
              </div>
              <p className="text-gray-800 leading-relaxed bg-white px-6 py-4 rounded-lg border-l-4 border-teal-500">
                {sortedSections.find((s) => s.type === "summary")?.content.text}
              </p>
            </section>
          )}

          {/* Experience */}
          {sortedSections.find((s) => s.type === "experience") && (
            <section style={getFormattingStyles(sortedSections.find((s) => s.type === "experience")?.content?.formatting)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-4">
                {sortedSections
                  .find((s) => s.type === "experience")
                  ?.content.items.map((exp: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                        {exp.start_date && exp.end_date && (
                          <span className="text-gray-600 text-sm whitespace-nowrap">
                            {exp.start_date} – {exp.end_date}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <p className="text-gray-700 font-semibold">{exp.company}</p>
                      </div>
                      {exp.location && <p className="text-gray-600 text-sm mb-2 ml-3">{exp.location}</p>}
                      <p className="text-gray-800 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {sortedSections.find((s) => s.type === "education") && (
            <section style={getFormattingStyles(sortedSections.find((s) => s.type === "education")?.content?.formatting)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                  Education
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {sortedSections
                  .find((s) => s.type === "education")
                  ?.content.items.map((edu: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-1">{edu.degree}</h3>
                      <p className="text-gray-700 font-semibold text-sm mb-1">{edu.institution}</p>
                      {edu.start_date && edu.end_date && (
                        <p className="text-gray-600 text-sm">{edu.start_date} – {edu.end_date}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills & Languages in Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Skills */}
            {sortedSections.find((s) => s.type === "skills") && (
              <section style={getFormattingStyles(sortedSections.find((s) => s.type === "skills")?.content?.formatting)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                    Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedSections
                    .find((s) => s.type === "skills")
                    ?.content.items.map((skill: any, idx: number) => (
                      <span
                        key={idx}
                        className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-200"
                      >
                        {typeof skill === 'string' ? skill : skill.name || skill}
                      </span>
                    ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {sortedSections.find((s) => s.type === "languages") && (
              <section style={getFormattingStyles(sortedSections.find((s) => s.type === "languages")?.content?.formatting)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-400"></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                    Languages
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedSections
                    .find((s) => s.type === "languages")
                    ?.content.items.map((lang: any, idx: number) => (
                      <span
                        key={idx}
                        className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-200"
                      >
                        {lang}
                      </span>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTemplate;
