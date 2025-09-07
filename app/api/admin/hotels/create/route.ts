import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { log } from '@/lib/core/log'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // This needs to be a token with write permissions
  useCdn: false,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'address', 'city']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Create the hotel document
    const hotelDoc = {
      _type: 'hotel',
      name: body.name,
      slug: {
        _type: 'slug',
        current: body.slug
      },
      description: body.description,
      address: body.address,
      city: body.city,
      area: body.area || '',
      phone: body.phone || '',
      rating: body.rating || 0,
      hotelClass: body.hotelClass || 3,
      amenities: body.amenities || [],
      tags: body.tags || [],
      seoTitle: body.seoTitle || `${body.name} - InnstaStay`,
      seoDescription: body.seoDescription || body.description,
      isActive: true,
      primaryImage: body.primaryImageUrl ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: body.primaryImageUrl
        }
      } : undefined,
      primaryImageUrl: body.primaryImageUrl || '',
      bookingLinks: [],
      token: '', // This will be set later when pricing is configured
      officialBookingUrl: ''
    }

    // Create the hotel in Sanity
    const result = await client.create(hotelDoc)

    return NextResponse.json({
      success: true,
      hotel: result,
      message: `Successfully created hotel: ${body.name}`
    })

  } catch (error) {
    log.admin.error('Error creating hotel:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create hotel'
    }, { status: 500 })
  }
}
