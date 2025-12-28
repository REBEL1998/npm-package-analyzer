import React from "react";
import { NpmAnalyzerProps } from '@/types';

const NpmAnalyzerLanding: React.FC<NpmAnalyzerProps & { onTryNow?: () => void }> = ({
  title = "NPM Package Analyzer",
  subtitle = "Analyze. Compare. Upgrade.",
  description = "Paste your package.json and instantly discover outdated dependencies with upgrade suggestions.",
  backgroundGradient = "from-indigo-600 via-purple-600 to-blue-600",
  showIcons = true,
  onTryNow,
}) => {

  return (
    <section
      className={`relative w-full h-screen overflow-hidden bg-gradient-to-br ${backgroundGradient} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:px-8 text-white flex flex-col justify-center`}
      style={{ background: 'linear-gradient(to bottom right, rgb(79, 70, 229), rgb(147, 51, 234), rgb(37, 99, 235))' }}
    >

      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-grow">
        {/* Left Content */}
        <div className="space-y-5 animate-slide-in-fast">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium animate-scale-in">
            ✨ Developer Tool
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-shimmer" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
            {title}
          </h1>

          <h2 className="text-xl text-blue-100 animate-slide-in-delay">
            {subtitle}
          </h2>

          <p className="max-w-xl text-blue-100 animate-slide-in-delay-2">
            {description}
          </p>

          <button
            onClick={onTryNow}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform animate-bounce-subtle"
          >
            <svg
              className="w-5 h-5"
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
            Try Now
          </button>
        </div>

        {/* Right Mock UI */}
        <div className="relative">
          <div className="rounded-xl bg-white/90 text-gray-800 shadow-2xl backdrop-blur p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <pre className="rounded-lg bg-gray-900 p-4 text-sm text-green-400 overflow-auto">
              {`{
  "react": "^17.0.2",
  "axios": "^0.21.1",
  "eslint": "^7.32.0"
}`}
            </pre>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>react</span>
                <span className="text-orange-500 font-medium">Major update</span>
              </div>
              <div className="flex justify-between">
                <span>axios</span>
                <span className="text-yellow-500 font-medium">Minor update</span>
              </div>
              <div className="flex justify-between">
                <span>eslint</span>
                <span className="text-green-600 font-medium">Up to date</span>
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          {showIcons && (
            <>
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                🔍
              </div>
              <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                📦
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compact Footer - Minimal Space */}
      <footer className="relative z-10 mt-auto w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            {/* Left: Tech Stack */}
            <div className="flex items-center gap-2">
              <span className="text-blue-100 text-xs">Built with</span>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs text-white">Next.js</span>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs text-white">TypeScript</span>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs text-white">Tailwind</span>
            </div>

            {/* Right: Developer */}
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <span>Made with ❤️ by</span>
              <a
                href="https://www.linkedin.com/in/parth-chudasama/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-blue-200 transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Parth Chudasama
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default NpmAnalyzerLanding;