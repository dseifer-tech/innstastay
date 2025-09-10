// Environment variable validation
import { log } from '@/lib/core/log';

export function validateEnv() {
  const required = {
    // Sanity CMS (required for hotel data)
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    
    // External services
    SERPAPI_KEY: process.env.SERPAPI_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    // In development, log warning but don't throw error
    if (process.env.NODE_ENV === 'development') {
      log.env.warn(`Missing environment variables (optional in development): ${missing.join(', ')}`);
      return {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || null,
        SERPAPI_KEY: process.env.SERPAPI_KEY || null,
        NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || null,
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
