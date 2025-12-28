import { PackageJsonInput } from '@/types';

export interface ValidationResult {
  valid: boolean;
  data?: PackageJsonInput;
  error?: string;
}

/**
 * Validate and parse package.json content
 */
export function validatePackageJson(content: string): ValidationResult {
  try {
    if (!content || content.trim().length === 0) {
      return {
        valid: false,
        error: 'Please paste your package.json content',
      };
    }

    const parsed = JSON.parse(content);

    // Check if it has dependencies or devDependencies
    if (!parsed.dependencies && !parsed.devDependencies) {
      return {
        valid: false,
        error:
          'No dependencies or devDependencies found in your package.json',
      };
    }

    // Validate dependencies are objects
    if (
      parsed.dependencies &&
      typeof parsed.dependencies !== 'object'
    ) {
      return {
        valid: false,
        error: 'Dependencies must be an object',
      };
    }

    if (
      parsed.devDependencies &&
      typeof parsed.devDependencies !== 'object'
    ) {
      return {
        valid: false,
        error: 'DevDependencies must be an object',
      };
    }

    return {
      valid: true,
      data: parsed,
    };
  } catch (error) {
    let errorMessage = 'Invalid JSON format';
    if (error instanceof SyntaxError) {
      errorMessage = `JSON Error: ${error.message}`;
    }
    return {
      valid: false,
      error: errorMessage,
    };
  }
}
