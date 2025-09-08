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

    if (tags.length > 0) {
      for (const t of tags) revalidateTag(t)
    }
    if (paths.length > 0) {
      for (const p of paths) revalidatePath(p)
    }
    return Response.json({ revalidated: { paths, tags } })
  } catch {
    return Response.json({ revalidated: false }, { status: 400 })
  }
}


