import { getClient } from '@/lib/cms/sanityClient'

export type CmsSection =
  | ({ _type: 'hero' } & any)
  | ({ _type: 'richText' } & any)
  | ({ _type: 'hotelCarousel' } & any)
  | ({ _type: 'poiGrid' } & any)
  | ({ _type: 'secondaryCta' } & any)
  | ({ _type: 'faq' } & any)

export async function getPageBySlug(slug: string, opts?: { drafts?: boolean; fetchOptions?: any }) {
  const query = `*[_type=="page" && slug.current==$slug][0]{
    title,
    "slug": slug.current,
    // Ensure hero image includes a url for rendering
    hero{
      ...,
      image{..., "asset": {"url": asset->url}}
    },
    seo,
    sections[]{
      ...,
      // Normalize image url for hero sections
      _type=="hero" => {
        ...,
        image{..., "asset": {"url": asset->url}}
      },
      // Expand referenced fragments and normalize their inner sections
      _type=="fragmentRef" => {
        "sections": ref->sections[]{
          ...,
          _type=="hero" => {
            ...,
            image{..., "asset": {"url": asset->url}}
          },
          _type=="hotelCarousel" => {
            hotels[]-> {
              _id,
              name,
              "slug": slug.current,
              images[]{..., "asset": {"url": asset->url}}
            }
          },
          _type=="poiGrid" => {
            pois[]->{
              _id,
              name,
              image{..., "asset": {"url": asset->url}},
              url,
              shortDescription
            }
          }
        }
      },
      // Normalize images for direct sections as well
      _type=="hotelCarousel" => {
        hotels[]-> {
          _id,
          name,
          "slug": slug.current,
          images[]{..., "asset": {"url": asset->url}}
        }
      },
      _type=="poiGrid" => {
        pois[]->{
          _id,
          name,
          image{..., "asset": {"url": asset->url}},
          url,
          shortDescription
        }
      }
    },
    _updatedAt
  }`
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


