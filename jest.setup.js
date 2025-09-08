import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock window.matchMedia only when window exists (Node env has no window)
if (typeof globalThis.window !== 'undefined' && typeof globalThis.window.matchMedia === 'undefined') {
  globalThis.window.matchMedia = function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  }
}

// ---- CMS/global mocks ----
// Mock preview state. Override per-test if needed.
jest.mock('next/headers', () => ({
  draftMode: () => ({ isEnabled: false }),
}))

// Mock canonical client so tests NEVER import `next-sanity` (ESM).
jest.mock('@/lib/cms/sanityClient', () => {
  const fetch = jest.fn(async (_groq, _params, _opts) => ({}))
  return {
    getClient: () => ({ fetch }),
    __mock: { fetch },
  }
})