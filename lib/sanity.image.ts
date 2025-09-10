import imageUrlBuilder from '@sanity/image-url'

// Keep it simple: avoid named type imports that may not exist in this package version.
type SanityImageSource = any

const RAW_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const RAW_DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SKIP           = process.env.SKIP_SANITY === '1'

// In CI or with dummy envs, use a harmless dummy config so builds never crash.
const useDummy  = SKIP || !RAW_PROJECT_ID || RAW_PROJECT_ID === 'dummy-project-id' || !RAW_DATASET
const projectId = useDummy ? 'dummy'      : (RAW_PROJECT_ID as string)
const dataset   = useDummy ? 'production' : RAW_DATASET

let _builder: ReturnType<typeof imageUrlBuilder> | null = null
function getBuilder() {
  if (_builder) return _builder
  _builder = imageUrlBuilder({ projectId, dataset })
  return _builder
}

// Usage: urlFor(image).width(800).height(600).url()
export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source)
}

// Optional export if other modules want direct access
export const imageBuilder = getBuilder()