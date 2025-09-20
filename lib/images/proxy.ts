import { signProxyUrl } from '@/lib/crypto/sign';
import { ENV } from '@/lib/env';

/**
 * Build a signed image proxy URL for frontend use
 */
export function buildSignedImageUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.startsWith('http')) return rawUrl;
  
  // Don't proxy Sanity URLs
  if (rawUrl.includes('cdn.sanity.io')) return rawUrl;
  
  // Don't proxy if already proxied
  if (rawUrl.includes('/api/hotel-images')) return rawUrl;
  
  const requireSignature = ENV.IMAGE_PROXY_REQUIRE_SIGNATURE === 'true';
  
  if (requireSignature) {
    const signature = signProxyUrl(rawUrl);
    return `/api/hotel-images?url=${encodeURIComponent(rawUrl)}&sig=${signature}`;
  }
  
  return `/api/hotel-images?url=${encodeURIComponent(rawUrl)}`;
}
