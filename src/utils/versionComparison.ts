/**
 * Parse version string, handling prefixes like ^, ~, >, >=, etc.
 */
export function parseVersion(versionString: string): string {
  // Remove common version prefixes: ^, ~, >, >=, <, <=, =, v
  return versionString.replace(/^[^\d]*/, '').split(/[+-]/)[0];
}

/**
 * Extract major, minor, patch from a version string
 */
export function extractVersionNumbers(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const parts = version.split('.');
  return {
    major: parseInt(parts[0] || '0', 10),
    minor: parseInt(parts[1] || '0', 10),
    patch: parseInt(parts[2] || '0', 10),
  };
}

/**
 * Compare two versions and determine update type
 * Returns: 'up-to-date' | 'patch' | 'minor' | 'major'
 */
export function compareVersions(
  currentVersion: string,
  latestVersion: string
): 'up-to-date' | 'patch' | 'minor' | 'major' {
  const cleanCurrent = parseVersion(currentVersion);
  const cleanLatest = parseVersion(latestVersion);

  if (cleanCurrent === cleanLatest) {
    return 'up-to-date';
  }

  const current = extractVersionNumbers(cleanCurrent);
  const latest = extractVersionNumbers(cleanLatest);

  // If latest is older than current, consider it up-to-date
  if (
    latest.major < current.major ||
    (latest.major === current.major && latest.minor < current.minor) ||
    (latest.major === current.major &&
      latest.minor === current.minor &&
      latest.patch < current.patch)
  ) {
    return 'up-to-date';
  }

  // Major version change
  if (latest.major > current.major) {
    return 'major';
  }

  // Minor version change
  if (latest.minor > current.minor) {
    return 'minor';
  }

  // Patch version change
  if (latest.patch > current.patch) {
    return 'patch';
  }

  return 'up-to-date';
}
