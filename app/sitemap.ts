import { MetadataRoute } from 'next'
import { getHotelsForSearch } from '@/lib/hotelSource'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.innstastay.com'
  
  // Static marketing pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/hotels/toronto-downtown`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]
  
  // Hotels-only: Get hotels if not in CI skip mode
  if (process.env.SKIP_SANITY === '1') {
    return staticPages
  }
  
  try {
    const hotels = await getHotelsForSearch()
    const hotelUrls = hotels.map((hotel) => ({
      url: `${baseUrl}/hotels/${hotel.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    return [...staticPages, ...hotelUrls]
  } catch (error) {
    console.warn('Sitemap: Failed to fetch hotels, returning static pages only:', error)
    return staticPages
  }
}
