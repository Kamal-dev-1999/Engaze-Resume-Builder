/**
 * Resume Parser Utility
 * Extracts structured resume data from text content
 */

export interface ParsedResume {
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills?: string[];
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

// Common resume section keywords
const SECTION_PATTERNS = {
  contact: /^(contact|personal info|information|get in touch)/i,
  summary: /^(summary|professional summary|objective|about|profile|executive summary)/i,
  experience: /^(experience|work experience|employment|professional experience|career)/i,
  education: /^(education|academic|qualification|degree|school|university)/i,
  skills: /^(skills|technical skills|competencies|abilities|expertise)/i,
  projects: /^(projects|portfolio|featured projects|sample work)/i,
};

export const parseResume = (text: string): ParsedResume => {
  const resume: ParsedResume = {};

  // Extract contact information
  resume.contact = extractContactInfo(text);

  // Split text into sections
  const sections = splitBySections(text);

  // Parse each section
  Object.entries(sections).forEach(([sectionType, content]) => {
    if (sectionType === 'summary') {
      resume.summary = content.join('\n').slice(0, 500); // Limit summary to 500 chars
    } else if (sectionType === 'experience') {
      resume.experience = parseExperience(content);
    } else if (sectionType === 'education') {
      resume.education = parseEducation(content);
    } else if (sectionType === 'skills') {
      resume.skills = parseSkills(content);
    } else if (sectionType === 'projects') {
      resume.projects = parseProjects(content);
    }
  });

  return resume;
};

const extractContactInfo = (text: string) => {
  const contact: ParsedResume['contact'] = {};

  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) contact.email = emailMatch[1];

  // Extract phone
  const phoneMatch = text.match(/(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/);
  if (phoneMatch) contact.phone = phoneMatch[1];

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

  // Extract website/portfolio
  const websiteMatch = text.match(/(https?:\/\/[^\s]+\.[a-zA-Z]{2,})/i);
  if (websiteMatch) contact.website = websiteMatch[1];

  // Extract location (look for common patterns)
  const locationMatch = text.match(/(?:location|located in|based in)[\s:]*([^,\n]+(?:,\s*[^,\n]+)?)/i);
  if (locationMatch) contact.location = locationMatch[1];

  // Extract name (first line often contains name)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length > 0 && !emailMatch?.[0].includes(lines[0])) {
    contact.name = lines[0];
  }

  return Object.keys(contact).length > 0 ? contact : undefined;
};

const splitBySections = (text: string): Record<string, string[]> => {
  const sections: Record<string, string[]> = {};
  const lines = text.split('\n').map(line => line.trim());

  let currentSection = 'other';
  let currentContent: string[] = [];

  lines.forEach(line => {
    // Check if this line is a section header
    let foundSection = false;
    for (const [sectionType, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line) && line.length < 50) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent;
        }
        currentSection = sectionType;
        currentContent = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection && line.length > 0) {
      currentContent.push(line);
    }
  });

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent;
  }

  return sections;
};

const parseExperience = (lines: string[]): ParsedResume['experience'] => {
  const experiences: ParsedResume['experience'] = [];
  let currentExperience: any = null;
  let descriptionLines: string[] = [];

  lines.forEach(line => {
    // Look for position/company patterns
    if (line.match(/^[A-Z][A-Za-z\s]+(?:\s+(?:at|@|\||-)\s+|Manager|Engineer|Developer|Designer)/)) {
      if (currentExperience) {
        currentExperience.description = descriptionLines.join('\n').trim();
        experiences.push(currentExperience);
      }
      currentExperience = {
        position: line,
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      };
      descriptionLines = [];
    } else if (currentExperience && line.match(/\d{4}|\d{1,2}\/\d{1,2}/)) {
      // Likely a date line
      const dateMatch = line.match(/(\w+\s*\d{4}|\d{1,2}\/\d{1,2}(?:\/\d{4})?)/g);
      if (dateMatch) {
        currentExperience.startDate = dateMatch[0];
        if (dateMatch[1]) currentExperience.endDate = dateMatch[1];
      }
    } else if (currentExperience) {
      descriptionLines.push(line);
    }
  });

  if (currentExperience) {
    currentExperience.description = descriptionLines.join('\n').trim();
    experiences.push(currentExperience);
  }

  return experiences.filter(e => e.position);
};

const parseEducation = (lines: string[]): ParsedResume['education'] => {
  const educations: ParsedResume['education'] = [];
  let currentEducation: any = null;

  lines.forEach(line => {
    // Look for degree patterns
    if (line.match(/(?:B\.?S|B\.?A|M\.?S|M\.?A|PhD|Bachelor|Master|Associate)/i)) {
      if (currentEducation) {
        educations.push(currentEducation);
      }
      currentEducation = {
        degree: line,
        institution: '',
        field: '',
        graduationDate: '',
      };
    } else if (
      currentEducation &&
      (line.match(/[Uu]niversity|[Cc]ollege|[Ss]chool|[Ii]nstitute/) ||
        line.match(/\d{4}/))
    ) {
      if (line.match(/\d{4}/)) {
        currentEducation.graduationDate = line;
      } else {
        currentEducation.institution = line;
      }
    }
  });

  if (currentEducation && currentEducation.degree) {
    educations.push(currentEducation);
  }

  return educations;
};

const parseSkills = (lines: string[]): string[] => {
  const skills: string[] = [];

  lines.forEach(line => {
    // Split by common delimiters
    const parts = line.split(/[,;•\|]/).map(p => p.trim()).filter(p => p && p.length < 50);
    skills.push(...parts);
  });

  return [...new Set(skills)].slice(0, 30); // Remove duplicates, limit to 30
};

const parseProjects = (lines: string[]): ParsedResume['projects'] => {
  const projects: ParsedResume['projects'] = [];
  let currentProject: any = null;

  lines.forEach(line => {
    // Project titles are usually short and at the start
    if (line.length < 80 && line.match(/^[A-Z]/)) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: line,
        description: '',
        link: line.match(/(https?:\/\/[^\s]+)/)?.[1],
      };
    } else if (currentProject && line.length > 0) {
      currentProject.description += (currentProject.description ? ' ' : '') + line;
    }
  });

  if (currentProject && currentProject.name) {
    projects.push(currentProject);
  }

  return projects.slice(0, 10); // Limit to 10 projects
};

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    // Handle different file types
    if (file.type === 'application/pdf') {
      // For PDF files, we'll extract text (simplified - in production use a PDF library like pdfjs)
      reader.readAsText(file);
    } else if (file.type.includes('text') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
};
