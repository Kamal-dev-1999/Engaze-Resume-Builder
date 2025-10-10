import React from 'react';
import SectionItem from './SectionItem';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface SectionListProps {
  sections: Section[];
  onEdit: (sectionId: number) => void;
  onDelete: (sectionId: number) => void;
  onReorder: (sectionIds: number[]) => void;
}

/**
 * A simplified version of SectionList that doesn't use drag and drop
 * but preserves the ability to edit and delete sections.
 */
const SafeSectionList: React.FC<SectionListProps> = ({ 
  sections, 
  onEdit, 
  onDelete,
  onReorder
}) => {
  // Safely sort sections by their order field
  const sortedSections = sections && Array.isArray(sections) 
    ? [...sections].sort((a, b) => {
        const orderA = a && typeof a.order === 'number' ? a.order : 0;
        const orderB = b && typeof b.order === 'number' ? b.order : 0;
        return orderA - orderB;
      })
    : [];

  // Function to move a section up in order
  const moveUp = (index: number) => {
    if (index <= 0 || !sortedSections || sortedSections.length < 2) return;
    
    const newSections = [...sortedSections];
    // Swap with the section above
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    // Get the new order of IDs
    const newOrderIds = newSections.map(section => section.id);
    // Call the onReorder callback
    onReorder(newOrderIds);
  };

  // Function to move a section down in order
  const moveDown = (index: number) => {
    if (index >= sortedSections.length - 1 || !sortedSections || sortedSections.length < 2) return;
    
    const newSections = [...sortedSections];
    // Swap with the section below
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    // Get the new order of IDs
    const newOrderIds = newSections.map(section => section.id);
    // Call the onReorder callback
    onReorder(newOrderIds);
  };

  // If no sections, display a message
  if (sortedSections.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No sections to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedSections.map((section, index) => (
        <div key={section.id} className="flex items-center">
          <div className="flex-grow">
            <SectionItem 
              section={section}
              onEdit={onEdit}
              onDelete={onDelete}
              dragHandleProps={{}} // Empty object as we don't use drag and drop
            />
          </div>
          <div className="flex flex-col ml-2">
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Move up"
            >
              ▲
            </button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === sortedSections.length - 1}
              className={`p-1 rounded ${index === sortedSections.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Move down"
            >
              ▼
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SafeSectionList;