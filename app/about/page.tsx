import type { Metadata } from "next";
import SectionRenderer from '@/app/components/SectionRenderer'
import { draftMode } from 'next/headers'
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  if (!isCmsPagesEnabled()) {
    return {
      title: "About InnstaStay — Commission-Free Booking",
      description:
        "InnstaStay connects you to hotels' real prices—no middlemen, no fees. Learn how direct booking works and why it saves you money in Toronto.",
      alternates: { canonical: "https://www.innstastay.com/about" },
      openGraph: {
        title: "About InnstaStay — Commission-Free Booking",
        description:
          "How InnstaStay eliminates middlemen to provide direct hotel booking in Toronto.",
        url: "https://www.innstastay.com/about",
        images: [{ url: "https://www.innstastay.com/innstastay-logo.svg" }],
      },
      twitter: { card: "summary_large_image" },
    }
  }
  const page = await getPageBySlug('about')
  return buildPageMetadata({
    title: page?.seo?.title || page?.title,
    description: page?.seo?.description,
    alternates: { canonical: page?.seo?.canonical || 'https://www.innstastay.com/about' },
    openGraph: { images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined }
  })
}

export default async function AboutPage() {
  if (!isCmsPagesEnabled()) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">CMS pages are disabled.</div>
  }
  const isDraft = draftMode().isEnabled
  const page = await getPageBySlug('about', { drafts: isDraft })
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionRenderer sections={page ? [page.hero, ...(page.sections || [])].filter(Boolean) : []} />
    </main>
  )
}
