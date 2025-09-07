import { draftMode } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || 'home'
  if (secret !== process.env.SANITY_PREVIEW_SECRET) return new Response('Invalid', { status: 401 })
  draftMode().enable()
  return Response.redirect(new URL(`/${slug}`, req.url))
}


