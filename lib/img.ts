// lib/img.ts
export const proxify = (raw?: string, hotel?: string) => {
  if (!raw) return '';
  if (raw.startsWith('/api/hotel-images') || raw.startsWith('/')) return raw; // already ok/local
  try {
    const u = new URL(raw, 'https://dummy.invalid');
    if (u.pathname === '/api/hotel-images' && u.searchParams.get('url')) {
      raw = u.searchParams.get('url')!;
    }
  } catch {}
  return `/api/hotel-images?url=${encodeURIComponent(raw)}&hotel=${encodeURIComponent(hotel ?? '')}`;
};
