import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "InnstaStay — Direct Toronto Hotels",
    description:
      "Compare verified direct rates at top Toronto hotels. No commissions or markups—book direct and save with InnstaStay.",
    alternates: { canonical: "https://www.innstastay.com/" },
    openGraph: {
      title: "InnstaStay — Direct Toronto Hotels",
      description:
        "Compare real-time direct hotel rates in downtown Toronto. No middlemen, no fees—book direct and save.",
      url: "https://www.innstastay.com/",
      images: [{ url: "https://www.innstastay.com/innstastay-logo.svg" }],
    },
    twitter: { card: "summary_large_image" },
  }
}

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InnstaStay",
    "url": "https://www.innstastay.com",
    "description": "Compare verified direct rates at top Toronto hotels. No commissions or markups—book direct and save with InnstaStay.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.innstastay.com/search?checkin={checkin}&checkout={checkout}&adults={adults}&children={children}"
      },
      "query-input": "required name=checkin name=checkout name=adults name=children"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <HomePageClient />
    </>
  );
}
