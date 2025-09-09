import { draftMode } from 'next/headers'
import { isCmsPagesEnabled } from '@/lib/cms/flags'
import { getPageBySlug } from '@/lib/cms/page'
import { getClient } from '@/lib/cms/sanityClient'

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
  const groqUsed = '*[_type=="page" && slug.current==$slug][0]{ _id, _updatedAt, "slug": slug.current, defined(hero) as heroPresent, count(sections) as sectionCount }'
  const params = { slug }
  const fetchOptions = preview ? { cache: 'no-store' } : { next: { revalidate: 60, tags: [`page:${slug}`] } }
  const client: any = getClient()
  const perspective = (client.config && client.config().perspective) || (preview ? 'previewDrafts' : 'published')
  try {
    const page = await getPageBySlug(slug, { drafts: preview, fetchOptions })
    if (page) {
      pageExists = true
      sectionCount = Array.isArray(page.sections) ? page.sections.length : 0
      heroPresent = !!page.hero
    }
  } catch (e: any) {
    fetchError = e?.message || 'fetch failed'
  }
  // Also run minimal query via getClient for apples-to-apples
  let appMinimal: any = null
  try {
    appMinimal = await client.fetch(groqUsed, params, fetchOptions as any)
  } catch {}

  return Response.json({
    preview,
    perspective,
    groqUsed,
    params,
    fetchOptions,
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
    appMinimal: appMinimal ? { exists: !!appMinimal, heroPresent: !!appMinimal?.heroPresent, sectionCount: appMinimal?.sectionCount ?? 0 } : null,
    fetchError,
  })
}


