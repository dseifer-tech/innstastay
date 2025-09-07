import { urlForSanity, toProxyUrl } from "@/lib/core/img";
import type { Hotel } from "@/types/hotel";

export function fromSanityHotel(doc: any): Hotel {
  // Process gallery images with better error handling
  const gallery = Array.isArray(doc?.images) 
    ? doc.images
        .map((i: any) => urlForSanity(i, { w: 1600 }))
        .filter(Boolean)
        .filter((url: string) => url && url !== 'undefined' && url !== 'null')
    : [];

  // Process hero image with multiple fallback strategies
  let heroImage = undefined;
  
  // Strategy 1: Try primaryImageUrl first (external URL)
  if (doc?.primaryImageUrl && typeof doc.primaryImageUrl === 'string' && doc.primaryImageUrl.startsWith('http')) {
    heroImage = toProxyUrl(doc.primaryImageUrl);
  }
  
  // Strategy 2: Try primaryImage (Sanity image or object with url)
  if (!heroImage && doc?.primaryImage) {
    // If primaryImage is an object with a url property, use that
    if (doc.primaryImage.url && typeof doc.primaryImage.url === 'string' && doc.primaryImage.url.startsWith('http')) {
      heroImage = toProxyUrl(doc.primaryImage.url);
    } else {
      // Otherwise try to process it as a Sanity image
      heroImage = urlForSanity(doc.primaryImage, { w: 1600, h: 900 });
    }
  }
  
  // Strategy 3: Try imgUrl(primaryImage) for Sanity assets
  if (!heroImage && doc?.primaryImage) {
    heroImage = urlForSanity(doc.primaryImage, { w: 1600, h: 900 });
  }
  
  // Strategy 4: Use first gallery image
  if (!heroImage && gallery.length > 0) {
    heroImage = gallery[0];
  }
  
  // Strategy 5: Use any image from the images array
  if (!heroImage && Array.isArray(doc?.images) && doc.images.length > 0) {
    for (const img of doc.images) {
      const imgUrl = urlForSanity(img, { w: 1600, h: 900 });
      if (imgUrl) {
        heroImage = imgUrl;
        break;
      }
    }
  }

  return {
    id: doc.id,
    name: doc.name,
    city: doc.city,
    area: doc.area,
    address: doc.address,
    phone: doc.phone,
    rating: doc.rating,
    hotelClass: doc.hotelClass,
    description: doc.description,
    coordinates: doc.gpsCoordinates ? {
      lat: doc.gpsCoordinates.lat,
      lng: doc.gpsCoordinates.lng
    } : undefined,
    heroImage,
    gallery,
    tags: doc.tags || [],
    amenities: doc.amenities || [],
    bookingLinks: doc.bookingLinks || [],
    token: doc.token,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
  };
}
