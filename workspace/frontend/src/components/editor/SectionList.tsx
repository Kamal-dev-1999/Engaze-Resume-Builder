import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
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
  const sortedSections = sections && Array.isArray(sections) 
    ? [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  console.log('SectionList render - Total sections:', sortedSections.length, 'Section IDs:', sortedSections.map(s => s.id));

  const handleDragEnd = useCallback((result: DropResult) => {
    console.log('Drag End - Source:', result.source.index, 'Destination:', result.destination?.index);
    
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    try {
      const reorderedSections = Array.from(sortedSections);
      const [movedSection] = reorderedSections.splice(result.source.index, 1);
      reorderedSections.splice(result.destination.index, 0, movedSection);
      const newOrderIds = reorderedSections.map(section => section.id);
      console.log('New order IDs:', newOrderIds);
      onReorder(newOrderIds);
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  }, [sortedSections, onReorder]);

  if (sortedSections.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No sections to display</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections-list" type="SECTION">
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''}`}
            style={{ 
              userSelect: 'none',
              minHeight: '100px'
            }}
          >
            {sortedSections.map((section, index) => (
              <Draggable 
                key={`drag-${section.id}`}
                draggableId={`drag-${section.id}`} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      userSelect: 'none',
                      ...provided.draggableProps.style
                    }}
                    className={`transition-all user-select-none ${snapshot.isDragging ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100 scale-100'}`}
                  >
                    <SectionItem 
                      section={section}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onFormat={onFormat}
                      dragHandleProps={provided.dragHandleProps}
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
