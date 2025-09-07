import type { Metadata } from 'next';
import SectionRenderer from '@/app/components/SectionRenderer'
import { draftMode } from 'next/headers'
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  if (!isCmsPagesEnabled()) {
    return {
      title: 'Privacy Policy - InnstaStay',
      description: 'Learn how InnstaStay protects your privacy and handles your personal information.',
      robots: 'index, follow'
    }
  }
  const page = await getPageBySlug('privacy')
  return buildPageMetadata({
    title: page?.seo?.title || page?.title,
    description: page?.seo?.description,
  })
}

export default async function PrivacyPage() {
  if (!isCmsPagesEnabled()) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">CMS pages are disabled.</div>
  }
  const isDraft = draftMode().isEnabled
  const page = await getPageBySlug('privacy', { drafts: isDraft })
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionRenderer sections={page ? [page.hero, ...(page.sections || [])].filter(Boolean) : []} />
    </main>
  )
}
