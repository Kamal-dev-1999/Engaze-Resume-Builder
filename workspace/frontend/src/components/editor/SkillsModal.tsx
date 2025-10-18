import React, { useState } from 'react';
import { SkillsPanel } from './SkillsPanel';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

export const SkillsModal: React.FC<SkillsModalProps> = ({
  isOpen,
  onClose,
  skills,
  onSkillsChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-4xl">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage Skills</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <SkillsPanel
            skills={skills}
            onSkillsChange={onSkillsChange}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
