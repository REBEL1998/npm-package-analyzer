import { NextRequest, NextResponse } from 'next/server';
import { validatePackageJson } from '@/utils/jsonValidator';
import { fetchPackagesBatch } from '@/utils/npmRegistry';
import { compareVersions } from '@/utils/versionComparison';
import { AnalysisResult, Dependency, PackageJsonInput } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResult>> {
  try {
    const body = await request.json();
    const { packageJsonContent } = body;

    // Validate input
    if (!packageJsonContent) {
      return NextResponse.json(
        {
          success: false,
          dependencies: [],
          error: 'No package.json content provided',
        },
        { status: 400 }
      );
    }

    // Validate JSON
    const validation = validatePackageJson(packageJsonContent);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          dependencies: [],
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const packageData = validation.data as PackageJsonInput;

    // Collect all dependencies
    const allDependencies: Array<{
      name: string;
      version: string;
      isDev: boolean;
    }> = [];

    if (packageData.dependencies) {
      Object.entries(packageData.dependencies).forEach(([name, version]) => {
        allDependencies.push({ name, version, isDev: false });
      });
    }

    if (packageData.devDependencies) {
      Object.entries(packageData.devDependencies).forEach(([name, version]) => {
        allDependencies.push({ name, version, isDev: true });
      });
    }

    if (allDependencies.length === 0) {
      return NextResponse.json(
        {
          success: false,
          dependencies: [],
          error: 'No dependencies found to analyze',
        },
        { status: 400 }
      );
    }

    // Fetch package info from npm registry
    const packageNames = allDependencies.map((dep) => dep.name);
    const packageInfoMap = await fetchPackagesBatch(packageNames);

    // Build analysis results
    const dependencies: Dependency[] = allDependencies.map((dep) => {
      const packageInfo = packageInfoMap.get(dep.name);

      if (!packageInfo) {
        return {
          name: dep.name,
          currentVersion: dep.version,
          latestVersion: 'Unknown',
          updateType: 'up-to-date',
          isDevDependency: dep.isDev,
          error: 'Package not found in npm registry',
        };
      }

      const latestVersion = packageInfo['dist-tags']?.latest || 'Unknown';
      const updateType = compareVersions(dep.version, latestVersion);

      return {
        name: dep.name,
        currentVersion: dep.version,
        latestVersion,
        updateType,
        isDevDependency: dep.isDev,
      };
    });

    // Calculate statistics
    const packagesWithUpdates = dependencies.filter(
      (dep) => dep.updateType !== 'up-to-date'
    ).length;

    return NextResponse.json({
      success: true,
      dependencies,
      totalPackages: dependencies.length,
      packagesWithUpdates,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        dependencies: [],
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred during analysis',
      },
      { status: 500 }
    );
  }
}
