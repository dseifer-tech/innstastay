/**
 * Regression test for /api/sanity-create-hotel endpoint
 * 
 * Tests that the endpoint correctly handles array fields (amenities, tags)
 * and uses the shared validation schema.
 */

import { NextRequest } from 'next/server';

// Mock the ENV module before importing the route
jest.mock('@/lib/env', () => ({
  ENV: {
    SANITY_API_TOKEN: 'test-token-12345',
    ALLOWED_ORIGINS: 'http://localhost:3000,https://test.com'
  }
}));

import { POST } from '@/app/api/sanity-create-hotel/route';

// Mock environment variables for testing
const mockEnv = {
  SKIP_SANITY: '1',
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project',
  NEXT_PUBLIC_SANITY_DATASET: 'test',
  SANITY_API_TOKEN: 'test-token-12345',
  ALLOWED_ORIGINS: 'http://localhost:3000,https://test.com'
};

// Store original env
const originalEnv = process.env;

describe('/api/sanity-create-hotel', () => {
  beforeEach(() => {
    // Set test environment
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should accept payload with amenities and tags arrays', async () => {
    const payload = {
      name: 'Test Hotel',
      slug: 'test-hotel-' + Date.now(), // Make slug unique to avoid conflicts
      description: 'A test hotel for validation',
      address: '123 Test Street',
      city: 'Toronto',
      area: 'Downtown',
      phone: '+1-416-555-0123',
      rating: 4.5,
      hotelClass: 4,
      amenities: ['Free WiFi', 'Restaurant', 'Pool'], // Array as expected by shared schema
      tags: ['boutique', 'downtown'], // Array as expected by shared schema
      seoTitle: 'Test Hotel - Book Direct',
      seoDescription: 'Test hotel in downtown Toronto',
      primaryImageUrl: 'https://example.com/image.jpg',
      gpsCoordinates: {
        lat: 43.651070,
        lng: -79.347015
      }
      // Note: token not included - auth handled by Bearer header
    };

    const request = new NextRequest('http://localhost:3000/api/sanity-create-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-12345',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(payload)
    });

    const response = await POST(request);
    const data = await response.json();

    // Should succeed with SKIP_SANITY=1
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.hotelId).toBe('dummy-id');
    expect(data.message).toBe('Hotel created successfully');
  });

  it('should reject payload with invalid amenities type', async () => {
    const payload = {
      name: 'Test Hotel',
      slug: 'test-hotel',
      description: 'A test hotel for validation',
      address: '123 Test Street',
      city: 'Toronto',
      rating: 4.5,
      hotelClass: 4,
      amenities: 'Free WiFi, Restaurant, Pool' // String instead of array - should fail
      // Note: token not required
    };

    const request = new NextRequest('http://localhost:3000/api/sanity-create-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-12345',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(payload)
    });

    const response = await POST(request);
    const data = await response.json();

    // Should fail validation
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid hotel data');
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'amenities',
          message: expect.stringContaining('expected array')
        })
      ])
    );
  });

  it('should handle missing optional arrays gracefully', async () => {
    const payload = {
      name: 'Minimal Test Hotel',
      slug: 'minimal-test-hotel-' + Date.now(), // Make slug unique
      description: 'A minimal test hotel',
      address: '456 Test Avenue',
      city: 'Toronto',
      rating: 3.5,
      hotelClass: 3,
      // amenities and tags omitted - should default to empty arrays
      // Note: token not required
    };

    const request = new NextRequest('http://localhost:3000/api/sanity-create-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-12345',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(payload)
    });

    const response = await POST(request);
    const data = await response.json();

    // Should succeed with defaults
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.hotelId).toBe('dummy-id');
  });

  it('should not store token in Sanity document', async () => {
    const payload = {
      name: 'Security Test Hotel',
      slug: 'security-test-hotel-' + Date.now(),
      description: 'Testing that tokens are not stored',
      address: '999 Security Street',
      city: 'Toronto',
      rating: 4.0,
      hotelClass: 4
    };

    const request = new NextRequest('http://localhost:3000/api/sanity-create-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-12345',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(payload)
    });

    const response = await POST(request);
    const data = await response.json();

    // Should succeed
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.hotelId).toBe('dummy-id');
    
    // Verify response doesn't leak any token information
    expect(JSON.stringify(data)).not.toContain('token');
    expect(JSON.stringify(data)).not.toContain('Bearer');
  });

  it('should reject unauthenticated requests', async () => {
    const payload = {
      name: 'Unauthorized Hotel',
      slug: 'unauthorized-hotel',
      description: 'Should not be created',
      address: '789 Forbidden Street',
      city: 'Toronto'
      // Note: token not required
    };

    const request = new NextRequest('http://localhost:3000/api/sanity-create-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
        // No Authorization header
      },
      body: JSON.stringify(payload)
    });

    const response = await POST(request);
    const data = await response.json();

    // Should fail authentication
    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized: Invalid or missing authentication token');
  });
});
