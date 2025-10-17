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
      // Capture the resume element as an image using html2canvas
      const canvas = await html2canvas(resumeContent.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF from the canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Handle multi-page PDFs
      while (heightLeft > 0) {
        const pageHeight = 297; // A4 height in mm
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}_resume.pdf`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF');
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
      // Capture the resume element as an image using html2canvas
      const canvas = await html2canvas(resumeContent.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');

      // Create a Word document with the image
      const docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='UTF-8'>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @page {
                margin: 0.5in;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" style="max-width: 100%; height: auto;" />
          </body>
        </html>
      `;

      const blob = new Blob([docContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeTitle.replace(/\s+/g, '_')}_resume.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to download Word document');
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
            ? 'bg-blue-300 text-white cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.814 6.5z" />
            </svg>
            <span>
              <div className="font-semibold">Download as PDF</div>
              <div className="text-xs text-gray-500">Best for sharing</div>
            </span>
          </button>

          <div className="border-t border-gray-200"></div>

          <button
            onClick={downloadWord}
            disabled={isDownloading}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>
              <div className="font-semibold">Download as Word</div>
              <div className="text-xs text-gray-500">For editing</div>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadResumeButton;
