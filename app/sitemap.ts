import { MetadataRoute } from 'next'
import { getHotelsForSearch } from '@/lib/hotelSource'
import { getAllPageSlugs } from '@/lib/cms/page'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.innstastay.com'
  
  // Get all hotels
  const hotels = await getHotelsForSearch()
  // Get CMS pages
  const pages = await getAllPageSlugs().catch(() => []) as any[]
  
  // Generate hotel URLs
  const hotelUrls = hotels.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  // Generate CMS page URLs
  const pageUrls = (pages || []).map((p: any) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]
  
  return [...staticPages, ...pageUrls, ...hotelUrls]
}
