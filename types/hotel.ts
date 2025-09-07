import type { Money } from './money'
export interface HotelOffer {
  id: string;
  room_name: string;
  rate_name: string;
  price: number;
  currency: string;
  cancellation_policy?: string;
  amenities?: string[];
  is_official: boolean;
}

export interface HotelRoom {
  name: string;
  image?: string;
  link: string;
  nightly: number;
  currency: string;
  refundable?: boolean;
  cancellable?: boolean;
  ratePlan?: string;
}

export interface Hotel {
  id: string;                 // slug.current
  name: string;
  city?: string;
  area?: string;
  address?: string;
  phone?: string;
  rating?: number;
  hotelClass?: number;        // stars
  description?: string;

  coordinates?: { lat: number; lng: number };

  heroImage?: string;         // primaryImage
  gallery?: string[];         // images
  tags?: string[];
  amenities?: string[];

  // Links
  officialBookingUrl?: string;
  bookingLinks?: Array<{ name: string; urlTemplate: string; isActive: boolean }>;

  // Live data (optional)
  price?: (Money & { source?: 'official' | 'fallback' | 'direct' | 'ota' | 'mixed' }) | { currency: string; nightlyFrom: number; checkIn?: string; checkOut?: string; source?: "direct"|"ota"|"mixed" };
  rooms?: HotelRoom[];        // Official featured rooms from live pricing

  // Internal pass-through
  token?: string;             // Google Hotels Token used by live pricing layer

  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export interface BookingUrlParams {
  DateIn: string;
  DateOut: string;
  Adults: number;
  Children: number;
}

export type HotelTag =
  | "extended_stay"
  | "boutique"
  | "family_friendly"
  | "luxury"
  | "business"
  | "entertainment_district"
  | "financial_district"
  | "yorkville"
  | "downtown"
  | "historic"
  | "pool"
  | "artistic";

export interface HotelRecord {
  slug: string;
  name: string;
  city: string;
  area?: string;
  tags?: HotelTag[];
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
} 