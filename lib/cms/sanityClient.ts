export const runtime = 'nodejs';

import { draftMode } from 'next/headers';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token     = process.env.SANITY_API_TOKEN;

const SKIP = process.env.SKIP_SANITY === '1';
const isFake = !projectId || projectId === 'dummy-project-id' || !dataset;

type SanityLike = { fetch<T=unknown>(q:string, p?:any, o?:any): Promise<T|null> };

export async function getClient(): Promise<SanityLike> {
  if (SKIP || isFake) {
    return { async fetch() { return null; } };
  }
  const { createClient } = await import('next-sanity'); // lazy server import
  const preview = draftMode().isEnabled;

  return createClient({
    projectId,
    dataset,
    apiVersion: '2023-10-01',
    useCdn: !preview && !token,
    ...(preview && token ? { token, perspective: 'previewDrafts' as any } : {})
  }) as unknown as SanityLike;
}