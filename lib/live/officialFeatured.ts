/**
 * SOURCE OF TRUTH: Price + room extraction only.
 * Returns raw image URLs. Do NOT proxy images here.
 */
import { log } from "@/lib/core/log";
import { OfficialPrice, pickPrice } from "./types";

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

export function extractOfficialFeatured(json: any): OfficialPrice | null {
  // Find the official featured price
  const official = json?.featured_prices?.find((p: any) => p?.official === true);
  if (!official) return null;

  // Extract room details
  const room = {
    name: official.room?.name || "Standard Room",
    rate_plan: official.room?.rate_plan,
    refundable: official.room?.refundable,
    cancellable: official.room?.cancellable,
    image: official.room?.image || null
  };

  return {
    nightly_price: pickPrice(official),
    total_price: pickPrice(official),
    currency: json?.currency || "CAD",
    booking_link: official.link || null,
    room,
    source: "featured"
  };
}

// Legacy function for backward compatibility
export function extractOfficialFeaturedLegacy(json: any): OfficialFeaturedData {
  const result: OfficialFeaturedData = {};
  
  // Find the official featured price
  const official = json?.featured_prices?.find((p: any) => p?.official === true);
  if (!official) return result;

  // Extract headline nightly price with precedence
  result.nightlyFrom = pickPrice(official) || undefined;

  // Extract currency
  result.currency = json?.currency || "CAD";

  // Extract official booking link
  if (official.link) {
    result.officialLink = official.link;
  }

  // Extract rooms if available
  if (Array.isArray(official.rooms) && official.rooms.length > 0) {
    result.rooms = official.rooms.map((room: any) => {
      // Extract nightly price with same precedence as headline
      const nightly = pickPrice(room) || 0;

      // Extract room image - try multiple possible locations (returns raw URLs)
      let roomImage: string | undefined;
      
      // Try different possible image locations
      if (Array.isArray(room.images) && room.images.length > 0) {
        roomImage = room.images[0];
        if (process.env.DEBUG_PRICING === "1") {
          log.official.debug(`Found room image in room.images[0]: ${room.images[0]}`);
        }
      } else if (room.image) {
        roomImage = room.image;
        if (process.env.DEBUG_PRICING === "1") {
          log.official.debug(`Found room image in room.image: ${room.image}`);
        }
      } else if (room.room?.image) {
        roomImage = room.room.image;
        if (process.env.DEBUG_PRICING === "1") {
          log.official.debug(`Found room image in room.room.image: ${room.room.image}`);
        }
      } else if (Array.isArray(room.room?.images) && room.room.images.length > 0) {
        roomImage = room.room.images[0];
        if (process.env.DEBUG_PRICING === "1") {
          log.official.debug(`Found room image in room.room.images[0]: ${room.room.images[0]}`);
        }
      } else {
        if (process.env.DEBUG_PRICING === "1") {
          log.official.debug(`No room image found for room: ${room.name}`);
        }
      }

      return {
        name: room.name || "Standard Room",
        image: roomImage,
        link: room.link || official.link || "",
        nightly,
        currency: result.currency || "CAD",
        refundable: room.refundable,
        cancellable: room.cancellable,
        ratePlan: room.ratePlan
      };
    }).filter((room: { nightly: number }) => room.nightly > 0); // Only include rooms with valid pricing
  }

  log.official.debug('Extracted official featured data', result);
  return result;
}
