// Utility functions for Sanity client configuration

/**
 * Normalize project ID to handle dummy values in CI/build environments
 * Converts dummy_project_id to dummy-project-id for Sanity compatibility
 */
export const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
  // Convert dummy_project_id to dummy-project-id for Sanity compatibility
  if (projectId.startsWith('dummy')) {
    return projectId.replace(/_/g, '-');
  }
  return projectId;
};

/**
 * Get normalized Sanity configuration for client creation
 */
export const getSanityConfig = () => ({
  projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});
