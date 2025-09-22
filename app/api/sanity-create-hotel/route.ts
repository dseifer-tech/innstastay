import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { validateOrigin } from '@/lib/security';
import { ENV } from '@/lib/env';
import { hotelCreateSchema } from '@/lib/validations/hotel';
import { z } from 'zod';

export const runtime = 'nodejs';

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
    return null; // Return null to indicate no existing hotel found
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

// Extend shared hotel schema with Sanity-specific fields only
const CreateHotelSchema = hotelCreateSchema.extend({
  gpsCoordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
  // Note: Authentication relies on Bearer header, not token field
});

// Authentication check
function isAuthenticated(request: NextRequest): boolean {
  // Check for admin session token in headers
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.slice(7);
  return token === ENV.SANITY_API_TOKEN; // Use existing Sanity token for simplicity
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing authentication token' },
        { status: 401 }
      );
    }

    // 2. Origin validation for CSRF protection
    const origin = request.headers.get('origin');
    if (!validateOrigin(origin)) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid origin' },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    const rawData = await request.json();
    const validationResult = CreateHotelSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid hotel data', 
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const hotelData = validationResult.data;

    // 4. Check for duplicate slug
    const existingHotel = await client.fetch(
      `*[_type == "hotel" && slug.current == $slug][0]`,
      { slug: hotelData.slug }
    );
    
    if (existingHotel) {
      return NextResponse.json(
        { error: 'A hotel with this slug already exists' },
        { status: 409 }
      );
    }

    // 5. Create the hotel document in Sanity with normalized array fields
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
      // Normalize array fields to match Sanity schema expectations
      amenities: hotelData.amenities || [],
      tags: hotelData.tags || [],
      gpsCoordinates: hotelData.gpsCoordinates,
      // Note: token not stored in document for security
      isActive: true,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      hotelId: result._id,
      message: 'Hotel created successfully'
    });

  } catch (error) {
    console.error('Hotel creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating hotel' },
      { status: 500 }
    );
  }
}
