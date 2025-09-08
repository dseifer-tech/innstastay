import { getClient } from '@/lib/cms/sanityClient'

export type SiteSettings = {
  gtmId?: string
  gaId?: string
  defaultSeo?: {
    title?: string
    description?: string
    canonical?: string
    ogImage?: any
  }
}

export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{ gtmId, gaId, defaultSeo }`
  return getClient().fetch<SiteSettings | null>(query)
}


