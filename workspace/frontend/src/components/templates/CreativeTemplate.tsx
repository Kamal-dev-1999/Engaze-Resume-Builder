import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Upload, X } from 'lucide-react';
import { formatSkillsByCategory, getCategoryDisplayName } from "../../utils/skillFormatter";

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
  // keep flexible ordering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  const contact = sortedSections.find(s => s.type === 'contact')?.content || {};

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => setTempPhoto(null);

  // allocate sections to left/right columns but preserve relative order within each column
  const leftTypes = ['experience', 'projects', 'education'];
  const rightTypes = ['skills', 'summary'];

  const leftSections = sortedSections.filter(s => leftTypes.includes(s.type));
  const rightSections = sortedSections.filter(s => rightTypes.includes(s.type));

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 font-sans p-6">
      {/* Header - subtle orange band with name + photo */}
      <div className="max-w-5xl mx-auto bg-white shadow-sm">
        <div className="bg-orange-500 text-white rounded-t-md px-8 py-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            {contact.name && <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{contact.name}</h1>}
            {contact.tagline || contact.title ? (
              <p className="mt-2 text-sm md:text-base opacity-90">{contact.tagline || contact.title}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-4 text-sm opacity-95">
              {contact.phone && <div className="flex items-center gap-2"><Phone size={14} /> <span>{contact.phone}</span></div>}
              {contact.email && <a className="flex items-center gap-2" href={`mailto:${contact.email}`}><Mail size={14} /> <span>{contact.email}</span></a>}
              {contact.linkedin && <a className="flex items-center gap-2" href={contact.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /> <span>LinkedIn</span></a>}
              {contact.website && <a className="flex items-center gap-2" href={contact.website} target="_blank" rel="noreferrer"><Globe size={14} /> <span>Portfolio</span></a>}
              {(contact.address || contact.location) && <div className="flex items-center gap-2"><MapPin size={14} /> <span>{contact.address || contact.location}</span></div>}
            </div>
          </div>

          {/* Photo */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-md bg-white/20 overflow-hidden flex-shrink-0 relative group">
            {tempPhoto || contact.photo ? (
              <>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img src={tempPhoto || contact.photo} alt="profile photo" className="w-full h-full object-cover" />
                {tempPhoto && (
                  <button
                    onClick={clearPhoto}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    title="Remove photo"
                  >
                    <X size={14} />
                  </button>
                )}
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition text-white/80 hover:text-white">
                <Upload size={20} />
                <span className="text-xs mt-1 text-center px-1 font-medium">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Content area: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-8">
          {/* Left / Main column (2/3) */}
          <div className="md:col-span-2 space-y-6">
            {leftSections.map((section) => {
              switch(section.type) {
                case 'experience':
                  return (
                    <div key={section.id} className="pb-4 border-b" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-xl font-semibold text-gray-900">{section.content.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                        <div>{section.content.company}</div>
                        <div className="whitespace-nowrap">{section.content.startDate && section.content.endDate ? `${section.content.startDate} – ${section.content.endDate}` : ''}</div>
                      </div>
                      {section.content.description && (
                        <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-1">
                          {section.content.description.split('\n').map((line: string, idx: number) => line.trim() ? <li key={idx}>{line.trim()}</li> : null)}
                        </ul>
                      )}
                    </div>
                  );

                case 'projects':
                  return (
                    <div key={section.id} className="pb-4 border-b" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-semibold text-gray-900">{section.content.title}</h3>
                      {section.content.date && <div className="text-sm text-gray-600 mt-1">{section.content.date}</div>}
                      {section.content.description && <p className="mt-2 text-sm text-gray-700">{section.content.description}</p>}
                      {section.content.link && <a href={section.content.link} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-orange-600 underline">{section.content.linkText || 'View project'}</a>}
                    </div>
                  );

                case 'education':
                  return (
                    <div key={section.id} className="pb-4 border-b" style={getFormattingStyles(section.content?.formatting)}>
                      <h3 className="text-lg font-semibold text-gray-900">{section.content.degree}</h3>
                      <div className="text-sm text-gray-600">{section.content.institution}{section.content.fieldOfStudy ? ` — ${section.content.fieldOfStudy}` : ''}</div>
                      {section.content.startDate && section.content.endDate && <div className="text-sm text-gray-600 mt-1">{section.content.startDate} – {section.content.endDate}</div>}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Right / Sidebar */}
          <aside className="space-y-6">
            {rightSections.map((section) => {
              switch(section.type) {
                case 'summary':
                  return (
                    <div key={section.id} className="bg-gray-50 p-4 rounded border" style={getFormattingStyles(section.content?.formatting)}>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{section.content.text}</p>
                    </div>
                  );

                case 'skills':
                  const skillsByCategory = formatSkillsByCategory(section.content.items || []);
                  return (
                    <div key={section.id} className="bg-gray-50 p-4 rounded border" style={getFormattingStyles(section.content?.formatting)}>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Skills</h4>
                      <div className="space-y-2">
                        {Object.entries(skillsByCategory).length > 0 ? (
                          Object.entries(skillsByCategory).map(([categoryId, skillList], idx) => (
                            <div key={idx}>
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                {getCategoryDisplayName(categoryId)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {skillList.map((skill: string, sidx: number) => (
                                  <span
                                    key={sidx}
                                    className="text-xs px-2 py-1 bg-white border rounded text-gray-700"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : typeof section.content.skills === 'string' ? (
                          section.content.skills?.split(',').map((s: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-white border rounded text-gray-700">{s.trim()}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No skills added</span>
                        )}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}

            {/* Small footer note */}
            <div className="text-xs text-gray-500">Designed with ✨ by Engaze</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
