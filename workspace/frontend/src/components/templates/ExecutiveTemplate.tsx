import React from "react";
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface ExecutiveTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({
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
    <div className="w-full h-full bg-white text-gray-900 font-['Calibri'] leading-relaxed min-h-screen">
      <div className="flex h-full min-h-screen">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-900 text-white p-8 space-y-8 min-h-screen">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
              Contact
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              {contactSection.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 min-w-fit">📱</span>
                  <span>{contactSection.phone}</span>
                </div>
              )}
              {contactSection.email && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 min-w-fit">✉️</span>
                  <a href={`mailto:${contactSection.email}`} className="hover:text-blue-400">
                    {contactSection.email}
                  </a>
                </div>
              )}
              {(contactSection.address || contactSection.location) && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 min-w-fit">📍</span>
                  <span>{contactSection.address || contactSection.location}</span>
                </div>
              )}
              {contactSection.website && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 min-w-fit">🌐</span>
                  <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                    {contactSection.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section from Sidebar */}
          {sortedSections.find((s) => s.type === "skills") && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
                Skills
              </h3>
              <div className="space-y-3">
                {Object.entries(formatSkillsByCategory(sortedSections.find((s) => s.type === "skills")?.content.items || [])).map(([categoryId, skillList], idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold text-gray-300 mb-2">
                      {getCategoryDisplayName(categoryId)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {skillList.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {sortedSections.find((s) => s.type === "languages") && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
                Languages
              </h3>
              <ul className="space-y-1 text-xs">
                {sortedSections
                  .find((s) => s.type === "languages")
                  ?.content.items.map((lang: any, idx: number) => (
                    <li key={idx}>• {lang}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8 space-y-6">
          {/* Header */}
          {contactSection.name && (
            <div className="mb-6 pb-4 border-b-2 border-gray-900">
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight mb-1">
                {contactSection.name}
              </h1>
              {contactSection.title && (
                <p className="text-sm text-gray-600 font-semibold">{contactSection.title}</p>
              )}
            </div>
          )}

          {/* Summary */}
          {sortedSections.find((s) => s.type === "summary") && (
            <section className="mb-6" style={getFormattingStyles(sortedSections.find((s) => s.type === "summary")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider mb-2 pb-2 border-b border-gray-300">
                Professional Summary
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                {sortedSections.find((s) => s.type === "summary")?.content.text}
              </p>
            </section>
          )}

          {/* Experience */}
          {sortedSections.find((s) => s.type === "experience") && (
            <section className="mb-6" style={getFormattingStyles(sortedSections.find((s) => s.type === "experience")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider mb-3 pb-2 border-b border-gray-300">
                Work Experience
              </h2>
              <div className="space-y-4">
                {sortedSections
                  .find((s) => s.type === "experience")
                  ?.content.items.map((exp: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-baseline gap-4 mb-1">
                        <div className="font-bold text-gray-900">{exp.title}</div>
                        {exp.start_date && exp.end_date && (
                          <span className="text-gray-600 whitespace-nowrap">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 mb-2">{exp.company}</div>
                      <p className="text-gray-700 leading-relaxed text-xs">{exp.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {sortedSections.find((s) => s.type === "education") && (
            <section style={getFormattingStyles(sortedSections.find((s) => s.type === "education")?.content?.formatting)}>
              <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider mb-3 pb-2 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-3">
                {sortedSections
                  .find((s) => s.type === "education")
                  ?.content.items.map((edu: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <div className="font-bold text-gray-900">{edu.degree}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                      {edu.start_date && edu.end_date && (
                        <div className="text-gray-600 text-xs">
                          {edu.start_date} - {edu.end_date}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
