import { headers } from 'next/headers';

export function getBaseUrl() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  return host ? `${proto}://${host}` : (process.env.SITE_URL || 'http://localhost:3000');
}
