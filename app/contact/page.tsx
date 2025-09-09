import type { Metadata } from "next";
import { PageRenderer } from '@/app/components/cms/PageRenderer'
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
  if (!isCmsPagesEnabled()) return <ContactPageClient />
  const isDraft = draftMode().isEnabled
  const page = await getPageBySlug('contact', {
    drafts: isDraft,
    fetchOptions: isDraft ? { cache: 'no-store' } : { next: { revalidate: 3600, tags: ['page:contact'] } },
  })
  if (!page || (!page.hero && !(page.sections || []).length)) return <ContactPageClient />
  return <PageRenderer hero={page.hero} sections={page.sections} />
}
