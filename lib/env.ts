// Environment variable validation
import { log } from '@/lib/core/log';

export function validateEnv() {
  const required = {
    SERPAPI_KEY: process.env.SERPAPI_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    // In development, log warning but don't throw error
    if (process.env.NODE_ENV === 'development') {
      log.env.warn(`Missing environment variables (optional in development): ${missing.join(', ')}`);
      return {
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
