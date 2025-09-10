export const runtime = 'nodejs';

export async function getAllHotels() {
  const { getClient } = await import('@/lib/cms/sanityClient');
  const client = await getClient();
  const q = `*[_type=="hotel" && isActive==true]{ "id": slug.current, name, city, area, primaryImage, primaryImageUrl } | order(name asc)`;
  const data = await client.fetch<any[]>(q).catch(() => null);
  return Array.isArray(data) ? data : [];
}

export async function getHotelBySlug(slug: string) {
  const { getClient } = await import('@/lib/cms/sanityClient');
  const client = await getClient();
  const q = `*[_type=="hotel" && slug.current==$slug][0]{ "id": slug.current, name, city, area, primaryImage, primaryImageUrl, description, amenities, gpsCoordinates, rating, hotelClass }`;
  const doc = await client.fetch<any>(q, { slug }).catch(() => null);
  return doc ?? null;
}
