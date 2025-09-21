import type { MetadataRoute } from 'next';

export const runtime = 'nodejs';

export default function robots(): MetadataRoute.Robots {
  // Block indexing on staging (Vercel previews) or when explicitly set
  const blockIndexing = process.env.BLOCK_INDEXING === 'true';
  
  if (blockIndexing) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: [],
    };
  }

  // Production: allow indexing with sitemap
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://innstastay.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin*', '/api*', '/studio*']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}