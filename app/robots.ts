import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/admin-server/'],
    },
    sitemap: 'https://www.innstastay.com/sitemap.xml',
  }
}
