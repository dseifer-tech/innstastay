/**
 * SOURCE OF TRUTH: SerpAPI network fetch only.
 * Do not transform business data here (no image proxying, no price picking).
 * 
 * LOGGING: All pricing logs use log.price.* centralized logging.
 * Set DEBUG_PRICING=1 for detailed SerpApi response dumps and diagnostics.
 * Default logs show only essential status and error messages.
 */
import { log } from "@/lib/core/log";
import { extractOfficialBest } from "@/lib/live/official";
import { extractOfficialFeaturedLegacy } from "@/lib/live/officialFeatured";

export interface OfficialFeaturedData {
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

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 1): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        log.price.warn(`Attempt ${attempt + 1} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

export async function fetchOfficialFeatured({
  token,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  rooms = 1
}: {
  token: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}): Promise<OfficialFeaturedData> {
  // Debug logging only when enabled
  if (process.env.DEBUG_PRICING === "1") {
    log.price.debug(`🔍 SERPAPI DEBUG: Fetching rates for token "${token}"`);
    log.price.debug(`📅 ${checkIn} → ${checkOut} | ${adults} adults, ${children} children, ${rooms} rooms`);
  }
  
  if (!token || !checkIn || !checkOut) {
    log.price.warn(`Missing required params: token=${!!token}, checkIn=${!!checkIn}, checkOut=${!!checkOut}`);
    return {};
  }

  try {
    // Security: Validate API key
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      log.price.error('SERPAPI_KEY not configured');
      return {};
    }
    
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_hotels&q=toronto%20hotels&property_token=${token}&check_in_date=${checkIn}&check_out_date=${checkOut}&adults=${adults}&currency=CAD&gl=ca&hl=en&api_key=${serpApiKey}`;
    
    // Log URL without API key for security (debug only)
    if (process.env.DEBUG_PRICING === "1") {
      const safeUrl = `https://serpapi.com/search.json?engine=google_hotels&property_token=${token}&check_in_date=${checkIn}&check_out_date=${checkOut}&adults=${adults}&currency=CAD&gl=ca&hl=en&api_key=***`;
      log.price.debug(`🌐 SerpAPI URL: ${safeUrl}`);
    }
    
    const res = await fetchWithRetry(serpApiUrl);
    
    if (!res.ok) {
      log.price.warn(`SerpAPI failed with status: ${res.status}`);
      return {};
    }

    const data = await res.json();
    
    // High-volume response logging only when debugging enabled
    if (process.env.DEBUG_PRICING === "1") {
      // Redact sensitive response data for security
      const safeResponseData = {
        ...data,
        // Redact potential sensitive fields
        search_metadata: data.search_metadata ? {
          ...data.search_metadata,
          serpapi_endpoint: data.search_metadata.serpapi_endpoint ? '[REDACTED]' : undefined
        } : undefined,
        // Keep essential pricing data but redact raw URLs/metadata
        featured_prices: data.featured_prices?.map((price: any) => ({
          official: price.official,
          rate: price.rate,
          currency: price.currency,
          // Redact booking links that might contain tracking params
          link: price.link ? '[REDACTED_BOOKING_LINK]' : undefined,
          rooms_count: price.rooms?.length || 0
        })) || [],
        prices_summary: data.prices ? `${data.prices.length} prices available` : 'No prices'
      };
      
      log.price.debug(`📊 SerpAPI Response (sanitized):`, JSON.stringify(safeResponseData, null, 2));
    }
    
    if (data.error) {
      log.price.warn('SerpAPI returned error:', data.error);
      return {};
    }

    // Log raw SerpAPI response for debugging
    if (process.env.DEBUG_PRICING === "1") {
      log.price.debug('Raw SerpAPI response structure:', {
        hasFeaturedPrices: !!data.featured_prices,
        featuredPricesLength: data.featured_prices?.length || 0,
        hasPrices: !!data.prices,
        pricesLength: data.prices?.length || 0,
        featuredPricesWithRooms: data.featured_prices?.filter((p: any) => p.rooms && p.rooms.length > 0).length || 0,
        sampleFeaturedPrice: data.featured_prices?.[0] ? {
          official: data.featured_prices[0].official,
          hasRooms: !!data.featured_prices[0].rooms,
          roomsLength: data.featured_prices[0].rooms?.length || 0,
          sampleRoom: data.featured_prices[0].rooms?.[0] ? {
            name: data.featured_prices[0].rooms[0].name,
            hasImage: !!data.featured_prices[0].rooms[0].image,
            hasImages: !!data.featured_prices[0].rooms[0].images,
            image: data.featured_prices[0].rooms[0].image,
            images: data.featured_prices[0].rooms[0].images
          } : null
        } : null
      });
    }

    // Use the new orchestrator to extract the best price
    const bestPrice = extractOfficialBest(data);
    
    if (!bestPrice) {
      return {};
    }

    // Convert to legacy format for backward compatibility
    const result: OfficialFeaturedData = {};
    
    if (bestPrice.nightly_price) {
      result.nightlyFrom = bestPrice.nightly_price;
    }
    
    result.currency = bestPrice.currency;
    
    if (bestPrice.booking_link) {
      result.officialLink = bestPrice.booking_link;
    }

    // Extract room details - ALWAYS try featured_prices first for room images
    // Then fall back to prices array if no rooms found in featured_prices
    let roomsFound = false;
    
    // First, try to get rooms from featured_prices (they often have better room data)
    const legacyResult = extractOfficialFeaturedLegacy(data);
    if (legacyResult.rooms && legacyResult.rooms.length > 0) {
      result.rooms = legacyResult.rooms;
      roomsFound = true;
      if (process.env.DEBUG_PRICING === "1") {
        log.price.debug('Extracted rooms from featured_prices:', legacyResult.rooms.map(r => ({ name: r.name, hasImage: !!r.image })));
      }
    }
    
    // If no rooms found in featured_prices, try prices array as fallback
    // BUT only if the official price actually has room data
    if (!roomsFound && bestPrice.source === "prices") {
      const officialPrices = data?.prices?.filter((p: any) => 
        p?.official === true || p?.source === "Official site"
      ) || [];
      
      if (officialPrices.length > 0) {
        // Only create rooms if the official price has actual room data
        const roomDetails = officialPrices
          .filter((price: any) => price.room && (price.room.name || price.room.image)) // Only include if room has data
          .map((price: any) => {
            // Extract nightly price
            let nightly = 0;
            if (price.rate_per_night?.extracted_before_taxes_fees) {
              nightly = price.rate_per_night.extracted_before_taxes_fees;
            } else if (price.rate_per_night?.extracted_lowest) {
              nightly = price.rate_per_night.extracted_lowest;
            }

            // Extract room image (raw URL)
            let roomImage: string | undefined;
            if (price.room?.image) {
              roomImage = price.room.image;
            }

            return {
              name: price.room?.name || "Standard Room",
              image: roomImage,
              link: price.link || bestPrice.booking_link || "",
              nightly,
              currency: bestPrice.currency || "CAD",
              refundable: price.room?.refundable,
              cancellable: price.room?.cancellable,
              ratePlan: price.room?.rate_plan
            };
          }).filter((room: { nightly: number }) => room.nightly > 0);

        if (roomDetails.length > 0) {
          result.rooms = roomDetails;
          if (process.env.DEBUG_PRICING === "1") {
            log.price.debug('Extracted rooms from prices array (fallback):', roomDetails.map((r: any) => ({ name: r.name, hasImage: !!r.image })));
          }
        }
      }
    }

    // Final result logging only when debugging enabled
    if (process.env.DEBUG_PRICING === "1") {
      log.price.debug(`✅ Final result for token "${token}":`, result);
    } else {
      // Minimal success logging
      log.price.info(`Fetched pricing for token "${token}" - found ${result.nightlyFrom ? 'pricing' : 'no pricing'}`);
    }
    
    return result;
  } catch (error) {
    log.price.error(`Error fetching rates for token "${token}":`, error);
    return {};
  }
}
