import React, { useState, useRef, useEffect } from 'react';
import { resumeAPI } from '../services/api';

interface ShareResumeButtonProps {
  resumeId: number;
  initialShareSlug?: string;
}

const ShareResumeButton: React.FC<ShareResumeButtonProps> = ({ 
  resumeId, 
  initialShareSlug 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(initialShareSlug || null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const generateShareLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Generating share link for resume:', resumeId);
      const response = await resumeAPI.shareResume(resumeId);
      console.log('Share link response:', response);
      
      // The response should contain the share_slug
      const slug = response.share_slug || response.shareSlug || response.slug;
      if (slug) {
        setShareSlug(slug);
        console.log('Share slug set to:', slug);
      } else {
        setError('Failed to generate share link. Please try again.');
        console.error('No slug in response:', response);
      }
    } catch (err) {
      console.error('Error generating share link:', err);
      setError('Failed to generate share link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getShareUrl = () => {
    if (!shareSlug) return '';
    // Use window.location to get the current domain
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return `${baseUrl}/share/${shareSlug}`;
  };

  const copyToClipboard = async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      console.log('Share link copied to clipboard:', shareUrl);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setError('Failed to copy link. Please try again.');
    }
  };

  const openShareLink = () => {
    const shareUrl = getShareUrl();
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      console.log('Opened share link in new tab:', shareUrl);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${isLoading 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-green-500 text-white hover:bg-green-600'
          }
        `}
        title="Share your resume with others"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3.027 3.027 0 001.946-2.83 3 3 0 10-.001-4.089.5.5 0 00-.812.058l-4.35-2.18a3 3 0 100 3.364l4.35-2.18a.5.5 0 00.812.058A3 3 0 0115 8z" />
        </svg>
        {isLoading ? 'Generating...' : 'Share'}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {!shareSlug ? (
            // Not shared yet - show generate button
            <button
              onClick={generateShareLink}
              disabled={isLoading}
              style={{ backgroundColor: 'transparent', border: 'none' }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-all transform flex items-center gap-3 text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3.027 3.027 0 001.946-2.83 3 3 0 10-.001-4.089.5.5 0 00-.812.058l-4.35-2.18a3 3 0 100 3.364l4.35-2.18a.5.5 0 00.812.058A3 3 0 0115 8z" />
              </svg>
              <span>
                <div className="font-semibold text-gray-800">Generate Share Link</div>
                <div className="text-xs text-gray-500">Create a public link to share</div>
              </span>
            </button>
          ) : (
            // Already shared - show link options
            <>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Your Share Link
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.172 9.172a2 2 0 012.828 0l7.071-7.071a2 2 0 10-2.828-2.828L9.172 6.344a2 2 0 000 2.828z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-mono text-gray-700 truncate flex-1">
                    {getShareUrl()}
                  </span>
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                style={{ backgroundColor: 'transparent', border: 'none' }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 hover:scale-105 transition-all transform flex items-center gap-3 text-gray-800 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 flex-shrink-0 transition-colors ${copied ? 'text-green-500' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  {copied ? (
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6-1h6m-6 4h6m-6 4h6M9 5a1 1 0 11-2 0 1 1 0 012 0z" />
                  )}
                </svg>
                <span>
                  <div className="font-semibold text-gray-800">{copied ? 'Copied!' : 'Copy Link'}</div>
                  <div className="text-xs text-gray-500">
                    {copied ? 'Link copied to clipboard' : 'Copy to your clipboard'}
                  </div>
                </span>
              </button>

              <button
                onClick={openShareLink}
                style={{ backgroundColor: 'transparent', border: 'none' }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 hover:scale-105 transition-all transform flex items-center gap-3 text-gray-800 text-sm border-t border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <span>
                  <div className="font-semibold text-gray-800">View Shared Resume</div>
                  <div className="text-xs text-gray-500">Open in a new tab</div>
                </span>
              </button>
            </>
          )}

          {error && (
            <div className="px-4 py-2 border-t border-gray-200 bg-red-50">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareResumeButton;
