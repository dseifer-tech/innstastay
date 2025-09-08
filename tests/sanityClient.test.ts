let mockPreview = false

jest.mock('next/headers', () => ({
  draftMode: () => ({ isEnabled: mockPreview }),
}))

describe('sanity client getClient()', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'x'
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'
  })

  it('returns a client in published mode when preview is off', () => {
    mockPreview = false
    const { getClient } = require('@/lib/cms/sanityClient')
    const c = getClient()
    expect(typeof c.fetch).toBe('function')
  })

  it('returns a client in preview mode when preview is on', () => {
    mockPreview = true
    jest.resetModules()
    const { getClient } = require('@/lib/cms/sanityClient')
    const c = getClient()
    expect(typeof c.fetch).toBe('function')
  })
})


