import { createClient } from "next-sanity";

// Normalize project ID to handle dummy values in CI/build environments
const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
  // Convert dummy_project_id to dummy-project-id for Sanity compatibility
  if (projectId.startsWith('dummy')) {
    return projectId.replace(/_/g, '-');
  }
  return projectId;
};

export const sanityClient = createClient({
  projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: "2025-08-01",
  useCdn: true,
});
