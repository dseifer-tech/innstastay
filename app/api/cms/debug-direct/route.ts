import { draftMode } from 'next/headers'

export async function GET(req: Request) {
  const { createClient } = await import('@sanity/client')
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') || 'about'
  const preview = draftMode().isEnabled

  // Normalize project ID to handle dummy values in CI/build environments
  const normalizeProjectId = (projectId: string | undefined): string => {
    if (!projectId) return 'dummy-project-id';
    if (projectId.startsWith('dummy')) {
      return projectId.replace(/_/g, '-');
    }
    return projectId;
  };
  
  const projectId = normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2023-10-01',
    useCdn: false,
    perspective: 'published' as any,
  })

  const query = `*[_type=="page" && slug.current==$slug][0]{
    _id,
    _updatedAt,
    "slug": slug.current,
    "heroPresent": defined(hero),
    "heroHeadline": hero.headline,
    "heroHasImage": defined(hero.image),
    "sectionCount": count(sections),
    "sectionTypes": sections[]->_type
  }`

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


