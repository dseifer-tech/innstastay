import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { validateHotelData, validateRequestBody, sanitizeError } from '@/lib/security'
import { log } from '@/lib/core/log'

// Normalize project ID to handle dummy values in CI/build environments
const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
  if (projectId.startsWith('dummy')) {
    return projectId.replace(/_/g, '-');
  }
  return projectId;
};

const client = createClient({
  projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

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

export async function POST(request: NextRequest) {
  try {
    // Security: Validate environment variables
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
      log.admin.error('Missing required environment variables for hotel import')
      return NextResponse.json({
        success: false,
        error: 'Server configuration error'
      }, { status: 500 })
    }

    const body = await request.json()
    
    // Security: Validate request body
    const bodyValidation = validateRequestBody(body)
    if (!bodyValidation.valid) {
      return NextResponse.json({
        success: false,
        error: bodyValidation.error || 'Invalid request body'
      }, { status: 400 })
    }

    const { hotel } = body

    // Security: Validate hotel data
    const hotelValidation = validateHotelData(hotel)
    if (!hotelValidation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid hotel data',
        details: hotelValidation.errors
      }, { status: 400 })
    }

    if (!hotel || !hotel.name || !hotel.property_token) {
      return NextResponse.json({
        success: false,
        error: 'Missing required hotel fields'
      }, { status: 400 })
    }

    // Generate slug from hotel name
    const slug = generateSlug(hotel.name)
    
    // Extract city and area from address
    const city = extractCityFromAddress(hotel.address)
    const area = extractAreaFromAddress(hotel.address)

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
      tags: hotel.tags || [], // Use provided tags or generate based on amenities and location
      seoTitle: hotel.seoTitle || hotel.name,
      seoDescription: hotel.seoDescription || hotel.description || `${hotel.name} - Book directly with no commissions.`,
      isActive: hotel.isActive !== false, // Default to true if not specified
      primaryImageUrl: hotel.primaryImageUrl || hotel.thumbnail || '',
      bookingLinks: hotel.bookingLinks || [],
      token: hotel.property_token,
      officialBookingUrl: hotel.website || '',
      coordinates: hotel.latitude && hotel.longitude ? {
        _type: 'geopoint',
        lat: hotel.latitude,
        lng: hotel.longitude
      } : undefined
    }

    // Add auto-generated tags if no tags were provided
    if (!hotel.tags || hotel.tags.length === 0) {
      const autoTags = []
      if (hotel.amenities) {
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('pool'))) autoTags.push('pool')
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('gym'))) autoTags.push('fitness')
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('spa'))) autoTags.push('spa')
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('restaurant'))) autoTags.push('dining')
        if (hotel.amenities.some((a: string) => a.toLowerCase().includes('parking'))) autoTags.push('parking')
      }
      
      const hotelArea = hotel.area || area
      if (hotelArea.toLowerCase().includes('downtown')) autoTags.push('downtown')
      if (hotelArea.toLowerCase().includes('luxury') || hotel.hotel_class >= 4) autoTags.push('luxury')
      if (hotel.hotel_class <= 2) autoTags.push('budget')
      
      hotelDoc.tags = autoTags
    }

    // Create the hotel in Sanity
    const result = await client.create(hotelDoc)

    return NextResponse.json({
      success: true,
      hotel: result,
      message: `Successfully imported "${hotel.name}"`
    })

  } catch (error) {
    // Security: Log error but don't expose details to client
    log.admin.error('Error importing hotel:', error)
    
    return NextResponse.json({
      success: false,
      error: sanitizeError(error)
    }, { status: 500 })
  }
}
