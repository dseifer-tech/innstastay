import { flushRedirectsCache } from '@/lib/cms/redirects'

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 })
  }
  flushRedirectsCache()
  return Response.json({ ok: true })
}


