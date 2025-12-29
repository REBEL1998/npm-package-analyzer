'use client';

import { useRef, useState, useEffect } from 'react';
import { AnalysisResult } from '@/types';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: AnalysisResult) => void;
}

export default function JsonModal({ isOpen, onClose, onSubmit }: JsonModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure hydration matches between server and client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAnalyze = async () => {
    const content = textareaRef.current?.value;

    if (!content || content.trim().length === 0) {
      setError('Please paste your package.json content');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageJsonContent: content,
        }),
      });

      const result: AnalysisResult = await response.json();

      if (!response.ok) {
        setError(result.error || 'An error occurred during analysis');
      } else {
        onSubmit(result);
        handleClose();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
    setError(null);
    onClose();
  };

  if (!isHydrated || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center rounded-t-lg sm:rounded-t-xl">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Analyze Package.json
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <label className="block">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm sm:text-base font-medium text-gray-700 block">
                    Paste your package.json file contents:
                  </span>
                  <button
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.value = JSON.stringify({
                          "name": "sample-project",
                          "version": "1.0.0",
                          "dependencies": {
                            "react": "^16.8.0",
                            "react-dom": "^16.8.0",
                            "next": "10.0.0",
                            "axios": "^0.19.0",
                            "moment": "^2.24.0",
                            "uuid": "^3.4.0"
                          },
                          "devDependencies": {
                            "typescript": "^3.9.7",
                            "eslint": "^7.0.0"
                          }
                        }, null, 2);
                      }
                    }}
                    className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-in-out -skew-x-12 origin-left" />
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Auto-Fill Sample</span>
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={12}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base font-mono leading-relaxed focus:outline-none"
                  placeholder={`{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}`}
                  disabled={loading}
                />
              </label>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs sm:text-sm font-medium mb-1">Error</p>
                  <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Sticky */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 rounded-b-lg sm:rounded-b-xl flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 sm:px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 sm:px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
