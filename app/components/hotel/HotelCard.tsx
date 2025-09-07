'use client';

import { Star, MapPin, Wifi } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import type { Hotel } from '@/types/hotel';
import { toProxyUrl } from '@/lib/core/img';
import PriceBadge from './PriceBadge';

interface HotelCardProps {
  hotel: Hotel;
  // "search" = full card used on /search
  // "home"   = compact card for the homepage
  variant?: "search" | "home";
  searchParams?: Record<string, string | undefined>; // optional; used on /search if needed
}

export default function HotelCard({ hotel, variant = "search", searchParams }: HotelCardProps) {
  const [imageError, setImageError] = useState(false);
  const isHome = variant === "home";

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
      className={[
        "group block overflow-hidden border bg-white transition-all duration-300 rounded-2xl",
        isHome ? "shadow-sm hover:shadow-md hover:scale-105" : "shadow-md hover:shadow-lg",
      ].join(" ")}
    >
      {/* Hotel Image */}
      <div className={["relative", isHome ? "aspect-[4/3]" : "aspect-video"].join(" ")}>
        {shouldShowImage && hotel.heroImage ? (
          <Image
            src={toProxyUrl(hotel.heroImage)}
            alt={hotel.name}
            fill
            sizes={isHome ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"}
            className="object-cover"
            priority={false}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-3xl mb-2">🏨</div>
              <div className="text-sm">Hotel Image</div>
              {!hotel.heroImage && (
                <div className="text-xs text-gray-300 mt-1">No image available</div>
              )}
            </div>
          </div>
        )}
        
        {/* Price Badge (supports Money or legacy nightlyFrom) */}
        {hotel.price && (
          <div className={[isHome ? "absolute bottom-2 left-2" : "absolute bottom-3 left-3"].join(" ")}>
            <PriceBadge price={hotel.price} />
          </div>
        )}

        {/* Rating Badge */}
        {hotel.rating && (
          <div className={[
            "absolute bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1",
            isHome ? "top-2 right-2 px-2 py-1" : "top-3 right-3 px-2 py-1"
          ].join(" ")}>
            <Star className={`${isHome ? "w-3 h-3" : "w-4 h-4"} text-yellow-500 fill-current`} />
            <span className={`${isHome ? "text-xs" : "text-sm"} font-semibold text-gray-800`}>{hotel.rating}</span>
          </div>
        )}
      </div>

      {/* Hotel Info */}
      <div className={isHome ? "p-3" : "p-4"}>
        <div className="flex items-center justify-between">
          <h3 className={isHome ? "text-base font-semibold line-clamp-1" : "text-lg font-semibold line-clamp-1"}>
            {hotel.name}
          </h3>
          {!isHome && (
            <PriceBadge price={hotel.price} variant="blue" />
          )}
        </div>
        
        {/* Location */}
        {(hotel.city || hotel.area || hotel.address) && (
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className={isHome ? "w-3 h-3" : "w-4 h-4"} />
            <span className={isHome ? "text-xs" : "text-sm"}>
              {[hotel.area, hotel.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Description - only show on search variant */}
        {!isHome && hotel.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {hotel.description}
          </p>
        )}

        {/* Amenities - only show on search variant */}
        {!isHome && hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex items-center gap-2 text-gray-500 mt-3">
            <Wifi className="w-4 h-4" />
            <span className="text-xs">
              {hotel.amenities.slice(0, 3).join(' • ')}
              {hotel.amenities.length > 3 && ` +${hotel.amenities.length - 3} more`}
            </span>
          </div>
        )}

        {/* Details Link - only show on search variant */}
        {!isHome && (
          <div className="mt-3 text-sm font-medium opacity-80 group-hover:underline">
            View details →
          </div>
        )}
      </div>
    </a>
  );
}
