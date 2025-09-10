import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/core/log'
import { hotelCreateSchema } from '@/lib/validations/hotel'
import { validateRequestBody } from '@/lib/security'

export const runtime = 'nodejs';

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
        details: validationResult.error.issues
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

    // Use the new guarded Sanity client
    const { getClient } = await import('@/lib/cms/sanityClient');
    const client = await getClient();
    
    // Check if it's the no-op client
    if (process.env.SKIP_SANITY === '1') {
      log.admin.info('SKIP_SANITY=1, hotel creation skipped:', validatedData.name);
      return NextResponse.json({
        success: true,
        hotel: { _id: 'dummy-id', ...hotelDoc },
        message: `Hotel creation skipped (SKIP_SANITY=1): ${validatedData.name}`
      });
    }

    // For real Sanity client, we need to cast it and call create properly
    const result = await (client as any).create(hotelDoc)

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