#!/usr/bin/env node

// Purge non-hotel marketing docs from Sanity (production dataset)
// Usage: node -r dotenv/config scripts/purge-non-hotel.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-10-01', useCdn: false })

// Adjust list as needed; goal: remove page/marketing/fragment/navigation/site settings
const TYPES_TO_DELETE = [
  'page', 'hero', 'richText', 'featureGrid', 'imageBanner', 'cta', 'faq', 'faqList', 'fragment', 'fragmentRef', 'navigation', 'siteSettings', 'secondaryCta', 'searchWidget', 'poi', 'poiGrid', 'hotelCarousel'
]
const SLUGS_TO_DELETE = ['home','about','contact','hotels/toronto-downtown']

async function run() {
  console.log('Purging non-hotel docs from Sanity →', { projectId: PROJECT_ID, dataset: DATASET })

  // Delete docs by type
  const delByType = await client.delete({ query: `*[_type in ${JSON.stringify(TYPES_TO_DELETE)}]` })
  console.log('Deleted by type:', delByType)

  // Extra safety: delete any page-like docs with those slugs
  const delBySlug = await client.delete({ query: `*[_type match "*page*" && slug.current in ${JSON.stringify(SLUGS_TO_DELETE)}]` })
  console.log('Deleted by slug:', delBySlug)

  console.log('✅ Purge complete (non-hotel docs).')
}

run().catch((e) => { console.error(e); process.exit(1) })


