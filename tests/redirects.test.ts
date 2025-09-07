jest.mock('@/sanity/lib/client', () => ({ client: { fetch: jest.fn() } }))
import { sanitizeRedirect } from '@/lib/cms/redirects'

describe('sanitizeRedirect', () => {
  it('allows relative toPath and normalizes fromPath', () => {
    const out = sanitizeRedirect({ fromPath: 'old', toPath: '/new' }) as any
    expect(out).toMatchObject({ fromPath: '/old', toPath: '/new', status: 301 })
  })

  it('blocks external by default', () => {
    expect(sanitizeRedirect({ fromPath: '/a', toPath: 'https://x.com/p' })).toBeNull()
  })

  it('respects 302', () => {
    const out = sanitizeRedirect({ fromPath: '/a', toPath: '/b', status: 302 }) as any
    expect(out.status).toBe(302)
  })
})


