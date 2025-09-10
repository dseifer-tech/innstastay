import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Normalize project ID to handle dummy values in CI/build environments
const normalizeProjectId = (projectId: string | undefined): string => {
  if (!projectId) return 'dummy-project-id';
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

const client = shouldSkipSanity() 
  ? createNoOpClient()
  : createClient({
      projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
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
