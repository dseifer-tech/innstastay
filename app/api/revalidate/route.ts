import { revalidatePath } from 'next/cache'

// Hotel-only revalidate endpoint: accepts { paths: ['/hotels/...', '/api/hotels...'] }
export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-revalidate-secret')
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return Response.json({ ok: false }, { status: 401 })
    }
    const body = await req.json().catch(() => ({}))
    const paths: string[] = Array.isArray(body?.paths) ? body.paths : []
    const hotelPaths = paths.filter((p) => typeof p === 'string' && p.startsWith('/hotels'))
    for (const p of hotelPaths) revalidatePath(p)
    return Response.json({ revalidated: { paths: hotelPaths } })
  } catch {
    return Response.json({ revalidated: false }, { status: 400 })
  }
}


