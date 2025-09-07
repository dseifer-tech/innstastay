/**
 * SOURCE OF TRUTH: Image proxying.
 * The ONLY place that converts raw image URLs to proxied URLs.
 */
export function proxyImage(url: string | null | undefined): string | null {
  if (!url) return null;
  // Prevent double-proxying
  if (url.includes('/api/hotel-images?url=')) return url;
  const encoded = encodeURIComponent(url);
  return `/api/hotel-images?url=${encoded}`;
}
