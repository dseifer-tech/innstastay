import type { MetadataRoute } from 'next';

export const runtime = 'nodejs';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: [], // omit until prod domain is set
  };
}