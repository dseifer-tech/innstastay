import { headers } from 'next/headers';
import { ENV } from '@/lib/env';

export function getBaseUrl() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  return host ? `${proto}://${host}` : (ENV.SITE_URL || 'http://localhost:3000');
}
