import { NextRequest } from 'next/server'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

import { revalidatePath, revalidateTag } from 'next/cache'
import * as handler from '@/app/api/revalidate/route'

const SECRET = 'testsecret'

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
    const res = await (handler as any).POST(req({ tags: ['navigation', 'page:about'] }, { 'x-revalidate-secret': SECRET }) as any)
    expect(revalidateTag).toHaveBeenCalledWith('navigation')
    expect(revalidateTag).toHaveBeenCalledWith('page:about')
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('revalidates paths when provided', async () => {
    const res = await (handler as any).POST(req({ paths: ['/about', '/contact'] }, { 'x-revalidate-secret': SECRET }) as any)
    expect(revalidatePath).toHaveBeenCalledWith('/about')
    expect(revalidatePath).toHaveBeenCalledWith('/contact')
    expect(revalidateTag).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
  })
})


