import { draftMode } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || 'home'
  // Disable draft mode for this browser session
  draftMode().disable()
  return Response.redirect(new URL(`/${slug}`, req.url))
}


