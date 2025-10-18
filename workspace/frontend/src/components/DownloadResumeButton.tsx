import React, { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DownloadResumeButtonProps {
  resumeTitle: string;
  resumeContent: RefObject<HTMLDivElement> | null;
}

const DownloadResumeButton: React.FC<DownloadResumeButtonProps> = ({ resumeTitle, resumeContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const downloadPDF = async () => {
    if (!resumeContent || !resumeContent.current) {
      alert('Resume content not available');
      return;
    }

    setIsDownloading(true);
    try {
      // Store original inline styles
      const element = resumeContent.current;
      const originalStyle = element.getAttribute('style') || '';
      
      // Get the parent container (800px height div)
      const parentContainer = element.parentElement;
      const originalParentStyle = parentContainer?.getAttribute('style') || '';
      
      // Force the element to render at full size for capture
      // Set explicit width for A4 (210mm = ~794px at 96dpi)
      element.style.cssText = 'width: 794px !important; height: auto !important; overflow: visible !important; position: static !important;';
      
      if (parentContainer) {
        parentContainer.style.cssText = 'width: 794px !important; height: auto !important; overflow: visible !important;';
      }
      
      // Wait for layout to recalculate
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get the actual rendered height
      const actualHeight = element.scrollHeight;
      
      // Capture with explicit dimensions
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: 794,
        height: actualHeight,
        windowWidth: 794,
        windowHeight: actualHeight
      });

      // Restore original styles
      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }
      
      if (parentContainer) {
        if (originalParentStyle) {
          parentContainer.setAttribute('style', originalParentStyle);
        } else {
          parentContainer.removeAttribute('style');
        }
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm
      
      let heightLeft = pdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}_resume.pdf`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadWord = async () => {
    if (!resumeContent || !resumeContent.current) {
      alert('Resume content not available');
      return;
    }

    setIsDownloading(true);
    try {
      // Get the HTML content from the resume
      const htmlContent = resumeContent.current.innerHTML;

      // Create a Word-compatible HTML document
      const wordHTML = `
        <!DOCTYPE html>
        <html xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>${resumeTitle}</title>
          <style>
            * { margin: 0; padding: 0; }
            body { 
              font-family: Calibri, Arial, sans-serif;
              line-height: 1.5;
              color: #333;
            }
            @page { 
              margin: 0.5in 0.5in 0.5in 0.5in; 
            }
            h1, h2, h3, h4, h5, h6 { 
              margin: 10pt 0 6pt 0;
              font-weight: bold;
              line-height: 1.3;
            }
            h1 { font-size: 16pt; }
            h2 { font-size: 14pt; }
            h3 { font-size: 12pt; }
            p, div { margin: 0 0 6pt 0; }
            ul, ol { margin: 0 0 6pt 18pt; }
            li { margin: 0 0 3pt 0; }
            strong, b { font-weight: bold; }
            em, i { font-style: italic; }
            u { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 20pt;">
            <h1>${resumeTitle}</h1>
          </div>
          ${htmlContent}
        </body>
        </html>
      `;

      // Create a blob with the HTML
      const blob = new Blob([wordHTML], { type: 'application/msword' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeTitle.replace(/\s+/g, '_')}_resume.doc`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      setIsOpen(false);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to download Word document. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${isDownloading 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {isDownloading ? 'Downloading...' : 'Download'}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow border border-gray-300 py-2 z-50">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 hover:scale-105 transition-all transform flex items-center gap-3 text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.814 6.5z" />
            </svg>
            <span>
              <div className="font-semibold text-gray-800">Download as PDF</div>
              <div className="text-xs text-gray-500">Best for sharing</div>
            </span>
          </button>

          <button
            onClick={downloadWord}
            disabled={isDownloading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 hover:scale-105 transition-all transform flex items-center gap-3 text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>
              <div className="font-semibold text-gray-800">Download as Word</div>
              <div className="text-xs text-gray-500">For editing</div>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadResumeButton;
