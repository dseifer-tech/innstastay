/**
 * SOURCE OF TRUTH: Price + room extraction only.
 * Returns raw image URLs. Do NOT proxy images here.
 */
import { log } from "@/lib/core/log";
import { OfficialPrice, pickPrice, safeNumber } from "./types";

export function extractOfficialPrices(json: any): OfficialPrice | null {
  // Find official prices from prices[] array
  const officialPrices = json?.prices?.filter((p: any) => 
    p?.official === true || p?.source === "Official site"
  ) || [];

  if (officialPrices.length === 0) {
    return null;
  }

  // Find the best official price using precedence rules
  let bestPrice = null;
  let bestPriceValue = Infinity;

  for (const price of officialPrices) {
    const nightlyPrice = pickPrice(price);
    if (nightlyPrice && nightlyPrice < bestPriceValue) {
      bestPrice = price;
      bestPriceValue = nightlyPrice;
    }
  }

  if (!bestPrice) {
    return null;
  }

  // Extract room details
        const room = {
        name: bestPrice.room?.name || "Standard Room",
        rate_plan: bestPrice.room?.rate_plan,
        refundable: bestPrice.room?.refundable,
        cancellable: bestPrice.room?.cancellable,
        image: bestPrice.room?.image || null
      };

  // Extract total price if available
  const totalPrice = pickPrice(bestPrice);

  return {
    nightly_price: pickPrice(bestPrice),
    total_price: totalPrice,
    currency: json?.currency || "CAD",
    booking_link: bestPrice.link || null,
    room,
    source: "prices"
  };
}
