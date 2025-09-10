// Environment variable validation
import { log } from '@/lib/core/log';

export function validateEnv() {
  // Normalize dummy values for build/CI environments
  const normalizeDummyValue = (value: string | undefined, fallback: string): string => {
    if (!value) return fallback;
    if (value.startsWith('dummy')) {
      // Convert dummy_project_id to dummy-project-id for Sanity compatibility
      return value.replace(/_/g, '-');
    }
    return value;
  };

  const required = {
    // Sanity CMS (required for hotel data)
    NEXT_PUBLIC_SANITY_PROJECT_ID: normalizeDummyValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'dummy-project-id'),
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || 'dummy-token',
    
    // External services
    SERPAPI_KEY: process.env.SERPAPI_KEY || 'dummy-key',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || 'G-DUMMY123456',
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    // In development, log warning but don't throw error
    if (process.env.NODE_ENV === 'development') {
      log.env.warn(`Missing environment variables (optional in development): ${missing.join(', ')}`);
      return {
        NEXT_PUBLIC_SANITY_PROJECT_ID: required.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: required.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_API_TOKEN: required.SANITY_API_TOKEN,
        SERPAPI_KEY: required.SERPAPI_KEY,
        NEXT_PUBLIC_GA_ID: required.NEXT_PUBLIC_GA_ID,
      };
    } else {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  return required;
}

// Validate on import
if (typeof window === 'undefined') {
  // Only validate on server side
  try {
    validateEnv();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.env.error('Environment validation failed:', errorMessage);
    // Don't throw in development to allow fallback data
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}
