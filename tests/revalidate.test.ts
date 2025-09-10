import { NextRequest } from 'next/server'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

import { revalidatePath, revalidateTag } from 'next/cache'

const SECRET = 'testsecret'
process.env.REVALIDATE_SECRET = SECRET

// Import the handler after env+mock are set, and isolate module cache
let POST: (req: NextRequest) => Promise<Response>
beforeAll(() => {
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/app/api/revalidate/route')
    POST = mod.POST
  })
})

function req(body: any, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-revalidate-secret': SECRET, 'content-type': 'application/json', ...headers },
  } as any)
}

describe('/api/revalidate', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('revalidates hotel paths when provided', async () => {
    const res = await POST(req({ paths: ['/hotels/fairmont-royal-york', '/hotels/shangri-la-toronto'] }))
    expect(revalidatePath).toHaveBeenCalledWith('/hotels/fairmont-royal-york')
    expect(revalidatePath).toHaveBeenCalledWith('/hotels/shangri-la-toronto')
    expect(revalidateTag).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('ignores non-hotel paths', async () => {
    const res = await POST(req({ paths: ['/about', '/contact', '/hotels/fairmont-royal-york'] }))
    expect(revalidatePath).toHaveBeenCalledWith('/hotels/fairmont-royal-york')
    expect(revalidatePath).not.toHaveBeenCalledWith('/about')
    expect(revalidatePath).not.toHaveBeenCalledWith('/contact')
    expect(revalidateTag).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('handles empty paths array', async () => {
    const res = await POST(req({ paths: [] }))
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('requires valid secret', async () => {
    const res = await POST(req({ paths: ['/hotels/test'] }, { 'x-revalidate-secret': 'invalid' }))
    expect(res.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})


