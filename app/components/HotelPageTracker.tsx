"use client";
import { useEffect, useCallback } from "react";
import { gtmEvent } from "@/lib/ga4";

interface HotelPageTrackerProps {
  hotelName: string;
  slug: string;
  checkin: string;
  checkout: string;
  adults: number;
  childrenCount: number;
}

export default function HotelPageTracker({ 
  hotelName, 
  slug, 
  checkin, 
  checkout, 
  adults, 
  childrenCount 
}: HotelPageTrackerProps) {
  useEffect(() => {
    // Track hotel page view
    gtmEvent('hotel_view', {
      hotel_name: hotelName,
      hotel_slug: slug,
      checkin_date: checkin,
      checkout_date: checkout,
      adults: adults,
      children: childrenCount
    });
  }, [hotelName, slug, checkin, checkout, adults, childrenCount]);

  const handleBookDirect = useCallback((bookingUrl: string) => {
    gtmEvent('booking_click', {
      hotel_name: hotelName,
      hotel_slug: slug,
      source: 'hotel_page'
    });
    window.open(bookingUrl, '_blank');
  }, [hotelName, slug]);

  // Expose the handler globally for use in the page
  useEffect(() => {
    // @ts-expect-error augmenting window for runtime binding
    window.handleHotelBooking = handleBookDirect;
    
    return () => {
      // @ts-expect-error cleanup augmented property
      delete window.handleHotelBooking;
    };
  }, [hotelName, slug, handleBookDirect]);

  return null;
}
