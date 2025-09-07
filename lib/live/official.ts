/**
 * SOURCE OF TRUTH: Price + room extraction only.
 * Returns raw image URLs. Do NOT proxy images here.
 */
import { log } from "@/lib/core/log";
import { OfficialPrice } from "./types";
import { extractOfficialFeatured } from "./officialFeatured";
import { extractOfficialPrices } from "./officialPrices";

export function extractOfficialBest(json: any): OfficialPrice | null {
  const debug = process.env.DEBUG_PRICING === "1";
  
  // Try featured_prices first
  const featuredResult = extractOfficialFeatured(json);
  const hadFeatured = featuredResult !== null;
  
  // Try prices as fallback
  const pricesResult = extractOfficialPrices(json);
  const hadPrices = pricesResult !== null;
  
  if (debug) {
    log.official.debug('Pricing extraction debug:', {
      hadFeatured,
      hadPrices,
      featuredPrice: featuredResult?.nightly_price,
      pricesPrice: pricesResult?.nightly_price
    });
  }
  
  // If neither exists, return null
  if (!hadFeatured && !hadPrices) {
    return null;
  }
  
  // If only one exists, return it
  if (hadFeatured && !hadPrices) {
    if (debug) log.official.debug('Using featured price only');
    return {
      ...featuredResult!,
      debug: { picked: "featured", had_featured: true, had_prices: false }
    };
  }
  
  if (!hadFeatured && hadPrices) {
    if (debug) log.official.debug('Using prices fallback only');
    return {
      ...pricesResult!,
      debug: { picked: "prices", had_featured: false, had_prices: true }
    };
  }
  
  // Both exist - pick the best price
  const featuredPrice = featuredResult!.nightly_price;
  const pricesPrice = pricesResult!.nightly_price;
  
  let picked: "featured" | "prices";
  let result: OfficialPrice;
  
  if (featuredPrice !== null && pricesPrice !== null) {
    // Both have valid prices - pick the lower one
    if (featuredPrice <= pricesPrice) {
      picked = "featured";
      result = featuredResult!;
    } else {
      picked = "prices";
      result = pricesResult!;
    }
  } else if (featuredPrice !== null) {
    // Only featured has valid price
    picked = "featured";
    result = featuredResult!;
  } else if (pricesPrice !== null) {
    // Only prices has valid price
    picked = "prices";
    result = pricesResult!;
  } else {
    // Neither has valid price - prefer featured for consistency
    picked = "featured";
    result = featuredResult!;
  }
  
  if (debug) {
    log.official.debug('Pricing decision:', {
      picked,
      featuredPrice,
      pricesPrice,
      reason: featuredPrice !== null && pricesPrice !== null 
        ? `featured (${featuredPrice}) vs prices (${pricesPrice}) - chose ${picked}`
        : 'one or both prices were null'
    });
  }
  
  return {
    ...result,
    source: "merged",
    debug: { picked, had_featured: true, had_prices: true }
  };
}
