import React from 'react';
// @ts-ignore - Ignoring type issues with react-beautiful-dnd
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  onFormat?: (sectionId: number) => void;
}

const SectionList: React.FC<SectionListProps> = ({ 
  sections, 
  onEdit, 
  onDelete,
  onReorder,
  onFormat = () => {} // Default empty function if not provided
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    try {
      const reorderedSections = Array.from(sections);
      const [movedSection] = reorderedSections.splice(result.source.index, 1);
      reorderedSections.splice(result.destination.index, 0, movedSection);
      const newOrderIds = reorderedSections.map(section => section.id);
      onReorder(newOrderIds);
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  };

  const sortedSections = sections && Array.isArray(sections) 
    ? [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  if (sortedSections.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No sections to display</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections-list">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {sortedSections.map((section, index) => (
              <Draggable 
                key={`section-${section.id}`} 
                draggableId={`section-${section.id}`} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}    // ✅ FIXED: must spread draggableProps
                    {...provided.dragHandleProps}   // ✅ FIXED: drag handle support
                  >
                    <SectionItem 
                      section={section}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onFormat={onFormat}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SectionList;
