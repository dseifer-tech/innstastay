import { client } from '@/sanity/lib/client'

export type Redirect = { fromPath: string; toPath: string; status: 301 | 302 }

let cache: { ts: number; data: Redirect[] } | null = null
const TTL_MS = 5 * 60 * 1000

export async function getRedirectsCached(): Promise<Redirect[]> {
  const now = Date.now()
  if (cache && now - cache.ts < TTL_MS) return cache.data
  const query = `*[_type == "redirect"]{ fromPath, toPath, status }`
  const raw = await client.fetch<Redirect[]>(query).catch(() => [])
  const data = raw.map(sanitizeRedirect).filter(Boolean) as Redirect[]
  cache = { ts: now, data }
  return data
}

export function sanitizeRedirect(rec: { fromPath?: string; toPath?: string; status?: number }) {
  const from = rec.fromPath?.startsWith('/') ? rec.fromPath : `/${rec.fromPath || ''}`
  const to = rec.toPath?.startsWith('/') ? rec.toPath : ''
  if (!to) return null
  const status = rec.status === 302 ? 302 : 301
  return { fromPath: from, toPath: to, status }
}

export function flushRedirectsCache() {
  cache = null
}


