import { Star, MapPin, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import type { Hotel } from '@/types/hotel';
import { formatMoney } from '@/lib/core/money';
import { toProxyUrl } from '@/lib/core/img';
import PriceBadge from './PriceBadge';
import ErrorBoundary from '@/app/components/ErrorBoundary';

interface HotelDetailsProps {
  hotel: Hotel;
  searchParams?: Record<string, string | undefined>;
}

export default function HotelDetails({ hotel, searchParams }: HotelDetailsProps) {
  // Check if we have search parameters to show back to search button
  const hasSearchParams = searchParams && (
    searchParams.checkin || 
    searchParams.checkout || 
    searchParams.adults || 
    searchParams.children || 
    searchParams.rooms
  );

  // Build the back to search URL
  const buildSearchUrl = () => {
    if (!hasSearchParams) return '/search';
    
    const params = new URLSearchParams();
    if (searchParams.checkin) params.set('checkin', searchParams.checkin);
    if (searchParams.checkout) params.set('checkout', searchParams.checkout);
    if (searchParams.adults) params.set('adults', searchParams.adults);
    if (searchParams.children) params.set('children', searchParams.children);
    if (searchParams.rooms) params.set('rooms', searchParams.rooms);
    
    return `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Search Button - Only show when search parameters are present */}
      {hasSearchParams && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a
              href={buildSearchUrl()}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search Results
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hotel Image */}
            <div className="h-64 lg:h-96 relative rounded-lg overflow-hidden">
              {hotel.heroImage ? (
                <Image 
                  src={toProxyUrl(hotel.heroImage)} 
                  alt={hotel.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={true}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">🏨</div>
                    <div className="text-lg">Hotel Image</div>
                  </div>
                </div>
              )}
              
              {/* Rating Badge */}
              {hotel.rating && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-800">{hotel.rating}</span>
                  <span className="text-gray-500 text-sm">• {hotel.hotelClass || 3}-star hotel</span>
                </div>
              )}
            </div>

            {/* Hotel Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                {/* Live price, server-enriched */}
                <PriceBadge price={hotel.price} className="text-lg" variant="purple" />
              </div>
              
              {/* Location */}
              {(hotel.city || hotel.area || hotel.address) && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {[hotel.area, hotel.city].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {/* Phone */}
              {hotel.phone && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Phone className="w-5 h-5" />
                  <span>{hotel.phone}</span>
                </div>
              )}

              {/* Description */}
              {hotel.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {hotel.description}
                </p>
              )}

              {/* Booking Button */}
              {hotel.officialBookingUrl ? (
                <a
                  href={hotel.officialBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Book Direct
                </a>
              ) : (
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 text-center py-3 px-6 rounded-lg cursor-not-allowed font-medium text-lg"
                >
                  Check Availability
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Featured Rooms Section */}
      {hotel.rooms && hotel.rooms.length > 0 && (
        <div className="bg-white shadow-sm border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
            <ErrorBoundary fallback={
              <div className="text-sm text-gray-500 p-4 text-center">
                Unable to load room information at this time.
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotel.rooms.map((room, index) => (
                  <div key={`room-${room.name}-${index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Room Image */}
                    <div className="h-48 relative">
                      {room.image ? (
                        <Image 
                          src={toProxyUrl(room.image)} 
                          alt={room.name} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <div className="text-2xl mb-1">🛏️</div>
                            <div className="text-sm">Room Image</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Room Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{room.name}</h3>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatMoney(room.currency, room.nightly)}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                      
                      {/* Room Features */}
                      <div className="space-y-1 mb-4">
                        {room.refundable && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>Refundable</span>
                          </div>
                        )}
                        {room.cancellable && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>Free cancellation</span>
                          </div>
                        )}
                        {room.ratePlan && (
                          <div className="text-sm text-gray-600">
                            {room.ratePlan}
                          </div>
                        )}
                      </div>
                      
                      {/* Book Room Button */}
                      <a
                        href={room.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Book this room
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ErrorBoundary>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {hotel.name}</h2>
              {hotel.description && (
                <p className="text-gray-700 leading-relaxed">
                  {hotel.description}
                </p>
              )}
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={`amenity-${amenity}-${index}`} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {hotel.gallery && hotel.gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.gallery.slice(0, 6).map((image, index) => (
                    <div key={`gallery-${image}-${index}`} className="aspect-square rounded-lg overflow-hidden relative">
                      <Image 
                        src={toProxyUrl(image)} 
                        alt={`${hotel.name} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                {hotel.city && (
                  <div>
                    <span className="text-sm text-gray-500">City</span>
                    <div className="font-medium">{hotel.city}</div>
                  </div>
                )}
                {hotel.area && (
                  <div>
                    <span className="text-sm text-gray-500">Area</span>
                    <div className="font-medium">{hotel.area}</div>
                  </div>
                )}
                {hotel.hotelClass && (
                  <div>
                    <span className="text-sm text-gray-500">Hotel Class</span>
                    <div className="font-medium">{hotel.hotelClass}-star</div>
                  </div>
                )}
                {hotel.rating && (
                  <div>
                    <span className="text-sm text-gray-500">Rating</span>
                    <div className="font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {hotel.rating}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {hotel.tags && hotel.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.tags.map((tag, index) => (
                    <span 
                      key={`tag-${tag}-${index}`}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
