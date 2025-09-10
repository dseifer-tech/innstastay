import type { Metadata } from 'next'

// Static SEO defaults (no CMS dependency)
const DEFAULT_SEO = {
  title: 'InnstaStay - Commission-Free Hotel Booking in Toronto',
  description: 'Compare real-time direct hotel rates in downtown Toronto. No middlemen, no fees—book direct and save with InnstaStay.',
  canonical: 'https://www.innstastay.com',
  ogImage: '/og/homepage-1200x630.jpg'
}

export function buildPageMetadata(input: Partial<Metadata>): Metadata {
  const title = input.title || DEFAULT_SEO.title
  const description = input.description || DEFAULT_SEO.description
  const canonical = (input as any).alternates?.canonical || DEFAULT_SEO.canonical
  const ogImage = (input as any).openGraph?.images || [{ url: DEFAULT_SEO.ogImage }]
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


