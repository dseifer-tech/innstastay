import createImageUrlBuilder, {
  type ImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'

const RAW_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const RAW_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SKIP = process.env.SKIP_SANITY === '1'

// If CI or envs are fake, build with a dummy config so TypeScript is happy and callers don't crash.
// This returns a builder whose URLs won't resolve in CI (that's fine), but the build won't fail.
const useDummy =
  SKIP ||
  !RAW_PROJECT_ID ||
  RAW_PROJECT_ID === 'dummy-project-id' ||
  !RAW_DATASET

const projectId = useDummy ? 'dummy' : (RAW_PROJECT_ID as string)
const dataset = useDummy ? 'production' : RAW_DATASET

let _builder: ImageUrlBuilder | null = null
function getBuilder(): ImageUrlBuilder {
  if (_builder) return _builder
  _builder = createImageUrlBuilder({ projectId, dataset })
  return _builder
}

// Chainable helper matching common usage: urlFor(image).width(800).height(600).url()
export function urlFor(source: SanityImageSource) {
  // Even in dummy mode, return a valid builder object so call sites don't explode
  return getBuilder().image(source)
}

// Optional convenience: direct access to the builder if needed elsewhere
export const imageBuilder = getBuilder()