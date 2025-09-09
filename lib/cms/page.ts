import { getClient } from '@/lib/cms/sanityClient'

export type CmsSection =
  | ({ _type: 'hero' } & any)
  | ({ _type: 'richText' } & any)
  | ({ _type: 'hotelCarousel' } & any)
  | ({ _type: 'poiGrid' } & any)
  | ({ _type: 'secondaryCta' } & any)
  | ({ _type: 'faq' } & any)

export async function getPageBySlug(slug: string, opts?: { drafts?: boolean; fetchOptions?: any }) {
  const query = `*[_type=="page" && slug.current==$slug][0]{ _id, title, "slug": slug.current, hero, seo, sections, _updatedAt }`
  // First try published content (via CDN if not explicitly requesting drafts)
  const client = getClient()
  const published = await client.fetch(query, { slug }, opts?.fetchOptions)
  if (published || !opts?.drafts) return published

  // Optional: fallback to drafts when requested and token is available
  const token = process.env.SANITY_API_TOKEN
  if (token && opts?.drafts) {
    try {
      return await client.fetch(query, { slug }, opts?.fetchOptions)
    } catch (_) {
      // swallow and return published (null) below
    }
  }
  return published
}

export async function getAllPageSlugs() {
  const query = `*[_type == "page" && defined(slug.current) && !excludeFromSitemap]{"slug": slug.current, _updatedAt}`
  return getClient().fetch(query)
}


