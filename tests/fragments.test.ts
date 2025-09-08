const fetchMock = jest.fn().mockResolvedValue({ sections: [] })
jest.mock('@/lib/cms/sanityClient', () => ({
  getClient: () => ({ fetch: fetchMock }),
  __mock: { fetch: fetchMock },
}))

describe('expandFragmentRefs', () => {
  let expandFragmentRefs: any
  beforeEach(() => {
    jest.resetModules()
    fetchMock.mockReset().mockResolvedValue({ sections: [] })
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ({ expandFragmentRefs } = require('@/lib/cms/resolveFragments'))
    })
  })

  it('expands a simple fragmentRef into its sections', async () => {
    fetchMock.mockImplementation((_q: any, { id }: any) => {
      if (id === 'frag1') return Promise.resolve({ sections: [{ _type: 'richText', body: [] }] })
      return Promise.resolve(null)
    })
    const out = await expandFragmentRefs([{ _type: 'fragmentRef', refId: 'frag1' } as any])
    expect(out).toEqual([{ _type: 'richText', body: [] }])
  })

  it('guards against loops', async () => {
    fetchMock.mockImplementation((_q: any, { id }: any) => {
      if (id === 'loop') return Promise.resolve({ sections: [{ _type: 'fragmentRef', refId: 'loop' }] })
      return Promise.resolve(null)
    })
    const out = await expandFragmentRefs([{ _type: 'fragmentRef', refId: 'loop' } as any])
    expect(out).toEqual([])
  })
})


