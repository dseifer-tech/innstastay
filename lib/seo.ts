import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/cms/settings'

export async function buildPageMetadata(input: Partial<Metadata>): Promise<Metadata> {
  const settings = await getSiteSettings()
  const defaults = settings?.defaultSeo || {}
  const title = input.title || defaults.title || 'InnstaStay'
  const description = input.description || defaults.description || ''
  const canonical = (input as any).alternates?.canonical || defaults.canonical
  const ogImage = (input as any).openGraph?.images || (defaults.ogImage ? [{ url: (defaults.ogImage as any).asset?._ref || '' }] : undefined)
  return {
    ...input,
    title,
    description,
    ...(canonical ? { alternates: { ...(input as any).alternates, canonical } } : {}),
    openGraph: {
      ...((input as any).openGraph || {}),
      title: (input as any).openGraph?.title || title,
      description: (input as any).openGraph?.description || description,
      images: ogImage
    },
    twitter: {
      ...((input as any).twitter || {}),
      card: (input as any).twitter?.card || 'summary_large_image'
    }
  }
}


