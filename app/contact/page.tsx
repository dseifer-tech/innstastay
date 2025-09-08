import type { Metadata } from "next";
import SectionRenderer from '@/app/components/SectionRenderer'
import { draftMode } from 'next/headers'
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import { buildPageMetadata } from '@/lib/seo'
import ContactPageClient from './ContactPageClient'

export async function generateMetadata(): Promise<Metadata> {
  if (!isCmsPagesEnabled()) {
    return {
      title: "Contact Us | InnstaStay",
      description:
        "Get in touch with InnstaStay. Questions about bookings, partnerships, or support? Email us at info@innstastay.com.",
      alternates: { canonical: "https://www.innstastay.com/contact" },
      openGraph: {
        title: "Contact InnstaStay",
        description:
          "Questions about bookings, partnerships, or support? Email info@innstastay.com.",
        url: "https://www.innstastay.com/contact",
        images: [{ url: "https://www.innstastay.com/innstastay-logo.svg" }],
      },
      twitter: { card: "summary" },
    }
  }
  const page = await getPageBySlug('contact')
  return buildPageMetadata({
    title: page?.seo?.title || page?.title,
    description: page?.seo?.description,
    alternates: { canonical: page?.seo?.canonical || 'https://www.innstastay.com/contact' },
    openGraph: { images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined }
  })
}

export default async function ContactPage() {
  if (!isCmsPagesEnabled()) {
    return <ContactPageClient />
  }
  const isDraft = draftMode().isEnabled
  const page = await getPageBySlug('contact', { drafts: isDraft })
  const sections = page ? [page.hero, ...(page.sections || [])].filter(Boolean) : []
  if (!sections.length) {
    return <ContactPageClient />
  }
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionRenderer sections={sections} />
    </main>
  )
}
