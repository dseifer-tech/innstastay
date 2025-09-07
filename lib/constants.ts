// Constants for image optimization and placeholders

// 1x1 transparent PNG as base64 for blur placeholders
export const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAD0lEQVR4nGMAAQAABQABNqv1nQAAAABJRU5ErkJggg==';

// Image optimization constants
export const IMAGE_OPTIMIZATION = {
  // Default sizes for responsive images
  SIZES: {
    HERO: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
    CARD: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px',
    THUMBNAIL: '(max-width: 768px) 100vw, 320px',
  },
  // Cache durations
  CACHE: {
    PROXY: 'public, s-maxage=86400, stale-while-revalidate=604800', // 1 day + 1 week stale
    FALLBACK: 'public, s-maxage=600', // 10 minutes for fallback images
  }
};
