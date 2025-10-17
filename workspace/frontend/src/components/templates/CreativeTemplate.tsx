import React from 'react';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface CreativeTemplateProps {
  resumeTitle: string;
  sections: Section[];
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ resumeTitle, sections }) => {
  const contactSection = sections.find(s => s.type === 'contact')?.content || {};
  const summarySection = sections.find(s => s.type === 'summary')?.content || {};
  const educationSections = sections.filter(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills')?.content || {};
  const experienceSections = sections.filter(s => s.type === 'experience');
  const projectSections = sections.filter(s => s.type === 'projects');

  return (
    <div className="w-full h-full bg-white p-8 font-sans">
      <div className="max-w-full">
        {/* Colorful Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6 rounded-lg">
          {contactSection.name && (
            <h1 className="text-4xl font-bold mb-1">{contactSection.name}</h1>
          )}
          {contactSection.title && (
            <p className="text-lg opacity-90">{contactSection.title}</p>
          )}
          
          {/* Contact Details */}
          <div className="flex flex-wrap gap-3 text-sm mt-4 opacity-95">
            {contactSection.phone && <span>📱 {contactSection.phone}</span>}
            {contactSection.email && (
              <a href={`mailto:${contactSection.email}`} className="hover:underline">
                ✉️ {contactSection.email}
              </a>
            )}
            {(contactSection.address || contactSection.location) && (
              <span>📍 {contactSection.address || contactSection.location}</span>
            )}
            {contactSection.linkedin && (
              <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                🔗 LinkedIn
              </a>
            )}
            {contactSection.website && (
              <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                🌐 Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {summarySection.text && (
          <div className="mb-8 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p className="text-gray-700 leading-relaxed text-sm italic">{summarySection.text}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Skills */}
          <div>
            {skillsSection.items && skillsSection.items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-300">
                  💡 SKILLS
                </h2>
                <div className="space-y-2">
                  {skillsSection.items.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {educationSections.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-300">
                  🎓 EDUCATION
                </h2>
                <div className="space-y-3">
                  {educationSections.map((section) => {
                    const edu = section.content;
                    return (
                      <div key={section.id} className="text-sm">
                        <p className="font-bold text-gray-900">{edu.degree}</p>
                        <p className="text-purple-600 text-xs">{edu.institution}</p>
                        {edu.startDate && edu.endDate && (
                          <p className="text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="col-span-2">
            {/* Experience */}
            {experienceSections.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-300">
                  💼 WORK EXPERIENCE
                </h2>
                <div className="space-y-5">
                  {experienceSections.map((section) => {
                    const exp = section.content;
                    return (
                      <div key={section.id} className="border-l-4 border-pink-500 pl-4">
                        <p className="font-bold text-gray-900 text-base">{exp.title}</p>
                        <p className="text-pink-600 font-semibold text-sm">{exp.company}</p>
                        {exp.startDate && exp.endDate && (
                          <p className="text-gray-500 text-xs mb-2">{exp.startDate} - {exp.endDate}</p>
                        )}
                        {exp.description && (
                          <ul className="text-sm text-gray-700 space-y-1 mt-2">
                            {exp.description.split('\n').map((line: string, idx: number) => (
                              line.trim() && (
                                <li key={idx} className="flex items-start">
                                  <span className="text-pink-500 mr-2">★</span>
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

            {/* Projects */}
            {projectSections.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-300">
                  🚀 PROJECTS
                </h2>
                <div className="space-y-4">
                  {projectSections.map((section) => {
                    const proj = section.content;
                    return (
                      <div key={section.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                        <p className="font-bold text-gray-900">
                          {proj.title}
                          {proj.link && (
                            <> • <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm">{proj.linkText || 'Link'}</a></>
                          )}
                        </p>
                        {proj.description && (
                          <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
