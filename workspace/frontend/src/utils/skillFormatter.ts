/**
 * Utility function to format and group skills by category
 */

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: string;
}

export const formatSkillsByCategory = (
  skills: any[],
  categoryNames?: Record<string, string>
): Record<string, string[]> => {
  // Handle different skill formats
  if (!skills || !Array.isArray(skills)) {
    return {};
  }

  const grouped: Record<string, string[]> = {};

  skills.forEach((skill: any) => {
    // Extract skill name
    const skillName = typeof skill === 'string' ? skill : skill.name || String(skill);
    const skillCategory = typeof skill === 'object' && skill.category ? skill.category : 'Other';

    if (!grouped[skillCategory]) {
      grouped[skillCategory] = [];
    }

    if (skillName && skillName !== '[object Object]') {
      grouped[skillCategory].push(skillName);
    }
  });

  return grouped;
};

export const getCategoryDisplayName = (categoryId: string): string => {
  const categoryMap: Record<string, string> = {
    programming: 'Programming Languages',
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    database: 'Databases',
    devops: 'DevOps & Cloud',
    mobile: 'Mobile Development',
    data: 'Data & Analytics',
    design: 'Design & UX',
    qa: 'QA & Testing',
    communication: 'Communication & Soft Skills',
    tools: 'Tools & Platforms',
    security: 'Security',
    other: 'Other'
  };

  return categoryMap[categoryId] || categoryId;
};

export const renderSkillsByCategory = (skills: any[]): string => {
  const grouped = formatSkillsByCategory(skills);
  
  return Object.entries(grouped)
    .map(([category, skillList]) => {
      const categoryName = getCategoryDisplayName(category);
      return `${categoryName}: ${skillList.join(', ')}`;
    })
    .join('\n');
};
