import type { Hotel } from '@/types/hotel';
import type { SortOption } from '@/app/components/SortControl';

/**
 * Extract nightly price from a hotel's price object
 */
function getNightlyPrice(hotel: Hotel): number | undefined {
  if (hotel.price && 'nightlyFrom' in hotel.price) {
    return hotel.price.nightlyFrom;
  }
  return undefined;
}

/**
 * Filter hotels by price range (per night)
 */
export function filterHotelsByPriceRange(
  hotels: Hotel[], 
  minRate?: number, 
  maxRate?: number
): Hotel[] {
  if (!minRate && !maxRate) return hotels;
  
  return hotels.filter(hotel => {
    const nightly = getNightlyPrice(hotel);
    
    if (typeof nightly !== 'number' || nightly <= 0) {
      // Hotels without pricing pass if no minimum is set
      return !minRate;
    }
    
    if (minRate && nightly < minRate) return false;
    if (maxRate && nightly > maxRate) return false;
    
    return true;
  });
}

/**
 * Sort hotels by the specified option
 */
export function sortHotels(hotels: Hotel[], sortBy: SortOption): Hotel[] {
  const sorted = [...hotels];
  
  switch (sortBy) {
    case 'best-value':
      // Best value: prioritize rating/price ratio, with fallbacks
      return sorted.sort((a, b) => {
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        const aPrice = getNightlyPrice(a) || 999999;
        const bPrice = getNightlyPrice(b) || 999999;
        
        // Calculate value score (higher rating / lower price = better value)
        const aValue = aRating > 0 && aPrice < 999999 ? aRating / (aPrice / 100) : aRating;
        const bValue = bRating > 0 && bPrice < 999999 ? bRating / (bPrice / 100) : bRating;
        
        if (Math.abs(aValue - bValue) > 0.1) {
          return bValue - aValue; // Higher value first
        }
        
        // Fallback: rating first, then price
        if (Math.abs(aRating - bRating) >= 0.1) {
          return bRating - aRating;
        }
        return aPrice - bPrice;
      });
      
    case 'price-low':
      return sorted.sort((a, b) => {
        const aPrice = getNightlyPrice(a) || 999999;
        const bPrice = getNightlyPrice(b) || 999999;
        return aPrice - bPrice;
      });
      
    case 'price-high':
      return sorted.sort((a, b) => {
        const aPrice = getNightlyPrice(a) || 0;
        const bPrice = getNightlyPrice(b) || 0;
        return bPrice - aPrice;
      });
      
    case 'rating':
      return sorted.sort((a, b) => {
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        if (Math.abs(aRating - bRating) >= 0.1) {
          return bRating - aRating;
        }
        // Fallback: price ascending
        const aPrice = getNightlyPrice(a) || 999999;
        const bPrice = getNightlyPrice(b) || 999999;
        return aPrice - bPrice;
      });
      
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
    default:
      return sorted;
  }
}

/**
 * Parse search parameters for filtering/sorting
 */
export function parseSearchFilters(searchParams: Record<string, string | undefined>) {
  const minRate = searchParams.minRate ? parseInt(searchParams.minRate) : undefined;
  const maxRate = searchParams.maxRate ? parseInt(searchParams.maxRate) : undefined;
  const sortBy = (searchParams.sort as SortOption) || 'best-value';
  
  return {
    minRate: minRate && minRate > 0 ? minRate : undefined,
    maxRate: maxRate && maxRate > 0 ? maxRate : undefined,
    sortBy
  };
}
