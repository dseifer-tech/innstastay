// Shared types for pricing extraction

export interface OfficialPrice {
  nightly_price: number | null;
  total_price: number | null;
  currency: string;
  booking_link: string | null;
  room: {
    name?: string;
    rate_plan?: string;
    refundable?: boolean;
    cancellable?: boolean;
    image?: string | null;
  };
  source: "featured" | "prices" | "merged";
  debug?: {
    picked: "featured" | "prices";
    had_featured: boolean;
    had_prices: boolean;
  };
}

export interface ExtractedPriceResult {
  nightlyFrom?: number;
  currency?: string;
  officialLink?: string;
  rooms?: Array<{
    name: string;
    image?: string;
    link: string;
    nightly: number;
    currency: string;
    refundable?: boolean;
    cancellable?: boolean;
    ratePlan?: string;
  }>;
}

// Helper function to safely convert string/number to number
export function safeNumber(value: any): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

// Helper function to pick the best price using precedence rules
export function pickPrice(obj: any): number | null {
  // Precedence: rate_per_night.extracted_before_taxes_fees → rate_per_night.extracted_lowest → 
  // total_rate.extracted_before_taxes_fees → total_rate.extracted_lowest → 
  // direct extracted_before_taxes_fees → direct extracted_lowest → direct extracted_total
  if (obj?.rate_per_night?.extracted_before_taxes_fees) {
    return safeNumber(obj.rate_per_night.extracted_before_taxes_fees);
  }
  if (obj?.rate_per_night?.extracted_lowest) {
    return safeNumber(obj.rate_per_night.extracted_lowest);
  }
  if (obj?.total_rate?.extracted_before_taxes_fees) {
    return safeNumber(obj.total_rate.extracted_before_taxes_fees);
  }
  if (obj?.total_rate?.extracted_lowest) {
    return safeNumber(obj.total_rate.extracted_lowest);
  }
  // Direct price fields (for headline pricing)
  if (obj?.extracted_before_taxes_fees) {
    return safeNumber(obj.extracted_before_taxes_fees);
  }
  if (obj?.extracted_lowest) {
    return safeNumber(obj.extracted_lowest);
  }
  if (obj?.extracted_total) {
    return safeNumber(obj.extracted_total);
  }
  return null;
}
