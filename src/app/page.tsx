'use client';

import { useState, useEffect } from 'react';
import JsonModal from '@/components/JsonModal';
import ResultsTable from '@/components/ResultsTable';
import NpmAnalyzerLanding from '@/components/NpmAnalyzerLanding';
import { AnalysisResult } from '@/types';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'listing'>('landing');

  // Ensure hydration matches between server and client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    if (result.success) {
      setCurrentPage('listing');
      setIsModalOpen(false);
    }
  };

  const handleTryNow = () => {
    setIsModalOpen(true);
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setAnalysisResult(null);
    setIsModalOpen(false);
  };

  const handleOpenModalFromListing = () => {
    setIsModalOpen(true);
  };

  // Don't render interactive elements until hydration is complete
  // But render the full layout structure to avoid hydration mismatch
  const contentToRender = isHydrated ? (
    currentPage === 'landing' ? (
      <NpmAnalyzerLanding onTryNow={handleTryNow} />
    ) : analysisResult?.success ? (
      <div className="">
        {/* Results */}
        <ResultsTable
          dependencies={analysisResult.dependencies}
          totalPackages={analysisResult.totalPackages || 0}
          packagesWithUpdates={analysisResult.packagesWithUpdates || 0}
        />
      </div>
    ) : (
      <div className="bg-white rounded-lg sm:rounded-xl border border-red-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-medium text-red-800 mb-1">
              Analysis Failed
            </h3>
            <p className="text-red-700 text-xs sm:text-sm mb-2 sm:mb-3">{analysisResult?.error}</p>
            <button
              onClick={() => setAnalysisResult(null)}
              className="text-red-600 hover:text-red-700 font-medium underline text-xs sm:text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  ) : (
    // Show minimal placeholder during hydration
    <div className="flex flex-col items-center justify-center py-4 sm:py-6">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md w-full" />
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${currentPage === 'landing' ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600' : 'bg-white'}`}>
      <main className={`w-full flex-grow ${currentPage === 'landing' ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600' : 'bg-white'}`}>
        {currentPage === 'landing' ? (
          <>
            <NpmAnalyzerLanding onTryNow={handleTryNow} />
          </>
        ) : (
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Full-Width Header */}
            <div className="w-full bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200/50">
              <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Title Section */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      NPM Package Analyzer
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">Analyze and track your package dependencies</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {analysisResult?.success && (
                      <button
                        onClick={handleOpenModalFromListing}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group w-auto"
                        title="Analyze a new package.json file"
                      >
                        <svg
                          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="hidden sm:inline">New Analysis</span>
                        <span className="sm:hidden">New</span>
                      </button>
                    )}

                    <button
                      onClick={handleBackToLanding}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="hidden sm:inline">Back to Home</span>
                      <span className="sm:hidden">Home</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
              {/* Separation Section */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 text-sm font-medium text-gray-500">
                    Analysis Results
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="pb-8">
                {contentToRender}
              </div>
            </div>
          </div>
        )}
      </main>

      {currentPage === 'listing' && (
        <>
          {/* Modern Footer for Listing Page - Full Width */}
          <footer className="w-full bg-white/80 backdrop-blur-sm shadow-md border-t border-gray-200/50 mt-12">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Branding Section */}
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    NPM Package Analyzer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep your dependencies up to date
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Built with</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-blue-50 rounded-md font-medium">Next.js</span>
                    <span className="px-2 py-1 bg-purple-50 rounded-md font-medium">TypeScript</span>
                    <span className="px-2 py-1 bg-pink-50 rounded-md font-medium">Tailwind</span>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600 mb-2">Developed with ❤️ by</p>
                  <a
                    href="https://www.linkedin.com/in/parth-chudasama/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Parth Chudasama
                  </a>
                </div>
              </div>

              {/* Bottom Line */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  © 2025 NPM Package Analyzer
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modal */}
      <JsonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAnalysisComplete}
      />
    </div>
  );
}
