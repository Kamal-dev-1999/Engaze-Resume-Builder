import React, { useState, useRef, useEffect } from 'react';
import { PREDEFINED_SKILLS, getAllSkills, getCategoryName } from '../../data/predefinedSkills';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsPanelProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  onClose?: () => void;
}

export const SkillsPanel: React.FC<SkillsPanelProps> = ({
  skills,
  onSkillsChange,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingProficiency, setEditingProficiency] = useState<Skill['proficiency']>('Intermediate');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize custom categories from existing skills
  useEffect(() => {
    const customCats = new Set(
      skills
        .filter(s => !PREDEFINED_SKILLS.some(cat => cat.skills.includes(s.name)))
        .map(s => s.category)
    );
    setCustomCategories(Array.from(customCats));
  }, [skills]);

  const filteredSkills = getAllSkills().filter(
    skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === null ||
        PREDEFINED_SKILLS.find(cat => cat.id === selectedCategory)?.skills.includes(skill))
  );

  const addSkill = (skillName: string, category: string) => {
    const newSkill: Skill = {
      id: `${Date.now()}-${Math.random()}`,
      name: skillName,
      category: category,
      proficiency: 'Intermediate'
    };
    if (!skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      onSkillsChange([...skills, newSkill]);
    }
    setSearchTerm('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const addCustomSkill = () => {
    if (customSkillName.trim() && customSkillCategory.trim()) {
      addSkill(customSkillName, customSkillCategory);
      setCustomSkillName('');
      setShowCustomSkill(false);
      if (!customCategories.includes(customSkillCategory) && !PREDEFINED_SKILLS.some(cat => cat.id === customSkillCategory)) {
        setCustomCategories([...customCategories, customSkillCategory]);
      }
    }
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      setCustomCategories([...customCategories, newCategoryName]);
      setCustomSkillCategory(newCategoryName);
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(skills.filter(s => s.id !== skillId));
  };

  const updateProficiency = (skillId: string, proficiency: Skill['proficiency']) => {
    onSkillsChange(
      skills.map(s =>
        s.id === skillId ? { ...s, proficiency } : s
      )
    );
  };

  const proficiencyLevels: Skill['proficiency'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const allCategories = [
    ...PREDEFINED_SKILLS,
    ...customCategories.map(cat => ({
      id: cat,
      name: cat,
      skills: []
    }))
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Management</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search and add skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtered Skills Grid */}
        {filteredSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              {selectedCategory ? `${getCategoryName(selectedCategory)} Skills` : 'Available Skills'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill, PREDEFINED_SKILLS.find(cat => cat.skills.includes(skill))?.id || 'other')}
                  disabled={skills.some(s => s.name === skill)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    skills.some(s => s.name === skill)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer'
                  }`}
                >
                  {skill}
                  {skills.some(s => s.name === skill) && ' ✓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Skill Input */}
        {!showCustomSkill ? (
          <button
            type="button"
            onClick={() => setShowCustomSkill(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            + Add Custom Skill
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="Enter skill name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="flex gap-2">
                <select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {allCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  New
                </button>
              </div>
            </div>
            {showNewCategory && (
              <div className="mb-3 p-3 bg-white rounded-lg border border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addNewCategory}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName('');
                    }}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addCustomSkill}
                disabled={!customSkillName.trim() || !customSkillCategory.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors"
              >
                Add Skill
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSkill(false);
                  setCustomSkillName('');
                  setCustomSkillCategory('');
                  setShowNewCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Added Skills */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Your Skills ({skills.length})
        </h3>

        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No skills added yet. Search and add skills above.</p>
        ) : (
          <div className="space-y-3">
            {/* Group by category */}
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, Skill[]>)
            ).map(([categoryId, categorySkills]) => (
              <div key={categoryId} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{getCategoryName(categoryId)}</h4>
                <div className="space-y-2">
                  {categorySkills.map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{skill.name}</p>
                      </div>
                      {editingSkill === skill.id ? (
                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={editingProficiency || 'Intermediate'}
                            onChange={(e) => setEditingProficiency(e.target.value as Skill['proficiency'])}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {proficiencyLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              updateProficiency(skill.id, editingProficiency);
                              setEditingSkill(null);
                            }}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSkill(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 ml-4">
                          {skill.proficiency && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {skill.proficiency}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkill(skill.id);
                              setEditingProficiency(skill.proficiency || 'Intermediate');
                            }}
                            className="px-2 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
