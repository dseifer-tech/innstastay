import HomePageClient from './HomePageClient';
import { getHotelsForSearch } from '@/lib/hotelSource';
import type { Hotel } from '@/types/hotel';

export const dynamic = 'force-static';

export default async function HomePage() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Pre-fetch hotels for the carousel on the server
  let initialHotels: Hotel[] = [];
  try {
    const allHotels = await getHotelsForSearch();
    initialHotels = allHotels.slice(0, 8); // Get first 8 hotels for carousel
  } catch (error) {
    console.error('Failed to pre-fetch hotels for homepage:', error);
    // Continue with empty array - client can fallback to loading state
  }

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InnstaStay",
    "url": BASE || undefined,
    "logo": BASE ? `${BASE}/logo.png` : undefined,
    "description": "InnstaStay shows official hotel prices and policies—then sends you to the hotel to book. No reselling, no platform fees."
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InnstaStay",
    "url": BASE || undefined,
    "potentialAction": {
      "@type": "SearchAction",
      "target": BASE ? `${BASE}/search?checkin={checkin}&checkout={checkout}&adults={adults}` : undefined,
      "query-input": "required name=checkin required name=checkout required name=adults"
    }
  };

  return (
    <>
      <HomePageClient initialHotels={initialHotels} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
    </>
  )
}
