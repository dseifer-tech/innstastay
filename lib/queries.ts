// One hotel by slug
export const HOTEL_BY_SLUG = `
*[_type == "hotel" && slug.current == $slug][0]{
  "id": slug.current,
  name,
  city,
  area,
  address,
  phone,
  rating,
  hotelClass,
  description,
  gpsCoordinates,
  primaryImage,
  primaryImageUrl,
  images,
  tags,
  amenities,
  bookingLinks,
  token,
  isActive,
  seoTitle,
  seoDescription
}
`;

// All active hotels for search/list pages
export const HOTELS_FOR_SEARCH = `
*[_type == "hotel" && isActive == true]{
  "id": slug.current,
  name,
  city,
  area,
  address,
  phone,
  rating,
  hotelClass,
  description,
  gpsCoordinates,
  primaryImage,
  primaryImageUrl,
  images,
  tags,
  amenities,
  bookingLinks,
  token,
  seoTitle,
  seoDescription
} | order(name asc)
`;
