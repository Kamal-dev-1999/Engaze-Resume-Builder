import React from 'react';

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
  const contactSection = sections.find(s => s.type === 'contact')?.content || {};
  const summarySection = sections.find(s => s.type === 'summary')?.content || {};
  const educationSections = sections.filter(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills')?.content || {};
  const experienceSections = sections.filter(s => s.type === 'experience');
  const projectSections = sections.filter(s => s.type === 'projects');

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 font-sans">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8 pb-8 border-b-2 border-blue-500">
          {contactSection.name && (
            <h1 className="text-4xl font-bold mb-2 text-blue-400">{contactSection.name}</h1>
          )}
          {contactSection.title && (
            <p className="text-lg text-gray-300 mb-4">{contactSection.title}</p>
          )}
          
          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {contactSection.phone && <span>{contactSection.phone}</span>}
            {contactSection.email && (
              <a href={`mailto:${contactSection.email}`} className="text-blue-400 hover:underline">
                {contactSection.email}
              </a>
            )}
            {(contactSection.address || contactSection.location) && (
              <span>{contactSection.address || contactSection.location}</span>
            )}
            {contactSection.linkedin && (
              <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            )}
            {contactSection.website && (
              <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {summarySection.text && (
          <div className="mb-8">
            <p className="text-gray-300 leading-relaxed text-sm">{summarySection.text}</p>
          </div>
        )}

        {/* Experience */}
        {experienceSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experienceSections.map((section) => {
                const exp = section.content;
                return (
                  <div key={section.id} className="pl-4 border-l-2 border-blue-500">
                    <p className="font-bold text-lg text-white">{exp.title}</p>
                    <p className="text-blue-400 text-sm font-semibold">{exp.company}</p>
                    {exp.startDate && exp.endDate && (
                      <p className="text-xs text-gray-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                    )}
                    {exp.description && (
                      <ul className="text-sm text-gray-300 space-y-1 mt-2">
                        {exp.description.split('\n').map((line: string, idx: number) => (
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
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {educationSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              EDUCATION
            </h2>
            <div className="space-y-3">
              {educationSections.map((section) => {
                const edu = section.content;
                return (
                  <div key={section.id} className="pl-4">
                    <p className="font-bold text-white">{edu.degree}</p>
                    <p className="text-blue-400 text-sm">{edu.institution}</p>
                    {edu.startDate && edu.endDate && (
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills */}
        {skillsSection.items && skillsSection.items.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsSection.items.map((skill: string, idx: number) => (
                <span key={idx} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projectSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 mr-3"></div>
              PROJECTS
            </h2>
            <div className="space-y-4">
              {projectSections.map((section) => {
                const proj = section.content;
                return (
                  <div key={section.id} className="pl-4 border-l-2 border-blue-500">
                    <p className="font-bold text-lg text-white">
                      {proj.title}
                      {proj.link && (
                        <> • <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">{proj.linkText || 'Link'}</a></>
                      )}
                    </p>
                    {proj.description && (
                      <p className="text-sm text-gray-300 mt-1">{proj.description}</p>
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

export default ModernTemplate;
