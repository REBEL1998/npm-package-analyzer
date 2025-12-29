# NPM Package Analyzer

A web application for analyzing npm dependencies and discovering available package updates. Paste your package.json content and get instant analysis with version comparison and upgrade recommendations.

## Key Highlights

- Analyzes both dependencies and devDependencies from package.json
- Compares current versions against latest versions from npm registry
- Categorizes updates as major, minor, patch, or up-to-date
- Batch processing with rate limiting for large dependency lists
- Search and filter functionality
- Export results to CSV or JSON format
- Real-time analysis status
- Responsive layout for all devices

## Table of Contents

- [Tech Stack](#tech-stack)
- [Feature Details](#feature-details)
- [Page Details](#page-details)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Development](#development)
- [Features Explained](#features-explained)
- [About This Project](#about-this-project)

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Backend**: Next.js API Routes
- **External Integration**: npm Registry API

## Feature Details

### Analysis
- Analyzes both `dependencies` and `devDependencies`
- Real-time version checking against npm registry
- Update categorization (major, minor, patch, up-to-date)
- Unavailable dependency error tracking
- Efficient batch processing

### Search and Filter
- Search by package name or version
- Filter by update type (All, Major, Minor, Patch, Up-to-date)
- Real-time results
- Case-insensitive

### Sort Options
- Package name (alphabetical)
- Current version
- Latest version
- Update type (severity)
- Ascending/Descending order

### Export
- CSV export
- JSON export
- Auto-generated timestamps

### Statistics
- Total packages count
- Updates needed count
- Major comparison breakdown
- Minor/patch comparison breakdown

## Page Details

### Landing Page
- Introduction and description
- Analysis start button
- Application preview
- Tech stack footer

### Analysis Results Page
- Navigation header
- Statistics dashboard
- Search, filter, and sort controls
- Export options
- Dependency table:
  - Package name (link to npm)
  - Current vs Latest version
  - Status badge
  - Dev dependency marker
  - Recommendation text

### Modal Dialog
- Input area for package.json
- Validation feedback
- Processing status indicators
- Action buttons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:

```bash
cd npm-package-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser:

```
http://localhost:3000
```

### Usage

1. Click "Try Now" on the home page
2. Paste package.json content into the modal
3. Click "Analyze"
4. View results in the table
5. Filter, search, or sort as needed
6. Export data via CSV/JSON buttons
7. Use "New Analysis" for additional files

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main application page
│   ├── globals.css                # Global styles
│   └── favicon.ico                # App icon
├── components/
│   ├── NpmAnalyzerLanding.tsx     # Landing page UI
│   ├── JsonModal.tsx              # Input modal
│   └── ResultsTable.tsx           # Results display
├── types/
│   └── index.ts                   # Type definitions
└── utils/
    ├── jsonValidator.ts           # Input validation
    ├── npmRegistry.ts             # API integration
    ├── versionComparison.ts       # Version logic
    └── exportData.ts              # Export handlers
```

## API Routes

### POST `/api/analyze`

Analyzes package.json content and returns update information.

**Request:**

```json
{
  "packageJsonContent": "{...}"
}
```

**Response:**

```json
{
  "success": true,
  "dependencies": [
    {
      "name": "react",
      "currentVersion": "^18.0.0",
      "latestVersion": "18.2.0",
      "updateType": "minor",
      "isDevDependency": false
    }
  ],
  "totalPackages": 1,
  "packagesWithUpdates": 1
}
```

## Development

### Production Build

```bash
npm run build
```

### Start Production

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Features Explained

### JSON Validation
Ensures valid JSON format and presence of dependency objects before processing. Provides specific error messages for invalid inputs.

### Version Comparison
Parses semantic versions and handles standard npm prefixes (~, ^, etc.). Categorizes updates into:
- **Major**: potential breaking changes
- **Minor**: backward-compatible new features
- **Patch**: backward-compatible bug fixes
- **Up-to-date**: latest version installed

### npm Registry Integration
Connects to the official npm registry to fetch real-time package data. Uses batch processing (10/batch) and rate limiting (100ms delay) to ensure reliability and handle large package files.

### Security & Error Handling
- No data storage or persistence
- Input sanitization
- Handles network timeouts and registry errors
- Graceful degradation if specific packages fail

## About This Project

**NPM Package Analyzer** helps developers manage dependencies by identifying outdated packages and providing upgrade recommendations.

**Developed by**: Parth Chudasama  
**Version**: 1.0.0  

---

Get Started: `npm run dev` and visit `http://localhost:3000`
