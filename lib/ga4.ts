export const gtmEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: name, ...params });
};

// Example usage in client components:
// gtmEvent('hotel_search', { location: 'toronto', adults: 2, children: 1 });
// gtmEvent('hotel_view', { hotel_name: 'Pantages Hotel Downtown Toronto' });
// gtmEvent('booking_click', { hotel_name: 'Town Inn Suites', source: 'search_results' });
