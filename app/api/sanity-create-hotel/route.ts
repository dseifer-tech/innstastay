import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const hotelData = await request.json();

    // Create the hotel document in Sanity
    const result = await client.create({
      _type: 'hotel',
      name: hotelData.name,
      slug: {
        _type: 'slug',
        current: hotelData.slug
      },
      address: hotelData.address,
      city: hotelData.city,
      area: hotelData.area,
      phone: hotelData.phone,
      rating: hotelData.rating,
      hotelClass: hotelData.hotelClass,
      description: hotelData.description,
      seoTitle: hotelData.seoTitle,
      seoDescription: hotelData.seoDescription,
      primaryImageUrl: hotelData.primaryImageUrl,
      amenities: hotelData.amenities,
      gpsCoordinates: hotelData.gpsCoordinates,
      token: hotelData.token,
      isActive: true
    });

    return NextResponse.json({
      success: true,
      hotelId: result._id,
      message: 'Hotel created successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    );
  }
}
