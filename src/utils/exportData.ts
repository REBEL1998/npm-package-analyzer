import { Dependency } from '@/types';

/**
 * Export dependencies data to CSV format (Excel compatible)
 */
export function exportToCSV(
  dependencies: Dependency[],
  filename: string = 'npm-dependencies.csv'
): void {
  // Prepare CSV headers
  const headers = [
    'Package Name',
    'NPM Link',
    'Type',
    'Current Version',
    'Latest Version',
    'Update Type',
    'Status',
  ];

  // Prepare CSV rows
  const rows = dependencies.map((dep) => [
    dep.name,
    `https://www.npmjs.com/package/${dep.name}`,
    dep.isDevDependency ? 'Dev' : 'Prod',
    dep.currentVersion,
    dep.latestVersion,
    dep.updateType.charAt(0).toUpperCase() + dep.updateType.slice(1),
    dep.error || getUpdateStatus(dep.updateType),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  // Create blob and download
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export dependencies data to JSON format
 */
export function exportToJSON(
  dependencies: Dependency[],
  filename: string = 'npm-dependencies.json'
): void {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalPackages: dependencies.length,
    packagesWithUpdates: dependencies.filter(
      (d) => d.updateType !== 'up-to-date'
    ).length,
    dependencies: dependencies.map((dep) => ({
      ...dep,
      npmLink: `https://www.npmjs.com/package/${dep.name}`,
    })),
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Get human-readable status message for update type
 */
function getUpdateStatus(updateType: Dependency['updateType']): string {
  switch (updateType) {
    case 'major':
      return 'Major Update Available - Review Breaking Changes';
    case 'minor':
      return 'Minor Update Available - Safe to Update';
    case 'patch':
      return 'Patch Update Available - Update Recommended';
    case 'up-to-date':
      return 'Up to Date';
    default:
      return 'Unknown';
  }
}

/**
 * Trigger file download in browser
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
