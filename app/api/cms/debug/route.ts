import { draftMode } from 'next/headers'
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') || 'about'
  const preview = draftMode().isEnabled

  const useCmsPagesEnv = process.env.USE_CMS_PAGES || null
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || null
  const hasToken = !!process.env.SANITY_API_TOKEN

  let pageExists = false
  let sectionCount = 0
  let heroPresent = false
  let fetchError: string | undefined
  try {
    const page = await getPageBySlug(slug, {
      drafts: preview,
      fetchOptions: preview ? { cache: 'no-store' } : { next: { revalidate: 60, tags: [`page:${slug}`] } },
    })
    if (page) {
      pageExists = true
      sectionCount = Array.isArray(page.sections) ? page.sections.length : 0
      heroPresent = !!page.hero
    }
  } catch (e: any) {
    fetchError = e?.message || 'fetch failed'
  }

  return Response.json({
    preview,
    env: {
      USE_CMS_PAGES: useCmsPagesEnv,
      projectId,
      dataset,
      hasToken,
    },
    isCmsPagesEnabled: isCmsPagesEnabled(),
    slug,
    page: {
      exists: pageExists,
      heroPresent,
      sectionCount,
    },
    fetchError,
  })
}


