/**
 * SOURCE OF TRUTH: Integration/shaping layer.
 * This is the ONLY place that calls proxyImage(...) on room images.
 */
import { sanityClient } from "@/lib/sanity.client";
import { HOTEL_BY_SLUG, HOTELS_FOR_SEARCH } from "@/lib/queries";
import { fromSanityHotel } from "@/lib/adapters/sanityHotel";
import { buildBookingUrl } from "@/lib/bookingLink";
import { fetchOfficialFeatured } from "@/lib/services/pricing.server";
import { mapWithLimit } from "@/lib/core/concurrency";
import { proxyImage } from "@/lib/live/imageProxy";
import { log } from "@/lib/core/log";
import type { Hotel } from "@/types/hotel";

export async function getHotelBySlug(
  slug: string,
  opts?: { checkIn?: string; checkOut?: string; adults?: number; children?: number; rooms?: number }
): Promise<Hotel | null> {
  const doc = await sanityClient.fetch(HOTEL_BY_SLUG, { slug });
  if (!doc || doc.isActive === false) return null;

  const hotel = fromSanityHotel(doc);

  // Build official booking URL from template if available
  hotel.officialBookingUrl = buildBookingUrl(hotel, opts);

  // Live pricing enrichment (additive only - never blocks render)
  if (hotel.token && opts?.checkIn && opts?.checkOut) {
    try {
      const officialData = await fetchOfficialFeatured({
        token: hotel.token,
        checkIn: opts.checkIn,
        checkOut: opts.checkOut,
        adults: opts.adults,
        children: opts.children,
        rooms: opts.rooms
      });
      
      // Enrich with official featured pricing (additive only)
      if (officialData.nightlyFrom) {
        hotel.price = {
          nightlyFrom: officialData.nightlyFrom,
          currency: officialData.currency || "CAD",
          checkIn: opts.checkIn,
          checkOut: opts.checkOut,
          source: "direct"
        };
      }
      
      // Set official booking link if not already set by Sanity
      if (officialData.officialLink && !hotel.officialBookingUrl) {
        hotel.officialBookingUrl = officialData.officialLink;
      }
      
      // Add official rooms for display (runtime only - not stored in Sanity)
      if (officialData.rooms && officialData.rooms.length > 0) {
        // Proxy room images - this is the ONLY place that proxies room images
        hotel.rooms = officialData.rooms.map(room => ({
          ...room,
          image: proxyImage(room.image ?? null) || undefined
        }));
        
        if (process.env.DEBUG_PRICING === "1") {
          log.hotel.debug('[hotelSource] proxied images?', hotel.rooms?.map(r => r.image?.includes("/api/hotel-images?url=")));
        }
      }
    } catch (error) {
      // Pricing enrichment failed - hotel still renders fully from Sanity
      log.hotel.warn('Live pricing enrichment failed for', slug, error);
    }
  }

  return hotel;
}

export async function getHotelsForSearch(
  opts?: { checkIn?: string; checkOut?: string; adults?: number; children?: number; rooms?: number }
): Promise<Hotel[]> {
  console.log('🏨 getHotelsForSearch called with opts:', opts);
  
  try {
    const docs = await sanityClient.fetch(HOTELS_FOR_SEARCH);
    console.log('📄 Sanity docs fetched:', docs ? docs.length : 'null/undefined');
    
    const hotels: Hotel[] = docs.map((d: any) => {
      const h = fromSanityHotel(d);
      h.officialBookingUrl = buildBookingUrl(h, opts);
      return h;
    });
    
    console.log('🏨 Hotels mapped:', hotels.length);
    
    // Optional headline price enrichment with concurrency limit
    if (opts?.checkIn && opts?.checkOut) {
      const hotelsWithTokens = hotels.filter(h => h.token);
    
    if (hotelsWithTokens.length > 0) {
      try {
        const enrichedHotels = await mapWithLimit(hotelsWithTokens, 4, async (hotel) => {
          try {
            const officialData = await fetchOfficialFeatured({
              token: hotel.token!,
              checkIn: opts.checkIn!,
              checkOut: opts.checkOut!,
              adults: opts.adults,
              children: opts.children,
              rooms: opts.rooms
            });
            
            if (officialData.nightlyFrom) {
              hotel.price = {
                nightlyFrom: officialData.nightlyFrom,
                currency: officialData.currency || "CAD",
                checkIn: opts.checkIn!,
                checkOut: opts.checkOut!,
                source: "direct"
              };
            }
            
            return hotel;
          } catch (error) {
            log.hotel.warn('Price enrichment failed for', hotel.id, error);
            return hotel;
          }
        });
        
        // Merge enriched hotels back into the main array
        const enrichedMap = new Map(enrichedHotels.map(h => [h.id, h]));
        return hotels.map(h => enrichedMap.get(h.id) || h);
      } catch (error) {
        log.hotel.warn('Bulk price enrichment failed:', error);
      }
    }
  }

    return hotels;
  } catch (error) {
    console.error('❌ Error in getHotelsForSearch:', error);
    return [];
  }
}
