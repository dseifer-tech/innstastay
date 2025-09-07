/**
 * Normalize search parameters supporting both checkin|check_in and checkout|check_out
 */
export function normalizeSearchParams({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return {
    checkIn: searchParams.checkin || searchParams.check_in,
    checkOut: searchParams.checkout || searchParams.check_out,
    adults: searchParams.adults ? Number(searchParams.adults) : undefined,
    children: searchParams.children ? Number(searchParams.children) : undefined,
    rooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
  };
}
