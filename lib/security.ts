/**
 * Security utilities and validation functions
 */

import { NextRequest } from 'next/server';
import { log } from './core/log';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface SecurityConfig {
  maxRequestsPerMinute: number;
  maxInputLength: number;
  allowedOrigins: string[];
  requireApiKey: boolean;
}

import { ENV } from './env';

const ENV_ORIGINS = (ENV.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxRequestsPerMinute: 60,
  maxInputLength: 500,
  allowedOrigins: ENV_ORIGINS.length ? ENV_ORIGINS : ['http://localhost:3000'],
  requireApiKey: true,
};

/**
 * Validate and sanitize input strings
 */
export function validateInput(input: string, maxLength: number = 500): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmed = input.trim();
  
  // Check length
  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null;
  }

  // Basic XSS prevention (remove script tags and dangerous patterns)
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url.trim());
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Rate limiting middleware
 */
export function checkRateLimit(
  request: NextRequest,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const key = `rate_limit:${clientIp}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new rate limit entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: config.maxRequestsPerMinute - 1, resetTime: now + windowMs };
  }

  if (current.count >= config.maxRequestsPerMinute) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  // Increment count
  current.count++;
  rateLimitStore.set(key, current);

  return { 
    allowed: true, 
    remaining: config.maxRequestsPerMinute - current.count, 
    resetTime: current.resetTime 
  };
}

/**
 * Validate API key
 */
export function validateApiKey(apiKey: string | undefined): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Basic validation - ensure it's not empty and has reasonable length
  return apiKey.trim().length > 0 && apiKey.trim().length <= 100;
}

/**
 * Validate CORS origin
 */
export function validateOrigin(
  origin: string | null,
  allowedOrigins: string[] = DEFAULT_SECURITY_CONFIG.allowedOrigins
): boolean {
  if (!origin) {
    return false;
  }

  return allowedOrigins.includes(origin);
}

/**
 * Sanitize error messages for client
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Log the full error for debugging
    log.ui.error('Error occurred:', error);
    
    // Return generic message to client
    return 'An error occurred. Please try again.';
  }
  
  return 'An unexpected error occurred.';
}

/**
 * Validate request body
 */
export function validateRequestBody(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  // Check for circular references
  try {
    JSON.stringify(body);
  } catch {
    return { valid: false, error: 'Invalid request body format' };
  }

  return { valid: true };
}

/**
 * Security headers for responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Validate hotel data before import
 */
export function validateHotelData(hotel: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!hotel.name || typeof hotel.name !== 'string' || hotel.name.trim().length === 0) {
    errors.push('Hotel name is required');
  }

  if (hotel.name && hotel.name.length > 200) {
    errors.push('Hotel name is too long (max 200 characters)');
  }

  // Optional field validation
  if (hotel.rating !== undefined && (typeof hotel.rating !== 'number' || hotel.rating < 0 || hotel.rating > 5)) {
    errors.push('Rating must be a number between 0 and 5');
  }

  if (hotel.hotel_class !== undefined && (typeof hotel.hotel_class !== 'number' || hotel.hotel_class < 1 || hotel.hotel_class > 5)) {
    errors.push('Hotel class must be a number between 1 and 5');
  }

  if (hotel.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(hotel.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid phone number format');
  }

  if (hotel.website && !validateUrl(hotel.website)) {
    errors.push('Invalid website URL');
  }

  if (hotel.primaryImageUrl && !validateUrl(hotel.primaryImageUrl)) {
    errors.push('Invalid primary image URL');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clean up rate limit store periodically
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired entries every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
