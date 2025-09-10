// Hotel data validation schemas using Zod
import { z } from 'zod'

// Base hotel schema for API validation
export const hotelCreateSchema = z.object({
  name: z.string().min(1, 'Hotel name is required').max(200, 'Hotel name is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name is too long'),
  area: z.string().max(100, 'Area name is too long').optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{0,20}$/, 'Invalid phone number format').optional(),
  rating: z.number().min(0).max(5).optional(),
  hotelClass: z.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(200, 'SEO title is too long').optional(),
  seoDescription: z.string().max(500, 'SEO description is too long').optional(),
  primaryImageUrl: z.string().url('Invalid image URL').optional(),
  token: z.string().optional(),
  bookingTemplate: z.string().url('Invalid booking template URL').optional(),
})

export const hotelUpdateSchema = hotelCreateSchema.partial().extend({
  id: z.string().min(1, 'Hotel ID is required'),
})

// Schema for hotel search/filter parameters
export const hotelSearchSchema = z.object({
  query: z.string().max(100, 'Search query is too long').optional(),
  city: z.string().max(100, 'City filter is too long').optional(),
  area: z.string().max(100, 'Area filter is too long').optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxRating: z.number().min(0).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
})

// Schema for hotel deletion
export const hotelDeleteSchema = z.object({
  id: z.string().min(1, 'Hotel ID is required'),
  confirmDelete: z.boolean().refine(val => val === true, 'Delete confirmation required'),
})

// Admin API key validation
export const adminApiSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
})

// Request validation for hotel pricing
export const hotelPricingSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid checkin date format (YYYY-MM-DD)'),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid checkout date format (YYYY-MM-DD)'),
  adults: z.number().min(1).max(10).optional(),
  children: z.number().min(0).max(10).optional(),
  rooms: z.number().min(1).max(10).optional(),
})

export type HotelCreate = z.infer<typeof hotelCreateSchema>
export type HotelUpdate = z.infer<typeof hotelUpdateSchema>
export type HotelSearch = z.infer<typeof hotelSearchSchema>
export type HotelDelete = z.infer<typeof hotelDeleteSchema>
export type HotelPricing = z.infer<typeof hotelPricingSchema>
