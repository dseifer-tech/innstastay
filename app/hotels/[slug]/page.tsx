import { getHotelBySlug } from "@/lib/hotelSource";
import { normalizeSearchParams } from "@/lib/core/url";
import HotelDetails from "@/app/components/hotel/HotelDetails";
import type { Metadata } from 'next';
import { isMoney } from '@/types/money'

export async function generateMetadata(
  { params, searchParams }: { params: { slug: string }, searchParams: Record<string, string | undefined> }
): Promise<Metadata> {
  const normalizedParams = normalizeSearchParams({ searchParams });
  const hotel = await getHotelBySlug(params.slug, normalizedParams);
  
  if (!hotel) {
    return {
      title: "Hotel Not Found | InnstaStay",
      description: "The requested hotel could not be found.",
    };
  }

  return {
    title: hotel.seoTitle || `${hotel.name} - InnstaStay`,
    description: hotel.seoDescription || hotel.description || `Book ${hotel.name} directly with no commissions.`,
    alternates: { 
      canonical: `https://www.innstastay.com/hotels/${params.slug}` 
    },
    openGraph: {
      title: hotel.name,
      description: hotel.description || `Book ${hotel.name} directly with no commissions.`,
      images: hotel.heroImage ? [{ url: hotel.heroImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: hotel.name,
      description: hotel.description || `Book ${hotel.name} directly with no commissions.`,
      images: hotel.heroImage ? [hotel.heroImage] : [],
    },
  };
}

export default async function HotelSlugPage(
  { params, searchParams }: { params: { slug: string }, searchParams: Record<string, string | undefined> }
) {
  const normalizedParams = normalizeSearchParams({ searchParams });
  
  const hotel = await getHotelBySlug(params.slug, normalizedParams);
  
  if (!hotel) return <div>Hotel not found.</div>;

  // Generate JSON-LD structured data
  const hotelSchema: any = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotel.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hotel.address,
      "addressLocality": hotel.city,
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "telephone": hotel.phone,
    "image": hotel.heroImage,
    "description": hotel.description,
    "amenityFeature": hotel.amenities?.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "url": `https://www.innstastay.com/hotels/${hotel.id}`,
  };

  // Add star rating if available
  if (hotel.rating) {
    hotelSchema.starRating = {
      "@type": "Rating",
      "ratingValue": hotel.rating
    };
  }

  // Add offers if pricing is available (supports legacy and Money types)
  const p: any = hotel.price as any
  let offerAmount: number | undefined
  let offerCurrency: string | undefined
  if (p && 'nightlyFrom' in p) {
    offerAmount = p.nightlyFrom
    offerCurrency = p.currency || 'CAD'
  } else if (isMoney(p)) {
    offerAmount = p.amount
    offerCurrency = p.currency
  }
  if (typeof offerAmount === 'number') {
    hotelSchema.offers = {
      "@type": "Offer",
      "price": offerAmount,
      "priceCurrency": offerCurrency || "CAD",
      "availability": "https://schema.org/InStock",
      "url": `https://www.innstastay.com/hotels/${hotel.id}`,
    };
  }

  // Add room-level offers if available
  const roomOffers = hotel.rooms?.map((room: any) => ({
    "@type": "Offer",
    "name": room.name,
    "price": room.nightly,
    "priceCurrency": room.currency || "CAD",
    "availability": "https://schema.org/InStock",
    "url": room.link,
  }));

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.innstastay.com"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": hotel.name,
        "item": `https://www.innstastay.com/hotels/${hotel.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hotelSchema)
        }}
      />
      {roomOffers && roomOffers.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AggregateOffer",
              "offers": roomOffers
            })
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <HotelDetails hotel={hotel} searchParams={searchParams} />
    </>
  );
} 