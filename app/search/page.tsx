import { getHotelsForSearch } from "@/lib/hotelSource";
import { normalizeSearchParams } from "@/lib/core/url";
import TopSearchBar from "@/app/components/TopSearchBar";
import AmenitiesFilter from "@/app/components/AmenitiesFilter";
import SearchResultsClient from "@/app/components/SearchResultsClient";
import type { Metadata } from 'next';
import type { Hotel } from '@/types/hotel';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Toronto Hotels - Search Results | InnstaStay",
    description: "Find and compare Toronto hotels with direct booking rates. No commissions, no hidden fees.",
    alternates: { 
      canonical: "https://www.innstastay.com/search" 
    },
    openGraph: {
      title: "Toronto Hotels - Search Results | InnstaStay",
      description: "Find and compare Toronto hotels with direct booking rates.",
      type: 'website',
    },
  };
}

// Helper function to build amenities facets from hotels
function buildAmenitiesFacets(hotels: Hotel[]): Array<{ name: string; count: number }> {
  const amenityCounts = new Map<string, number>();
  
  hotels.forEach(hotel => {
    if (hotel.amenities) {
      hotel.amenities.forEach(amenity => {
        const normalizedAmenity = amenity.trim();
        if (normalizedAmenity) {
          amenityCounts.set(normalizedAmenity, (amenityCounts.get(normalizedAmenity) || 0) + 1);
        }
      });
    }
  });
  
  // Convert to array and sort by count (descending)
  const facets = Array.from(amenityCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 most common amenities
  
  return facets;
}

// Helper function to filter hotels by selected amenities
function filterHotelsByAmenities(hotels: Hotel[], selectedAmenities: string[]): Hotel[] {
  if (selectedAmenities.length === 0) return hotels;
  
  return hotels.filter(hotel => {
    if (!hotel.amenities) return false;
    
    const hotelAmenities = hotel.amenities.map(a => a.toLowerCase().trim());
    return selectedAmenities.every(selected => 
      hotelAmenities.some(amenity => amenity.includes(selected.toLowerCase().trim()))
    );
  });
}

// Helper function to build facets for filtered results
function buildFilteredFacets(hotels: Hotel[], selectedAmenities: string[]): Array<{ name: string; count: number }> {
  const filteredHotels = filterHotelsByAmenities(hotels, selectedAmenities);
  return buildAmenitiesFacets(filteredHotels);
}

export default async function SearchPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const normalizedParams = normalizeSearchParams({ searchParams });
  const allHotels = await getHotelsForSearch(normalizedParams);
  
  // Get selected amenities from URL
  const selectedAmenities = searchParams.amenities?.split(',').filter(Boolean) || [];
  
  // Filter hotels by selected amenities
  const filteredHotels = filterHotelsByAmenities(allHotels, selectedAmenities);
  
  // Build facets for the filtered results
  const facets = buildFilteredFacets(allHotels, selectedAmenities);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Search Bar */}
      <TopSearchBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AmenitiesFilter 
                facets={facets}
                selectedAmenities={selectedAmenities}
              />
              
              {/* Budget Filter Placeholder */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                <p className="text-sm text-gray-500">Budget filter coming soon...</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Results */}
          <SearchResultsClient 
            hotels={filteredHotels}
            searchParams={searchParams}
            selectedAmenities={selectedAmenities}
          />
        </div>
      </div>
    </div>
  );
} 