import React from 'react';

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

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ resumeTitle, sections }) => {
  const contactSection = sections.find(s => s.type === 'contact')?.content || {};
  const summarySection = sections.find(s => s.type === 'summary')?.content || {};
  const educationSections = sections.filter(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills')?.content || {};
  const experienceSections = sections.filter(s => s.type === 'experience');
  const projectSections = sections.filter(s => s.type === 'projects');

  const ContactHeader = () => (
    <div className="border-b border-gray-400 pb-2 mb-4">
      {/* Name */}
      {contactSection.name && (
        <h1 className="text-3xl font-bold tracking-tight">{contactSection.name}</h1>
      )}
      
      {/* Contact Details in one line */}
      <div className="text-xs text-gray-700 mt-1 flex flex-wrap gap-2 items-center">
        {contactSection.phone && (
          <span>{contactSection.phone}</span>
        )}
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
            <span>|</span>
            <span>{contactSection.address || contactSection.location}</span>
          </>
        )}
        {contactSection.linkedin && (
          <>
            <span>|</span>
            <a href={contactSection.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          </>
        )}
        {contactSection.website && (
          <>
            <span>|</span>
            <a href={contactSection.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Portfolio
            </a>
          </>
        )}
      </div>
    </div>
  );

  const SummarySection = () => {
    if (!summarySection.text) return null;
    return (
      <div className="mb-4">
        <p className="text-sm leading-relaxed text-gray-800">{summarySection.text}</p>
      </div>
    );
  };

  const EducationSection = () => {
    if (educationSections.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">
          ACADEMIC QUALIFICATIONS
        </h2>
        <div className="space-y-3">
          {educationSections.map((section) => {
            const edu = section.content;
            return (
              <div key={section.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-700">
                      {edu.institution} | {edu.fieldOfStudy}
                    </p>
                  </div>
                  <div className="text-xs text-gray-700 text-right whitespace-nowrap">
                    {edu.startDate && edu.endDate && (
                      <p>{edu.startDate} – {edu.endDate}</p>
                    )}
                    {edu.gpa && <p>GPA – {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const SkillsSection = () => {
    if (!skillsSection.items || skillsSection.items.length === 0) return null;
    
    // Group skills by category if available
    const skillsByCategory = skillsSection.categories ? 
      Object.entries(skillsSection.categories).map(([cat, skills]: [string, any]) => ({
        category: cat,
        skills: Array.isArray(skills) ? skills : []
      })) :
      [{ category: '', skills: skillsSection.items || [] }];

    return (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">
          SKILLS
        </h2>
        <div className="space-y-2">
          {skillsByCategory.map((group, idx) => {
            const skills = group.skills;
            if (!Array.isArray(skills)) return null;
            
            return (
              <div key={idx}>
                {group.category && (
                  <p className="font-bold text-xs mb-1">{group.category}:</p>
                )}
                <p className="text-xs text-gray-800">
                  {skills.join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ExperienceSection = () => {
    if (experienceSections.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">
          WORK EXPERIENCE
        </h2>
        <div className="space-y-3">
          {experienceSections.map((section) => {
            const exp = section.content;
            return (
              <div key={section.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{exp.title}</p>
                    <p className="text-xs text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-xs text-gray-700 text-right whitespace-nowrap ml-4">
                    {exp.startDate && exp.endDate && (
                      <p>{exp.startDate} - {exp.endDate}</p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <ul className="mt-1 text-xs text-gray-800 space-y-0.5 ml-4">
                    {exp.description.split('\n').map((line: string, idx: number) => (
                      line.trim() && (
                        <li key={idx} className="list-disc">
                          {line.trim()}
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
    );
  };

  const ProjectsSection = () => {
    if (projectSections.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">
          PROJECTS
        </h2>
        <div className="space-y-3">
          {projectSections.map((section) => {
            const proj = section.content;
            return (
              <div key={section.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-sm">
                      {proj.title}
                      {proj.link && (
                        <> – <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{proj.linkText || 'Link'}</a></>
                      )}
                    </p>
                  </div>
                  <div className="text-xs text-gray-700 text-right whitespace-nowrap ml-4">
                    {proj.date && <p>{proj.date}</p>}
                  </div>
                </div>
                {proj.description && (
                  <ul className="mt-1 text-xs text-gray-800 space-y-0.5 ml-4">
                    {proj.description.split('\n').map((line: string, idx: number) => (
                      line.trim() && (
                        <li key={idx} className="list-disc">
                          {line.trim()}
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
    );
  };

  return (
    <div className="w-full h-full bg-white text-gray-900 p-8 font-sans">
      <div className="max-w-full text-sm leading-relaxed">
        <ContactHeader />
        <SummarySection />
        <EducationSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
