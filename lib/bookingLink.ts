import { log } from "@/lib/core/log";

// Replace tokens like {adults}, {children}, {datein}, {dateout}, etc.
// You can expand tokens as needed to match your templates.
export function buildBookingUrl(
  hotel: { bookingLinks?: Array<{ urlTemplate: string; isActive: boolean }> },
  opts?: { checkIn?: string; checkOut?: string; adults?: number; children?: number; rooms?: number }
): string | undefined {
  const template = hotel.bookingLinks?.find(link => link.isActive)?.urlTemplate;
  if (!template) return undefined;

  const replaceMap: Record<string, string> = {};
  
  if (opts?.adults) replaceMap['{adults}'] = String(opts.adults);
  if (opts?.children) replaceMap['{children}'] = String(opts.children);
  if (opts?.rooms) replaceMap['{rooms}'] = String(opts.rooms);
  if (opts?.checkIn) {
    replaceMap['{datein}'] = opts.checkIn;
    replaceMap['{datein_mmddyyyy}'] = toMMDDYYYY(opts.checkIn);
  }
  if (opts?.checkOut) {
    replaceMap['{dateout}'] = opts.checkOut;
    replaceMap['{dateout_mmddyyyy}'] = toMMDDYYYY(opts.checkOut);
  }

  let url = template;
  for (const [k, v] of Object.entries(replaceMap)) {
    url = url.split(k).join(String(v));
  }
  return url;
}

function toMMDDYYYY(iso: string): string {
  try {
    // Parse ISO date string directly to avoid timezone issues
    const [year, month, day] = iso.split('T')[0].split('-');
    return `${month}/${day}/${year}`;
  } catch (error) {
    log.hotel.warn('Invalid date format:', iso);
    return '';
  }
}
