'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { parseSearchFilters, sortHotels } from '@/lib/utils/search';
import ViewToggle from './ViewToggle';
import SortControl from './SortControl';
import SearchHotelCard from './hotel/SearchHotelCard';
import HotelCard from './hotel/HotelCard';
import type { Hotel } from '@/types/hotel';

interface SearchResultsClientProps {
  hotels: Hotel[];
  searchParams?: Record<string, string | undefined>;
  selectedAmenities: string[];
}

export default function SearchResultsClient({ 
  hotels, 
  searchParams, 
  selectedAmenities 
}: SearchResultsClientProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const urlSearchParams = useSearchParams();
  
  // Parse filters and sorting
  const { minRate, maxRate, sortBy } = parseSearchFilters(searchParams || {});
  
  // Sort hotels
  const sortedHotels = useMemo(() => {
    return sortHotels(hotels, sortBy);
  }, [hotels, sortBy]);
  
  // Format active search context
  const searchContext = useMemo(() => {
    const parts = [];
    
    // Date range
    const checkin = urlSearchParams.get('checkin');
    const checkout = urlSearchParams.get('checkout');
    if (checkin && checkout) {
      try {
        const checkinDate = format(new Date(checkin), 'MMM d');
        const checkoutDate = format(new Date(checkout), 'MMM d');
        parts.push(`${checkinDate} - ${checkoutDate}`);
      } catch {
        // Invalid dates, skip
      }
    }
    
    // Guest count
    const adults = urlSearchParams.get('adults');
    if (adults && parseInt(adults) > 1) {
      parts.push(`${adults} adults`);
    }
    
    // Budget range
    if (minRate || maxRate) {
      if (minRate && maxRate) {
        parts.push(`CAD $${minRate} - $${maxRate}`);
      } else if (minRate) {
        parts.push(`CAD $${minRate}+`);
      } else if (maxRate) {
        parts.push(`up to CAD $${maxRate}`);
      }
    }
    
    return parts;
  }, [urlSearchParams, minRate, maxRate]);

  return (
    <div className="lg:col-span-3">
      {/* Results Header */}
      <div className="mb-6">
        {/* Title and Context */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} hotel{sortedHotels.length !== 1 ? 's' : ''} in Toronto
            </h1>
            {searchContext.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {searchContext.join(' • ')}
              </p>
            )}
            {selectedAmenities.length > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                Amenities: {selectedAmenities.join(', ')}
              </p>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <SortControl />
          <ViewToggle 
            onViewChange={setViewMode}
            currentView={viewMode}
          />
        </div>
      </div>
      
      {/* Results */}
      {viewMode === 'list' ? (
        // List View
        <div className="space-y-4">
          {sortedHotels.map((hotel) => (
            <SearchHotelCard 
              key={hotel.id} 
              hotel={hotel} 
              searchParams={searchParams}
            />
          ))}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedHotels.map((hotel) => (
            <HotelCard 
              key={hotel.id} 
              hotel={hotel} 
              variant="search" 
              searchParams={searchParams}
            />
          ))}
        </div>
      )}
      
      {/* No Results */}
      {sortedHotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
