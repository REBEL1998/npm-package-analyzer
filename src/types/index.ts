export interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  updateType: 'up-to-date' | 'patch' | 'minor' | 'major';
  isDevDependency: boolean;
  error?: string;
  description?: string;
  homepage?: string;
  license?: string;
  publishedDate?: string;
}

export interface AnalysisResult {
  success: boolean;
  dependencies: Dependency[];
  error?: string;
  totalPackages?: number;
  packagesWithUpdates?: number;
}

export interface PackageJsonInput {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface NPMPackageInfo {
  name: string;
  description?: string;
  homepage?: string;
  license?: string;
  time?: {
    [key: string]: string;
  };
  'dist-tags': {
    latest: string;
  };
}


export interface NpmAnalyzerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundGradient?: string;
  showIcons?: boolean;
}
