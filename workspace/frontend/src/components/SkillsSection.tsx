import React, { useState } from 'react';
import { getCategoryName } from '../data/predefinedSkills';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsSectionProps {
  skills: Skill[];
  onEdit?: () => void;
  isEditable?: boolean;
  templateStyle?: 'compact' | 'detailed' | 'categorized';
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onEdit,
  isEditable = false,
  templateStyle = 'categorized'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (skills.length === 0) {
    return null;
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const renderCompactStyle = () => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span
            key={skill.id}
            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );

  const renderDetailedStyle = () => (
    <div className="space-y-3">
      {skills.map(skill => (
        <div key={skill.id} className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{skill.name}</span>
          {skill.proficiency && (
            <span className="text-sm px-2 py-1 bg-gray-200 rounded">
              {skill.proficiency}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderCategorizedStyle = () => (
    <div className="space-y-4">
      {Object.entries(skillsByCategory).map(([categoryId, categorySkills]) => (
        <div key={categoryId}>
          <h4 className="font-semibold text-gray-900 text-sm mb-2">
            {getCategoryName(categoryId)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map(skill => (
              <span
                key={skill.id}
                className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm"
              >
                {skill.name}
                {skill.proficiency && (
                  <span className="text-xs ml-1 opacity-75">({skill.proficiency})</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Skills</h3>
        {isEditable && isHovered && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {templateStyle === 'compact' && renderCompactStyle()}
      {templateStyle === 'detailed' && renderDetailedStyle()}
      {templateStyle === 'categorized' && renderCategorizedStyle()}
    </div>
  );
};

// Variant for inline skills display
export const SkillsBadgeList: React.FC<{
  skills: Skill[];
  maxItems?: number;
  showMore?: boolean;
}> = ({ skills, maxItems = 10, showMore = true }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? skills : skills.slice(0, maxItems);
  const hiddenCount = skills.length - maxItems;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedSkills.map(skill => (
        <span
          key={skill.id}
          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
        >
          {skill.name}
        </span>
      ))}
      {showMore && hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
        >
          +{hiddenCount} more
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
        >
          Show less
        </button>
      )}
    </div>
  );
};
