jest.mock('@/lib/cms/sanityClient', () => ({
  client: { fetch: jest.fn() },
}))
import { client } from '@/lib/cms/sanityClient'
import { expandFragmentRefs } from '@/lib/cms/resolveFragments'

const mockFetch = client.fetch as jest.Mock

describe('expandFragmentRefs', () => {
  beforeEach(() => mockFetch.mockReset())

  it('expands a simple fragmentRef into its sections', async () => {
    mockFetch.mockImplementation((_q: any, { id }: any) => {
      if (id === 'frag1') return Promise.resolve({ sections: [{ _type: 'richText', body: [] }] })
      return Promise.resolve(null)
    })
    const out = await expandFragmentRefs([{ _type: 'fragmentRef', refId: 'frag1' } as any])
    expect(out).toEqual([{ _type: 'richText', body: [] }])
  })

  it('guards against loops', async () => {
    mockFetch.mockImplementation((_q: any, { id }: any) => {
      if (id === 'loop') return Promise.resolve({ sections: [{ _type: 'fragmentRef', refId: 'loop' }] })
      return Promise.resolve(null)
    })
    const out = await expandFragmentRefs([{ _type: 'fragmentRef', refId: 'loop' } as any])
    expect(out).toEqual([])
  })
})


