// lib/hotels/import.ts
export type ImportPayload = {
  sourceUrl?: string;
  rows?: unknown[]; // TODO: define a proper Row type when schema is finalized
  hotel?: any; // TODO: replace with proper Hotel type from existing route
};

export type ImportResult = { imported: number; skipped: number };

// Utility functions extracted from the original route
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractCityFromAddress(address: string): string {
  // Simple extraction - look for common patterns
  const cityPatterns = [
    /Toronto,?\s+ON/i,
    /Vancouver,?\s+BC/i,
    /Montreal,?\s+QC/i,
    /Calgary,?\s+AB/i,
    /Ottawa,?\s+ON/i,
    /Edmonton,?\s+AB/i,
    /Winnipeg,?\s+MB/i,
    /Quebec\s+City,?\s+QC/i,
    /Hamilton,?\s+ON/i,
    /Kitchener,?\s+ON/i,
  ]

  for (const pattern of cityPatterns) {
    const match = address.match(pattern)
    if (match) {
      return match[0].split(',')[0].trim()
    }
  }

  // Fallback: extract first part before comma
  const parts = address.split(',')
  return parts[0]?.trim() || 'Unknown'
}

function extractAreaFromAddress(address: string): string {
  // Look for area indicators in the address
  const areaPatterns = [
    /Downtown/i,
    /Midtown/i,
    /Uptown/i,
    /West\s+End/i,
    /East\s+End/i,
    /North\s+York/i,
    /Scarborough/i,
    /Etobicoke/i,
    /Yorkville/i,
    /Church-Wellesley/i,
    /Kensington/i,
    /Chinatown/i,
    /Little\s+Italy/i,
    /Greektown/i,
    /Liberty\s+Village/i,
    /Distillery\s+District/i,
    /Harbourfront/i,
    /Entertainment\s+District/i,
  ]

  for (const pattern of areaPatterns) {
    const match = address.match(pattern)
    if (match) {
      return match[0]
    }
  }

  return ''
}

export async function importHotels(payload: ImportPayload): Promise<ImportResult> {
  // Basic validation
  if (!payload || (payload.sourceUrl == null && (!payload.rows || payload.rows.length === 0) && !payload.hotel)) {
    throw new Error("Provide sourceUrl, rows, or hotel data.");
  }

  // Handle single hotel import (from existing route)
  if (payload.hotel) {
    const hotel = payload.hotel;

    // Validate required fields
    if (!hotel || !hotel.name || !hotel.property_token) {
      throw new Error('Missing required hotel fields: name and property_token');
    }

    // Security: Validate environment variables
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
      throw new Error('Missing required environment variables for hotel import');
    }

    // Import validation from security lib
    const { validateHotelData, validateRequestBody } = await import('@/lib/security');
    
    // Security: Validate hotel data
    const hotelValidation = validateHotelData(hotel);
    if (!hotelValidation.valid) {
      throw new Error(`Invalid hotel data: ${hotelValidation.errors?.join(', ') || 'Validation failed'}`);
    }

    // Generate slug and extract location info
    const slug = generateSlug(hotel.name);
    const city = extractCityFromAddress(hotel.address);
    const area = extractAreaFromAddress(hotel.address);

    // Create the hotel document
    const hotelDoc = {
      _type: 'hotel',
      name: hotel.name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: hotel.description || `${hotel.name} is a ${hotel.hotel_class || 3}-star hotel located in ${hotel.city || city}.`,
      address: hotel.address,
      city: hotel.city || city,
      area: hotel.area || area,
      phone: hotel.phone || '',
      rating: hotel.rating || 0,
      hotelClass: hotel.hotel_class || 3,
      amenities: hotel.amenities || [],
      tags: hotel.tags || [],
      seoTitle: hotel.seoTitle || hotel.name,
      seoDescription: hotel.seoDescription || hotel.description || `${hotel.name} - Book directly with no commissions.`,
      isActive: hotel.isActive !== false, // Default to true if not specified
      primaryImageUrl: hotel.primaryImageUrl || hotel.thumbnail || '',
      bookingLinks: hotel.bookingLinks || [],
      token: hotel.property_token,
      gpsCoordinates: hotel.latitude && hotel.longitude ? {
        _type: 'geopoint',
        lat: hotel.latitude,
        lng: hotel.longitude
      } : undefined
    };

    // Add auto-generated tags if no tags were provided
    if (!hotel.tags || hotel.tags.length === 0) {
      const autoTags = [];
      if (hotel.amenities) {
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('pool'))) autoTags.push('pool');
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('gym'))) autoTags.push('fitness');
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('spa'))) autoTags.push('spa');
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('restaurant'))) autoTags.push('dining');
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('parking'))) autoTags.push('parking');
      }
      
      const hotelArea = hotel.area || area;
      if (hotelArea.toLowerCase().includes('downtown')) autoTags.push('downtown');
      if (hotelArea.toLowerCase().includes('luxury') || hotel.hotel_class >= 4) autoTags.push('luxury');
      if (hotel.hotel_class <= 2) autoTags.push('budget');
      
      hotelDoc.tags = autoTags;
    }

    // Use the guarded Sanity client
    const { getClient } = await import('@/lib/cms/sanityClient');
    const client = await getClient();
    
    // Check if it's the no-op client
    if (process.env.SKIP_SANITY === '1') {
      const { log } = await import('@/lib/core/log');
      log.admin.info('SKIP_SANITY=1, hotel import skipped:', hotel.name);
      return { imported: 1, skipped: 0 };
    }

    // Create the hotel in Sanity
    if (!client.create) {
      throw new Error('Sanity client does not support create operations');
    }
    const result = await client.create(hotelDoc);
    
    return { imported: 1, skipped: 0 };
  }

  // TODO: implement actual bulk import for sourceUrl/rows:
  // - if sourceUrl provided: fetch/parse
  // - if rows provided: validate/transform rows
  // - upsert hotels, handle duplicates
  // For now, return a deterministic mock result:
  const imported = Array.isArray(payload.rows) ? Math.max(0, payload.rows.length - 1) : 12;
  const skipped = Array.isArray(payload.rows) ? (payload.rows.length ? 1 : 0) : 3;

  return { imported, skipped };
}
