import { draftMode } from 'next/headers'
import { client as baseClient } from '@/sanity/lib/client'

async function time<T>(fn: () => Promise<T>): Promise<{ ms: number; value?: T; error?: string }> {
  const start = Date.now()
  try {
    const value = await fn()
    return { ms: Date.now() - start, value }
  } catch (e: any) {
    return { ms: Date.now() - start, error: e?.message || 'error' }
  }
}

export async function GET() {
  const preview = draftMode().isEnabled
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

  // Minimal GROQ that should always exist if Studio is set up
  const query = '*[_type == "siteSettings"][0]{ _id }'

  const publishedProbe = await time(() => baseClient.withConfig({ useCdn: true }).fetch(query))

  let canPreviewDrafts = false
  let previewProbe = { ms: 0 }
  const token = process.env.SANITY_API_TOKEN
  if (token) {
    const res = await time(() => baseClient.withConfig({ useCdn: false, token, perspective: 'previewDrafts' as any }).fetch(query))
    previewProbe = { ms: res.ms }
    canPreviewDrafts = !res.error
  }

  return Response.json({
    ok: !!projectId && !!dataset && !!publishedProbe && !publishedProbe.error,
    projectId,
    dataset,
    preview,
    publishedSampleMs: publishedProbe.ms,
    previewSampleMs: (previewProbe as any).ms || 0,
    canPreviewDrafts,
  })
}


