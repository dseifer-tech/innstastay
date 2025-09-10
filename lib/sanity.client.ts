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

// Check if we should skip Sanity (CI mode or missing envs)
const shouldSkipSanity = () => {
  return (
    process.env.SKIP_SANITY === '1' ||
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.startsWith('dummy')
  );
};

// Create a no-op client for CI/build environments
const createNoOpClient = () => ({
  fetch: async () => {
    console.warn('Sanity client: SKIP_SANITY=1 or dummy envs, returning empty results');
    return [];
  },
  delete: async (id: string) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping delete operation for:', id);
    return { success: true };
  },
  create: async (doc: any) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping create operation for:', doc._type);
    return { _id: 'dummy-id', _type: doc._type || 'hotel' };
  },
  createOrReplace: async (doc: any) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping createOrReplace operation for:', doc._type);
    return { _id: 'dummy-id', _type: doc._type || 'hotel' };
  },
  patch: () => ({
    set: () => ({
      commit: async () => {
        console.warn('Sanity client: SKIP_SANITY=1, skipping patch operation');
        return { _id: 'dummy-id', _type: 'hotel' };
      }
    })
  })
});

export const sanityClient = shouldSkipSanity() 
  ? createNoOpClient()
  : createClient({
      projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: "2025-08-01",
      useCdn: true,
    });
