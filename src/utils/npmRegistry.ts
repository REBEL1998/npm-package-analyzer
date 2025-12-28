import { NPMPackageInfo } from '@/types';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const BATCH_SIZE = 10;
const DELAY_MS = 100;

/**
 * Fetch package info from npm registry
 */
async function fetchPackageInfo(
  packageName: string
): Promise<NPMPackageInfo | null> {
  try {
    const response = await fetch(
      `${NPM_REGISTRY_URL}/${encodeURIComponent(packageName)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Package not found
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as NPMPackageInfo;
  } catch (error) {
    console.error(`Error fetching ${packageName}:`, error);
    return null;
  }
}

/**
 * Fetch multiple packages with batching and delays to respect rate limits
 */
export async function fetchPackagesBatch(
  packageNames: string[]
): Promise<Map<string, NPMPackageInfo | null>> {
  const results = new Map<string, NPMPackageInfo | null>();

  for (let i = 0; i < packageNames.length; i += BATCH_SIZE) {
    const batch = packageNames.slice(i, i + BATCH_SIZE);

    const batchPromises = batch.map((name) => fetchPackageInfo(name));
    const batchResults = await Promise.all(batchPromises);

    batch.forEach((name, index) => {
      results.set(name, batchResults[index]);
    });

    // Add delay between batches to respect rate limits
    if (i + BATCH_SIZE < packageNames.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  return results;
}
