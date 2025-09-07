'use client';

import { useState } from 'react';
import ViewToggle from './ViewToggle';
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

  return (
    <div className="lg:col-span-3">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} in Toronto
          </h1>
          {selectedAmenities.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Filtered by: {selectedAmenities.join(', ')}
            </p>
          )}
        </div>
        <ViewToggle 
          onViewChange={setViewMode}
          currentView={viewMode}
        />
      </div>
      
      {/* Results */}
      {viewMode === 'list' ? (
        // List View
        <div className="space-y-4">
          {hotels.map((hotel) => (
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
          {hotels.map((hotel) => (
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
      {hotels.length === 0 && (
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
