'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Wifi } from 'lucide-react';
import type { Hotel } from '@/types/hotel';
// no unused imports
import PriceBadge from './PriceBadge';
import { isMoney, formatMoney } from '@/types/money';

interface SearchHotelCardProps {
  hotel: Hotel;
  searchParams?: Record<string, string | undefined>;
}

export default function SearchHotelCard({ hotel, searchParams }: SearchHotelCardProps) {
  const [imageError, setImageError] = useState(false);

  // Build the details URL with search parameters if they exist
  const buildDetailsUrl = () => {
    const baseUrl = `/hotels/${hotel.id}`;
    
    if (!searchParams) return baseUrl;
    
    const params = new URLSearchParams();
    if (searchParams.checkin) params.set('checkin', searchParams.checkin);
    if (searchParams.checkout) params.set('checkout', searchParams.checkout);
    if (searchParams.adults) params.set('adults', searchParams.adults);
    if (searchParams.children) params.set('children', searchParams.children);
    if (searchParams.rooms) params.set('rooms', searchParams.rooms);
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Check if we should show the image or placeholder
  const shouldShowImage = hotel.heroImage && !imageError;

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <a
      href={buildDetailsUrl()}
      className="group block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="flex">
        {/* Hotel Image - Left side */}
        <div className="relative w-48 h-32 flex-shrink-0">
          {shouldShowImage && hotel.heroImage ? (
            <Image
              src={hotel.heroImage}
              alt={hotel.name}
              fill
              sizes="(max-width: 768px) 100vw, 192px"
              className="object-cover"
              priority={false}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-2xl mb-1">🏨</div>
                <div className="text-xs">No image</div>
              </div>
            </div>
          )}
          
          {/* Rating Badge */}
          {hotel.rating && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-gray-800">{hotel.rating}</span>
            </div>
          )}
        </div>

        {/* Hotel Info - Right side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Hotel Name and Price */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {hotel.name}
              </h3>
              <div className="flex-shrink-0">
                <PriceBadge price={hotel.price} variant="blue" />
              </div>
            </div>
            
            {/* Location */}
            {(hotel.city || hotel.area) && (
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {[hotel.area, hotel.city].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {/* Description */}
            {hotel.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {hotel.description}
              </p>
            )}

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="flex items-center gap-2 text-gray-500">
                <Wifi className="w-4 h-4" />
                <span className="text-xs">
                  {hotel.amenities.slice(0, 3).join(' • ')}
                  {hotel.amenities.length > 3 && ` +${hotel.amenities.length - 3} more`}
                </span>
              </div>
            )}
          </div>

          {/* Price line - reserve space to avoid CLS */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            {hotel.price ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">From</span>
                <span className="text-lg font-semibold text-gray-900">
                  {'nightlyFrom' in hotel.price
                    ? formatMoney({ currency: hotel.price.currency, amount: hotel.price.nightlyFrom })
                    : isMoney(hotel.price)
                      ? formatMoney(hotel.price)
                      : ''}
                  <span className="text-sm font-normal text-gray-500">/night</span>
                </span>
              </div>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
