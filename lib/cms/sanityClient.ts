import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = '2023-10-01'

export function getClient() {
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


