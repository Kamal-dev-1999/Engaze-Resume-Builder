/**
 * ResumePages Component
 * Handles multi-page resume rendering with automatic page breaks
 * Supports page navigation in preview and multi-page PDF export
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResumePagesProps {
  children: React.ReactNode;
  onPageCountChange?: (count: number) => void;
}

const ResumePages: React.FC<ResumePagesProps> = ({
  children,
  onPageCountChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // A4 paper dimensions in pixels (at 96 DPI)
  const A4_WIDTH_PX = 794; // 8.27 inches
  const A4_HEIGHT_PX = 1123; // 11.7 inches
  const PAGE_MARGIN_PX = 20; // margins in pixels (approximately 5.3mm each)
  const USABLE_HEIGHT_PX = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2;

  /**
   * Calculate page breaks based on content height
   */
  useEffect(() => {
    if (!contentRef.current) return;

    // Get actual rendered height
    const contentHeight = contentRef.current.scrollHeight;
    
    // Calculate total pages needed
    const calculatedTotalPages = Math.ceil(contentHeight / USABLE_HEIGHT_PX);
    
    setTotalPages(Math.max(1, calculatedTotalPages));
    onPageCountChange?.(Math.max(1, calculatedTotalPages));

    // Log for debugging
    console.log('%c📄 Resume Pagination Info', 'color: #0066cc; font-size: 14px; font-weight: bold;');
    console.log(`Content Height: ${contentHeight}px`);
    console.log(`Page Height: ${A4_HEIGHT_PX}px`);
    console.log(`Usable Height (with margins): ${USABLE_HEIGHT_PX}px`);
    console.log(`Total Pages: ${calculatedTotalPages}`);
  }, [children, USABLE_HEIGHT_PX, onPageCountChange]);

  /**
   * Handle page navigation
   */
  const goToPage = (pageNumber: number) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  /**
   * Calculate the offset for the current page
   */
  const calculatePageOffset = () => {
    return -(currentPage - 1) * USABLE_HEIGHT_PX;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Preview Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4"
        style={{
          minHeight: `${A4_HEIGHT_PX + 40}px`,
        }}
      >
        {/* Single Page View */}
        <div
          className="bg-white shadow-lg overflow-hidden"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            position: 'relative',
          }}
        >
          {/* Page Content with Clipping */}
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              ref={contentRef}
              style={{
                transform: `translateY(${calculatePageOffset()}px)`,
                transition: 'transform 0.3s ease-in-out',
                width: '100%',
              }}
              className="print:transform-none"
            >
              {children}
            </div>
          </div>

          {/* Page Number Indicator */}
          <div
            className="absolute bottom-4 right-6 text-xs text-gray-400 print:hidden"
            style={{
              fontSize: '11px',
            }}
          >
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Page Navigation Controls - Hidden in Print */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            {/* Quick Page Jump */}
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Jump to page"
            />
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body, html {
            margin: 0;
            padding: 0;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:transform-none {
            transform: none !important;
          }

          /* Page break after each page container */
          div[data-page-break] {
            page-break-after: always;
            page-break-inside: avoid;
          }

          /* Ensure content doesn't break within sections */
          section, article, div[role="section"] {
            page-break-inside: avoid;
          }

          /* Proper A4 dimensions for print */
          @page {
            size: A4;
            margin: ${PAGE_MARGIN_PX}mm;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePages;
