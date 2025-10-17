import React from 'react';

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
  const contactSection = sections.find(s => s.type === 'contact')?.content || {};
  const summarySection = sections.find(s => s.type === 'summary')?.content || {};
  const educationSections = sections.filter(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills')?.content || {};
  const experienceSections = sections.filter(s => s.type === 'experience');
  const projectSections = sections.filter(s => s.type === 'projects');

  return (
    <div className="w-full h-full bg-white p-8 font-sans">
      <div className="max-w-full">
        {/* Minimal Header */}
        <div className="mb-6">
          {contactSection.name && (
            <h1 className="text-2xl font-light tracking-widest text-gray-900">{contactSection.name}</h1>
          )}
          {contactSection.title && (
            <p className="text-sm text-gray-600 tracking-wide mt-1">{contactSection.title}</p>
          )}
          
          {/* Contact Details - Single Line */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-3">
            {contactSection.phone && <span>{contactSection.phone}</span>}
            {contactSection.email && (
              <>
                {contactSection.phone && <span>·</span>}
                <a href={`mailto:${contactSection.email}`} className="hover:text-gray-900">
                  {contactSection.email}
                </a>
              </>
            )}
            {(contactSection.address || contactSection.location) && (
              <>
                <span>·</span>
                <span>{contactSection.address || contactSection.location}</span>
              </>
            )}
            {contactSection.linkedin && (
              <>
                <span>·</span>
                <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                  LinkedIn
                </a>
              </>
            )}
            {contactSection.website && (
              <>
                <span>·</span>
                <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                  Portfolio
                </a>
              </>
            )}
          </div>
        </div>

        {/* Minimal Separator */}
        <div className="h-px bg-gray-200 mb-6"></div>

        {/* Summary */}
        {summarySection.text && (
          <div className="mb-6">
            <p className="text-xs leading-relaxed text-gray-700">{summarySection.text}</p>
          </div>
        )}

        {/* Experience */}
        {experienceSections.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {experienceSections.map((section) => {
                const exp = section.content;
                return (
                  <div key={section.id}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm text-gray-900">{exp.title}</p>
                      {exp.startDate && exp.endDate && (
                        <span className="text-xs text-gray-600">{exp.startDate} – {exp.endDate}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{exp.company}</p>
                    {exp.description && (
                      <ul className="text-xs text-gray-700 space-y-1 mt-2">
                        {exp.description.split('\n').map((line: string, idx: number) => (
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
                );
              })}
            </div>
            <div className="h-px bg-gray-200 my-6"></div>
          </div>
        )}

        {/* Education */}
        {educationSections.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {educationSections.map((section) => {
                const edu = section.content;
                return (
                  <div key={section.id}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm text-gray-900">{edu.degree}</p>
                      {edu.startDate && edu.endDate && (
                        <span className="text-xs text-gray-600">{edu.startDate} – {edu.endDate}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                  </div>
                );
              })}
            </div>
            <div className="h-px bg-gray-200 my-6"></div>
          </div>
        )}

        {/* Skills */}
        {skillsSection.items && skillsSection.items.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
              Skills
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              {skillsSection.items.join(' · ')}
            </p>
            <div className="h-px bg-gray-200 my-6"></div>
          </div>
        )}

        {/* Projects */}
        {projectSections.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
              Projects
            </h2>
            <div className="space-y-3">
              {projectSections.map((section) => {
                const proj = section.content;
                return (
                  <div key={section.id}>
                    <p className="font-semibold text-sm text-gray-900">
                      {proj.title}
                      {proj.link && (
                        <> • <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-xs underline">{proj.linkText || 'Link'}</a></>
                      )}
                    </p>
                    {proj.description && (
                      <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate;
