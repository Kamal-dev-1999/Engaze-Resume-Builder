import React from "react";

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

  return (
    <div className="w-full h-full bg-white text-gray-900 p-10 font-['Inter'] leading-relaxed tracking-tight">
      <div className="max-w-[800px] mx-auto text-[13px]">
        {/* Header */}
        <header className="border-b border-gray-300 pb-3 mb-6 text-center">
          {contactSection.name && (
            <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide">
              {contactSection.name}
            </h1>
          )}
          <div className="text-xs text-gray-700 mt-2 flex flex-wrap justify-center gap-2">
            {contactSection.phone && <span>{contactSection.phone}</span>}
            {contactSection.email && (
              <>
                <span>•</span>
                <a
                  href={`mailto:${contactSection.email}`}
                  className="text-blue-700 hover:underline"
                >
                  {contactSection.email}
                </a>
              </>
            )}
            {(contactSection.address || contactSection.location) && (
              <>
                <span>•</span>
                <span>{contactSection.address || contactSection.location}</span>
              </>
            )}
            {contactSection.linkedin && (
              <>
                <span>•</span>
                <a
                  href={contactSection.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  LinkedIn
                </a>
              </>
            )}
            {contactSection.website && (
              <>
                <span>•</span>
                <a
                  href={contactSection.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Portfolio
                </a>
              </>
            )}
          </div>
        </header>

        {/* Sections */}
        <main className="space-y-3">
          {sortedSections.map((section) => {
            switch (section.type) {
              case "summary":
                return (
                  <section key={section.id} className="mb-4">
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
                  <section key={section.id} className="mb-4">
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
                return (
                  <section key={section.id} className="mb-4">
                    <h2 className="text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2 border-b border-gray-200">
                      Skills
                    </h2>
                    <p className="text-[13px] text-gray-800 leading-relaxed">
                      {section.content.skills}
                    </p>
                  </section>
                );

              case "experience":
                return (
                  <section key={section.id} className="mb-4">
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
                  <section key={section.id} className="mb-4">
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
