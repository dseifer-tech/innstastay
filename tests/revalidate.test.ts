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

  it('revalidates tags when provided', async () => {
    const res = await POST(req({ tags: ['navigation', 'page:about'] }))
    expect(revalidateTag).toHaveBeenCalledWith('navigation')
    expect(revalidateTag).toHaveBeenCalledWith('page:about')
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('revalidates paths when provided', async () => {
    const res = await POST(req({ paths: ['/about', '/contact'] }))
    expect(revalidatePath).toHaveBeenCalledWith('/about')
    expect(revalidatePath).toHaveBeenCalledWith('/contact')
    expect(revalidateTag).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })
})


