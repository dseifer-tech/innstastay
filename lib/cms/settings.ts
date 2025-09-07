import { client } from '@/sanity/lib/client'

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
  return client.fetch<SiteSettings | null>(query)
}


