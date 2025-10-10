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
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <div className="relative">
              <select
                name="fontFamily"
                className="appearance-none w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.fontFamily}
                onChange={handleInputChange}
                style={{ fontFamily: formatting.fontFamily }}
              >
                <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                <option value="Helvetica" style={{ fontFamily: 'Helvetica' }}>Helvetica</option>
                <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                <option value="Segoe UI" style={{ fontFamily: 'Segoe UI' }}>Segoe UI</option>
                <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <div className="flex">
              <input
                type="number"
                name="fontSize"
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.fontSize}
                onChange={handleInputChange}
                min="8"
                max="36"
              />
              <div className="inline-flex flex-col border border-l-0 border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                  onClick={() => {
                    const newValue = (formatting.fontSize || 0) + 1;
                    if (newValue <= 36) {
                      setFormatting({ ...formatting, fontSize: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const newValue = (formatting.fontSize || 0) - 1;
                    if (newValue >= 8) {
                      setFormatting({ ...formatting, fontSize: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Font Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <div className="relative">
              <select
                name="fontWeight"
                className="appearance-none w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.fontWeight}
                onChange={handleInputChange}
                style={{ fontWeight: formatting.fontWeight }}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="bolder">Bolder</option>
                <option value="100">Thin (100)</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="900">Black (900)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Alignment
            </label>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                className={`flex items-center justify-center p-2 border ${formatting.textAlign === 'left' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
                onClick={() => setFormatting({ ...formatting, textAlign: 'left' })}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-2 border ${formatting.textAlign === 'center' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
                onClick={() => setFormatting({ ...formatting, textAlign: 'center' })}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-2 border ${formatting.textAlign === 'right' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
                onClick={() => setFormatting({ ...formatting, textAlign: 'right' })}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-2 border ${formatting.textAlign === 'justify' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'} rounded-md`}
                onClick={() => setFormatting({ ...formatting, textAlign: 'justify' })}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <input type="hidden" name="textAlign" value={formatting.textAlign || 'left'} />
            </div>
          </div>
          
          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex">
              <div className="flex-shrink-0">
                <input
                  type="color"
                  name="textColor"
                  className="h-full rounded-l-md border border-r-0 border-gray-300 p-1 w-12"
                  value={formatting.textColor}
                  onChange={handleInputChange}
                  title="Choose text color"
                />
              </div>
              <input
                type="text"
                name="textColor"
                className="flex-1 rounded-r-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.textColor}
                onChange={handleInputChange}
                spellCheck="false"
              />
            </div>
          </div>
          
          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex">
              <div className="flex-shrink-0">
                <input
                  type="color"
                  name="backgroundColor"
                  className="h-full rounded-l-md border border-r-0 border-gray-300 p-1 w-12"
                  value={formatting.backgroundColor === 'transparent' ? '#ffffff' : formatting.backgroundColor}
                  onChange={handleInputChange}
                  title="Choose background color"
                />
              </div>
              <input
                type="text"
                name="backgroundColor"
                className="flex-1 rounded-r-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.backgroundColor}
                onChange={handleInputChange}
                spellCheck="false"
                placeholder="transparent or #RRGGBB"
              />
            </div>
          </div>
          
          {/* Padding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding (px)
            </label>
            <div className="flex">
              <input
                type="number"
                name="padding"
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.padding}
                onChange={handleInputChange}
                min="0"
                max="48"
              />
              <div className="inline-flex flex-col border border-l-0 border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                  onClick={() => {
                    const newValue = (formatting.padding || 0) + 1;
                    if (newValue <= 48) {
                      setFormatting({ ...formatting, padding: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const newValue = (formatting.padding || 0) - 1;
                    if (newValue >= 0) {
                      setFormatting({ ...formatting, padding: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin (px)
            </label>
            <div className="flex">
              <input
                type="number"
                name="margin"
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.margin}
                onChange={handleInputChange}
                min="0"
                max="48"
              />
              <div className="inline-flex flex-col border border-l-0 border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                  onClick={() => {
                    const newValue = (formatting.margin || 0) + 1;
                    if (newValue <= 48) {
                      setFormatting({ ...formatting, margin: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const newValue = (formatting.margin || 0) - 1;
                    if (newValue >= 0) {
                      setFormatting({ ...formatting, margin: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width (px)
            </label>
            <div className="flex">
              <input
                type="number"
                name="borderWidth"
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.borderWidth}
                onChange={handleInputChange}
                min="0"
                max="10"
              />
              <div className="inline-flex flex-col border border-l-0 border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                  onClick={() => {
                    const newValue = (formatting.borderWidth || 0) + 1;
                    if (newValue <= 10) {
                      setFormatting({ ...formatting, borderWidth: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const newValue = (formatting.borderWidth || 0) - 1;
                    if (newValue >= 0) {
                      setFormatting({ ...formatting, borderWidth: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Border Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <div className="flex">
              <div className="flex-shrink-0">
                <input
                  type="color"
                  name="borderColor"
                  className="h-full rounded-l-md border border-r-0 border-gray-300 p-1 w-12"
                  value={formatting.borderColor}
                  onChange={handleInputChange}
                  title="Choose border color"
                />
              </div>
              <input
                type="text"
                name="borderColor"
                className="flex-1 rounded-r-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.borderColor}
                onChange={handleInputChange}
                spellCheck="false"
              />
            </div>
          </div>
          
          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <div className="flex">
              <input
                type="number"
                name="borderRadius"
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={formatting.borderRadius}
                onChange={handleInputChange}
                min="0"
                max="24"
              />
              <div className="inline-flex flex-col border border-l-0 border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                  onClick={() => {
                    const newValue = (formatting.borderRadius || 0) + 1;
                    if (newValue <= 24) {
                      setFormatting({ ...formatting, borderRadius: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const newValue = (formatting.borderRadius || 0) - 1;
                    if (newValue >= 0) {
                      setFormatting({ ...formatting, borderRadius: newValue });
                    }
                  }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
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