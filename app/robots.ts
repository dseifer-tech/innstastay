import type { MetadataRoute } from 'next';

export const runtime = 'nodejs';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
    sitemap: [],
  };
}