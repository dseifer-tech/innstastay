import { urlFor } from "@/lib/sanity.image";
import { log } from "./log";

/**
 * Generate Sanity image URL with width and height
 */
export function urlForSanity(imageRef: any, { w, h }: { w: number; h?: number }) {
  if (!imageRef) return undefined;
  
  try {
    let builder = urlFor(imageRef).width(w);
    if (h) builder = builder.height(h);
    const url = builder.url();
    
    // Validate that the URL is actually generated
    if (url && url !== 'undefined' && url !== 'null') {
      return url;
    }
  } catch (error) {
    log.img.warn('Failed to generate Sanity image URL:', error);
  }
  
  return undefined;
}

/**
 * Convert external URL to proxy URL for CORS bypass
 */
export function toProxyUrl(src: string): string {
  if (!src || !src.startsWith('http')) return src;
  
  // Don't proxy Sanity URLs
  if (src.includes('cdn.sanity.io')) return src;
  
  // Don't proxy if already proxied
  if (src.includes('/api/hotel-images')) return src;
  
  // Proxy external URLs
  return `/api/hotel-images?url=${encodeURIComponent(src)}`;
}

/**
 * Safe fallback image
 */
export const safeFallback = "/placeholder.jpg";
