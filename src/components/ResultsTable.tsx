'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Dependency } from '@/types';
import { exportToCSV, exportToJSON } from '@/utils/exportData';

interface ResultsTableProps {
  dependencies: Dependency[];
  totalPackages: number;
  packagesWithUpdates: number;
}

type SortOption = 'name' | 'current' | 'latest' | 'type';
type SortOrder = 'asc' | 'desc';

function getUpdateBadgeColor(
  updateType: Dependency['updateType']
): {
  bg: string;
  text: string;
  label: string;
} {
  switch (updateType) {
    case 'major':
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Major Update' };
    case 'minor':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Minor Update',
      };
    case 'patch':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Patch Update',
      };
    case 'up-to-date':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Up-to-date',
      };
  }
}

function getSuggestionInfo(
  updateType: Dependency['updateType']
): {
  label: string;
  shortDesc: string;
  icon: React.JSX.Element;
  colorClass: string;
} {
  switch (updateType) {
    case 'major':
      return {
        label: 'Breaking Changes',
        shortDesc: 'Review changelog',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        colorClass: 'text-red-700 bg-red-50 border-red-200',
      };
    case 'minor':
      return {
        label: 'New Features',
        shortDesc: 'Safe update',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    case 'patch':
      return {
        label: 'Bug Fixes',
        shortDesc: 'Recommended',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    case 'up-to-date':
      return {
        label: 'Optimal',
        shortDesc: 'Up to date',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
      };
  }
}

export default function ResultsTable({
  dependencies,
  totalPackages,
  packagesWithUpdates,
}: ResultsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('type');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure hydration matches between server and client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor' | 'patch' | 'up-to-date'>('all');

  const majorUpdates = dependencies.filter((d) => d.updateType === 'major')
    .length;
  const minorUpdates = dependencies.filter((d) => d.updateType === 'minor')
    .length;
  const patchUpdates = dependencies.filter((d) => d.updateType === 'patch')
    .length;

  // Filter and sort dependencies
  const filteredAndSortedDependencies = useMemo(() => {
    let result = [...dependencies];

    // Filter by update type
    if (filterType !== 'all') {
      result = result.filter((dep) => dep.updateType === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (dep) =>
          dep.name.toLowerCase().includes(query) ||
          dep.currentVersion.toLowerCase().includes(query) ||
          dep.latestVersion.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'current':
          aVal = a.currentVersion;
          bVal = b.currentVersion;
          break;
        case 'latest':
          aVal = a.latestVersion;
          bVal = b.latestVersion;
          break;
        case 'type':
          aVal = a.updateType;
          bVal = b.updateType;
          break;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [dependencies, searchQuery, sortBy, sortOrder, filterType]);

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-8">
        {/* Export Buttons - Horizontal on Mobile */}
        <div className="flex flex-row items-center justify-center sm:justify-end gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => {
              if (!isHydrated) return;
              const date = new Date().toISOString().split('T')[0];
              exportToCSV(dependencies, `npm-dependencies-${date}.csv`);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-auto flex-1 sm:flex-none justify-center"
            title="Export to CSV/Excel format"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              if (!isHydrated) return;
              const date = new Date().toISOString().split('T')[0];
              exportToJSON(dependencies, `npm-dependencies-${date}.json`);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-auto flex-1 sm:flex-none justify-center"
            title="Export to JSON format"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h2m8-16h2a2 2 0 012 2v12a2 2 0 01-2 2h-2m-8-8h8"
              />
            </svg>
            <span>Export JSON</span>
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-4 sm:mb-6 space-y-3">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search packages, versions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm text-gray-900 bg-white placeholder-gray-400 transition-all"
            />
          </div>

          {/* Filter and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Update Type Filter - Colors Match Listing Badges */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filterType === 'all'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white border-2 border-gray-400 text-gray-700 hover:border-gray-500'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('major')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filterType === 'major'
                  ? 'bg-red-100 text-red-800 border-2 border-red-300 shadow-md'
                  : 'bg-white border-2 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50'
                  }`}
              >
                Major
              </button>
              <button
                onClick={() => setFilterType('minor')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filterType === 'minor'
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-md'
                  : 'bg-white border-2 border-yellow-300 text-yellow-700 hover:border-yellow-400 hover:bg-yellow-50'
                  }`}
              >
                Minor
              </button>
              <button
                onClick={() => setFilterType('patch')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filterType === 'patch'
                  ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-md'
                  : 'bg-white border-2 border-green-300 text-green-700 hover:border-green-400 hover:bg-green-50'
                  }`}
              >
                Patch
              </button>
              <button
                onClick={() => setFilterType('up-to-date')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filterType === 'up-to-date'
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-md'
                  : 'bg-white border-2 border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50'
                  }`}
              >
                Up-to-date
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2 sm:gap-3 sm:ml-auto">
              {/* Clean Sort Dropdown - Match Table Headers */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-10 pr-8 py-2 border-2 border-gray-300 bg-white text-gray-900 font-medium text-xs sm:text-sm rounded-lg cursor-pointer hover:border-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="name">Package</option>
                  <option value="current">Current</option>
                  <option value="latest">Latest</option>
                  <option value="type">Update Type</option>
                </select>
                {/* Dynamic Icon Based on Selection */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {sortBy === 'name' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {sortBy === 'current' && (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  {sortBy === 'latest' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {sortBy === 'type' && (
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                </div>
                {/* Dropdown Arrow */}
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Clean Sort Direction Button */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 sm:px-4 py-2 border-2 border-gray-300 bg-white text-gray-900 font-bold text-xs sm:text-sm rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all min-w-[60px]"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortOrder === 'asc' ? 'ASC' : 'DESC'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats - Enhanced Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Packages */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-300 p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-blue-800 text-xs sm:text-sm font-semibold">Total Packages</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-900">{totalPackages}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-30 rounded-full"></div>
          </div>

          {/* Need Updates */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-200 to-orange-300 p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-orange-800 text-xs sm:text-sm font-semibold">Need Updates</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-orange-900">{packagesWithUpdates}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-30 rounded-full"></div>
          </div>

          {/* Major Updates */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-200 to-pink-300 p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-rose-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-rose-800 text-xs sm:text-sm font-semibold">Major Updates</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-rose-900">{majorUpdates}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-30 rounded-full"></div>
          </div>

          {/* Minor/Patch */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-200 to-teal-300 p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-emerald-800 text-xs sm:text-sm font-semibold">Minor/Patch</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-900">{minorUpdates + patchUpdates}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-30 rounded-full"></div>
          </div>
        </div>

        {/* Table - Mobile Optimized */}
        <div className="relative">
          {/* Scroll Indicator for Mobile */}
          <div className="md:hidden mb-2 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Scroll to see all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </p>
          </div>

          <div className="overflow-hidden border-2 border-gray-200 rounded-2xl shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base min-w-[640px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Package</span>
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Current</span>
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>Latest</span>
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Update Type</span>
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Suggestion</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedDependencies.map((dep) => {
                    const badgeColor = getUpdateBadgeColor(dep.updateType);
                    const suggestionInfo = getSuggestionInfo(dep.updateType);
                    const publishedDate = dep.publishedDate ? new Date(dep.publishedDate).toLocaleDateString() : '';

                    return (
                      <tr
                        key={`${dep.name}-${dep.isDevDependency}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <a
                                href={`https://www.npmjs.com/package/${dep.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                              >
                                {dep.name}
                              </a>
                              {dep.isDevDependency && (
                                <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded font-medium flex-shrink-0">
                                  dev
                                </span>
                              )}
                              {dep.license && (
                                <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200 flex-shrink-0">
                                  {dep.license}
                                </span>
                              )}
                            </div>
                            {dep.description && (
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 max-w-xs" title={dep.description}>
                                {dep.description}
                              </p>
                            )}
                            {dep.homepage && (
                              <a
                                href={dep.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-500 hover:underline mt-0.5 inline-flex items-center gap-1 w-fit"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Homepage
                              </a>
                            )}
                          </div>
                          {dep.error && (
                            <p className="text-red-600 text-xs mt-1">{dep.error}</p>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className="font-mono text-xs sm:text-sm text-gray-700">
                            {dep.currentVersion}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs sm:text-sm text-gray-700">
                              {dep.latestVersion}
                            </span>
                            {publishedDate && (
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                {publishedDate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span
                            className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${badgeColor.bg} ${badgeColor.text}`}
                          >
                            {badgeColor.label}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${suggestionInfo.colorClass} w-fit`}>
                            <div className="flex-shrink-0">
                              {suggestionInfo.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold leading-none mb-0.5">{suggestionInfo.label}</span>
                              <span className="text-[10px] opacity-90 leading-none">{suggestionInfo.shortDesc}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view for suggestions (below md breakpoint) */}
            <div className="md:hidden mt-4 space-y-3 px-4">
              {
                filteredAndSortedDependencies.length === 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-700 text-sm">No packages match your search</p>
                  </div>
                ) : (
                  filteredAndSortedDependencies.map((dep) => {
                    const suggestionInfo = getSuggestionInfo(dep.updateType);
                    return (
                      <div key={`${dep.name}-suggestion`} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <p className="font-mono text-xs font-medium text-gray-900 mb-1">{dep.name}</p>
                          {dep.isDevDependency && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded font-medium">dev</span>
                          )}
                        </div>
                        {dep.description && (
                          <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{dep.description}</p>
                        )}
                        <div className={`mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${suggestionInfo.colorClass} w-full`}>
                          <div className="flex-shrink-0">
                            {suggestionInfo.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold leading-none mb-0.5">{suggestionInfo.label}</span>
                            <span className="text-[10px] opacity-90 leading-none">{suggestionInfo.shortDesc}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              }
            </div>

            {/* No results message for table view */}
            {
              filteredAndSortedDependencies.length === 0 && (
                <div className="hidden md:block bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mt-4">
                  <p className="text-blue-700">No packages match your search</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
