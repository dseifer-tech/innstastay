import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { log } from '@/lib/core/log'
import { hotelCreateSchema } from '@/lib/validations/hotel'
import { validateRequestBody } from '@/lib/security'

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
    
    // Validate request body structure
    const bodyValidation = validateRequestBody(body)
    if (!bodyValidation.valid) {
      return NextResponse.json({
        success: false,
        error: bodyValidation.error
      }, { status: 400 })
    }
    
    // Validate hotel data with Zod schema
    const validationResult = hotelCreateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      }, { status: 400 })
    }
    
    const validatedData = validationResult.data

    // Create the hotel document using validated data
    const hotelDoc = {
      _type: 'hotel',
      name: validatedData.name,
      slug: {
        _type: 'slug',
        current: validatedData.slug
      },
      description: validatedData.description,
      address: validatedData.address,
      city: validatedData.city,
      area: validatedData.area || '',
      phone: validatedData.phone || '',
      rating: validatedData.rating || 0,
      hotelClass: validatedData.hotelClass || 3,
      amenities: validatedData.amenities || [],
      tags: validatedData.tags || [],
      seoTitle: validatedData.seoTitle || `${validatedData.name} - InnstaStay`,
      seoDescription: validatedData.seoDescription || validatedData.description,
      isActive: true,
      primaryImageUrl: validatedData.primaryImageUrl || '',
      bookingLinks: [],
      token: validatedData.token || '', // This will be set later when pricing is configured
      bookingTemplate: validatedData.bookingTemplate || ''
    }

    // Create the hotel in Sanity
    const result = await client.create(hotelDoc)

    return NextResponse.json({
      success: true,
      hotel: result,
      message: `Successfully created hotel: ${validatedData.name}`
    })

  } catch (error) {
    log.admin.error('Error creating hotel:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create hotel'
    }, { status: 500 })
  }
}
