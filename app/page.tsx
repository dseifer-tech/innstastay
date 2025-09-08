import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import SectionRenderer from '@/app/components/SectionRenderer'
import { buildPageMetadata } from '@/lib/seo'
import { draftMode } from 'next/headers'

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  if (!isCmsPagesEnabled()) {
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
  const page = await getPageBySlug('home')
  return buildPageMetadata({
    title: page?.seo?.title || page?.title,
    description: page?.seo?.description,
    alternates: { canonical: page?.seo?.canonical || 'https://www.innstastay.com/' },
    openGraph: { images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined }
  })
}

export default async function HomePage() {
  if (isCmsPagesEnabled()) {
    const isDraft = draftMode().isEnabled
    const page = await getPageBySlug('home', {
      drafts: isDraft,
      fetchOptions: isDraft ? { cache: 'no-store' } : { next: { revalidate: 3600, tags: ['page:home'] } },
    })
    const sections = page ? [page.hero, ...(page.sections || [])].filter(Boolean) : []
    const extraSections = sections.filter((s: any) => s?._type !== 'hero')
    return (
      <>
        <HomePageClient />
        {extraSections?.length > 0 && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <SectionRenderer sections={extraSections} />
          </main>
        )}
      </>
    )
  }
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
