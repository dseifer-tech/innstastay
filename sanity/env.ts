export const apiVersion = '2023-05-03'

export const dataset = 'production'

export const projectId = '6rewx4dr'

export const serpapiKey = process.env.SANITY_STUDIO_SERPAPI_KEY

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
