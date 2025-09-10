import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'

// Normalize project ID to handle dummy values in CI/build environments
const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
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

const projectId = normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2023-10-01'

export function getClient() {
  if (shouldSkipSanity()) {
    return createNoOpClient();
  }
  
  const preview = draftMode().isEnabled
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    // Always include token server-side to ensure access to private datasets
    token: process.env.SANITY_API_TOKEN,
    perspective: (preview ? 'previewDrafts' : 'published') as any,
  })
}

// Deprecated: avoid importing the raw client directly elsewhere
// Prefer getClient() above for consistent preview/published behavior


