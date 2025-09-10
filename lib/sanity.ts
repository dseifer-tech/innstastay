import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Normalize project ID to handle dummy values in CI/build environments
const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
  // Convert dummy_project_id to dummy-project-id for Sanity compatibility
  if (projectId.startsWith('dummy')) {
    return projectId.replace(/_/g, '-');
  }
  return projectId;
};

// Check if we should skip Sanity (CI mode or missing envs)
const shouldSkipSanity = () => {
  return (
    process.env.SKIP_SANITY === '1' ||
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.startsWith('dummy')
  );
};

// Create a no-op client for CI/build environments
const createNoOpClient = () => ({
  fetch: async () => {
    console.warn('Sanity client: SKIP_SANITY=1 or dummy envs, returning empty results');
    return [];
  },
  delete: async (id: string) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping delete operation for:', id);
    return { success: true };
  },
  create: async (doc: any) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping create operation for:', doc._type);
    return { _id: 'dummy-id', _type: doc._type || 'hotel' };
  },
  createOrReplace: async (doc: any) => {
    console.warn('Sanity client: SKIP_SANITY=1, skipping createOrReplace operation for:', doc._type);
    return { _id: 'dummy-id', _type: doc._type || 'hotel' };
  },
  patch: () => ({
    set: () => ({
      commit: async () => {
        console.warn('Sanity client: SKIP_SANITY=1, skipping patch operation');
        return { _id: 'dummy-id', _type: 'hotel' };
      }
    })
  })
});

export const client = shouldSkipSanity() 
  ? createNoOpClient()
  : createClient({
      projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
      dataset: 'production', // Use production dataset for both dev and prod
      apiVersion: '2023-05-03',
      useCdn: false, // Disable CDN for development
      // Removed token temporarily to test if that's causing the issue
    });

const builder = shouldSkipSanity() ? null : imageUrlBuilder(client)

export function urlFor(source: any) {
  if (shouldSkipSanity()) {
    // Create a mock ImageUrlBuilder with all the methods needed
    const mockBuilder = {
      url: () => '/placeholder-image.jpg',
      auto: () => mockBuilder,
      width: () => mockBuilder,
      height: () => mockBuilder,
      fit: () => mockBuilder,
      crop: () => mockBuilder,
      quality: () => mockBuilder,
      format: () => mockBuilder,
      dpr: () => mockBuilder,
      blur: () => mockBuilder,
      sharpen: () => mockBuilder,
      rect: () => mockBuilder,
      focalPoint: () => mockBuilder,
      flipHorizontal: () => mockBuilder,
      flipVertical: () => mockBuilder,
      invert: () => mockBuilder,
      orientation: () => mockBuilder,
      pad: () => mockBuilder,
      bg: () => mockBuilder,
      saturation: () => mockBuilder,
      hue: () => mockBuilder,
      lightness: () => mockBuilder
    };
    return mockBuilder;
  }
  return builder!.image(source)
}

// Get all hotels with complete data
export async function getAllHotels() {
  return client.fetch(`
    *[_type == "hotel"] {
      _id,
      name,
      slug,
      city,
      area,
      address,
      rating,
      hotelClass,
      description,
      tags,
      amenities,
      bookingLinks,
      "images": images[]{
        "url": asset->url,
        "alt": alt
      },
      primaryImageUrl,
      "ogImage": ogImage{
        "url": asset->url,
        "alt": alt
      },
      phone,
      gpsCoordinates,
      seoTitle,
      seoDescription
    }
  `)
}



// Get hotel by token (for API compatibility)
export async function getHotelByToken(token: string) {
  const query = `
    *[_type == "hotel" && token == $token][0] {
      _id,
      name,
      slug,
      token,
      city,
      area,
      address,
      phone,
      rating,
      hotelClass,
      description,
      seoTitle,
      seoDescription,
      gpsCoordinates,
      "images": images[]{
        "url": asset->url,
        "alt": alt
      },
      "primaryImage": primaryImage{
        "url": asset->url,
        "alt": alt
      },
      "ogImage": ogImage{
        "url": asset->url,
        "alt": alt
      },
      tags,
      amenities,
      "bookingLinks": bookingLinks[isActive == true]{
        name,
        urlTemplate
      }
    }
  `
  return client.fetch(query, { token } as any)
}
