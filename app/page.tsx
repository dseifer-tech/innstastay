import HomePageClient from './HomePageClient';

export const dynamic = 'force-static';

export default function HomePage() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

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
      <HomePageClient />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
    </>
  )
}
