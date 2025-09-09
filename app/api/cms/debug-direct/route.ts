import { draftMode } from 'next/headers'

export async function GET(req: Request) {
  const { createClient } = await import('@sanity/client')
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') || 'about'
  const preview = draftMode().isEnabled

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN

  const client = createClient({ projectId, dataset, token, apiVersion: '2023-10-01', useCdn: false, perspective: 'published' as any })
  const query = `*[_type=="page" && slug.current==$slug][0]{ _id, _updatedAt, "slug": slug.current, defined(hero) as heroPresent, count(sections) as sectionCount }`
  let doc: any = null
  let error: string | undefined
  try {
    doc = await client.fetch(query, { slug })
  } catch (e: any) {
    error = e?.message || 'fetch failed'
  }

  return Response.json({
    preview,
    slug,
    page: {
      exists: !!doc,
      id: doc?._id || null,
      heroPresent: !!doc?.heroPresent,
      sectionCount: typeof doc?.sectionCount === 'number' ? doc.sectionCount : 0,
    },
    error,
  })
}


