'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

interface AmenityFacet {
  name: string;
  count: number;
}

interface AmenitiesFilterProps {
  facets: AmenityFacet[];
  selectedAmenities: string[];
}

export default function AmenitiesFilter({ facets, selectedAmenities }: AmenitiesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAmenityToggle = (amenity: string) => {
    const params = new URLSearchParams(searchParams);
    const currentAmenities = params.get('amenities')?.split(',').filter(Boolean) || [];
    
    let newAmenities: string[];
    if (currentAmenities.includes(amenity)) {
      // Remove amenity
      newAmenities = currentAmenities.filter(a => a !== amenity);
    } else {
      // Add amenity
      newAmenities = [...currentAmenities, amenity];
    }
    
    if (newAmenities.length > 0) {
      params.set('amenities', newAmenities.join(','));
    } else {
      params.delete('amenities');
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : '/search';
    router.push(newUrl);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('amenities');
    
    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : '/search';
    router.push(newUrl);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Popular filters
        </h3>
        {selectedAmenities.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {facets.map((facet) => {
          const isSelected = selectedAmenities.includes(facet.name);
          return (
            <label
              key={facet.name}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleAmenityToggle(facet.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{facet.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {facet.count}
              </span>
            </label>
          );
        })}
      </div>

      {facets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No amenities available</p>
        </div>
      )}
    </div>
  );
}
