import type { Metadata } from "next";
import DowntownPageClient from "./DowntownPageClient";
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import SectionRenderer from '@/app/components/SectionRenderer'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  if (!isCmsPagesEnabled()) {
    return {
      title: "Downtown Toronto Hotels — Direct Booking",
      description:
        "Browse downtown Toronto hotels near CN Tower, ROM, and St. Lawrence Market. See real direct rates and book securely with InnstaStay.",
      alternates: { canonical: "https://www.innstastay.com/hotels/toronto-downtown" },
      openGraph: {
        title: "Downtown Toronto Hotels — Direct Booking",
        description: "Find verified direct hotel rates near major attractions—commission-free.",
        url: "https://www.innstastay.com/hotels/toronto-downtown",
        images: [{ url: "https://www.innstastay.com/innstastay-logo.svg" }],
      },
      twitter: { card: "summary_large_image" },
    }
  }
  const page = await getPageBySlug('hotels/toronto-downtown')
  return buildPageMetadata({
    title: page?.seo?.title || page?.title,
    description: page?.seo?.description,
    alternates: { canonical: page?.seo?.canonical || 'https://www.innstastay.com/hotels/toronto-downtown' }
  })
}

export default async function DowntownPage() {
  if (isCmsPagesEnabled()) {
    const page = await getPageBySlug('hotels/toronto-downtown')
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <SectionRenderer sections={page?.sections} />
      </main>
    )
  }
  return <DowntownPageClient />
}
