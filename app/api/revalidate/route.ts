import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-revalidate-secret')
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return Response.json({ ok: false }, { status: 401 })
    }
    const body = await req.json().catch(() => ({}))
    const paths: string[] = Array.isArray(body?.paths) ? body.paths : []
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : []

    // Derive page paths from tags like "page:about" so even if tag cache misses,
    // we also revalidate the concrete route path.
    const derivedPathsFromTags = Array.from(
      new Set(
        (tags || [])
          .filter((t) => typeof t === 'string' && t.startsWith('page:'))
          .map((t) => {
            const slug = t.slice('page:'.length)
            if (!slug) return '/'
            return slug === 'home' ? '/' : `/${slug}`
          })
      )
    )

    if (tags.length > 0) {
      for (const t of tags) revalidateTag(t)
    }
    const allPaths = [...new Set([...(paths || []), ...derivedPathsFromTags])]
    if (allPaths.length > 0) {
      for (const p of allPaths) revalidatePath(p)
    }
    return Response.json({ revalidated: { paths: allPaths, tags } })
  } catch {
    return Response.json({ revalidated: false }, { status: 400 })
  }
}


