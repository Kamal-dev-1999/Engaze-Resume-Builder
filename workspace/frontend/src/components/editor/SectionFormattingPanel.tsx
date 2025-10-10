import React, { useState } from 'react';

interface Section {
  id: number;
  type: string;
  content: any;
  order: number;
}

interface SectionFormatting {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  textColor?: string;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

interface SectionFormattingPanelProps {
  section: Section;
  onSave: (sectionId: number, formatting: SectionFormatting) => void;
  onCancel: () => void;
}

const SectionFormattingPanel: React.FC<SectionFormattingPanelProps> = ({
  section,
  onSave,
  onCancel
}) => {
  const defaultFormatting: SectionFormatting = section.content?.formatting || {
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'left',
    textColor: '#000000',
    backgroundColor: 'transparent',
    padding: 8,
    margin: 0,
    borderWidth: 0,
    borderColor: '#d1d5db',
    borderRadius: 4,
  };

  const [formatting, setFormatting] = useState<SectionFormatting>(defaultFormatting);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric values
    if (type === 'number') {
      setFormatting({
        ...formatting,
        [name]: parseInt(value, 10)
      });
    } else {
      setFormatting({
        ...formatting,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section.id, formatting);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Format {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              name="fontFamily"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.fontFamily}
              onChange={handleInputChange}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              type="number"
              name="fontSize"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.fontSize}
              onChange={handleInputChange}
              min="8"
              max="36"
            />
          </div>
          
          {/* Font Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <select
              name="fontWeight"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.fontWeight}
              onChange={handleInputChange}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
            </select>
          </div>
          
          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Alignment
            </label>
            <select
              name="textAlign"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.textAlign}
              onChange={handleInputChange}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          
          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="textColor"
                className="rounded-l-md border border-gray-300 p-1 w-12"
                value={formatting.textColor}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="textColor"
                className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                value={formatting.textColor}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="backgroundColor"
                className="rounded-l-md border border-gray-300 p-1 w-12"
                value={formatting.backgroundColor === 'transparent' ? '#ffffff' : formatting.backgroundColor}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="backgroundColor"
                className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                value={formatting.backgroundColor}
                onChange={handleInputChange}
                placeholder="transparent or #RRGGBB"
              />
            </div>
          </div>
          
          {/* Padding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding (px)
            </label>
            <input
              type="number"
              name="padding"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.padding}
              onChange={handleInputChange}
              min="0"
              max="48"
            />
          </div>
          
          {/* Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin (px)
            </label>
            <input
              type="number"
              name="margin"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.margin}
              onChange={handleInputChange}
              min="0"
              max="48"
            />
          </div>
          
          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width (px)
            </label>
            <input
              type="number"
              name="borderWidth"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.borderWidth}
              onChange={handleInputChange}
              min="0"
              max="10"
            />
          </div>
          
          {/* Border Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="borderColor"
                className="rounded-l-md border border-gray-300 p-1 w-12"
                value={formatting.borderColor}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="borderColor"
                className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                value={formatting.borderColor}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              type="number"
              name="borderRadius"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={formatting.borderRadius}
              onChange={handleInputChange}
              min="0"
              max="24"
            />
          </div>
        </div>
        
        {/* Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview
          </label>
          <div 
            className="border rounded-md p-4"
            style={{
              fontFamily: formatting.fontFamily,
              fontSize: `${formatting.fontSize}px`,
              fontWeight: formatting.fontWeight,
              textAlign: formatting.textAlign as any,
              color: formatting.textColor,
              backgroundColor: formatting.backgroundColor,
              padding: `${formatting.padding}px`,
              margin: `${formatting.margin}px`,
              borderWidth: `${formatting.borderWidth}px`,
              borderColor: formatting.borderColor,
              borderStyle: formatting.borderWidth ? 'solid' : 'none',
              borderRadius: `${formatting.borderRadius}px`,
            }}
          >
            <p>This is a preview of how your section will look with these formatting options.</p>
            <p>Sample text for the {section.type} section.</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Save Formatting
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionFormattingPanel;