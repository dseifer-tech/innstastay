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

export const client = createClient({
  projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: 'production', // Use production dataset for both dev and prod
  apiVersion: '2023-05-03',
  useCdn: false, // Disable CDN for development
  // Removed token temporarily to test if that's causing the issue
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
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
