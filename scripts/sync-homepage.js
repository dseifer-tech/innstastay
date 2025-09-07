#!/usr/bin/env node

// Sync page.home content in Sanity to match the current site copy
// Usage: node -r dotenv/config scripts/sync-homepage.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN (needs write access)')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

const pt = (text) => ([{ _type: 'block', style: 'normal', children: [{ _type: 'span', text }] }])

async function run() {
  console.log('Syncing page.home to match site copy...')

  // Find the existing page by slug in case the _id is auto-generated
  const existing = await client.fetch(
    `*[_type=="page" && slug.current=="home"][0]{_id, title, slug, hero, sections}`
  )

  const targetId = existing?._id || 'page.home'

  // Ensure sections exist and first is hero
  const nextSections = [
    { _type: 'hero', headline: 'Downtown Toronto Hotels — Book Direct', subhead: 'Live rates from verified downtown hotels. No middlemen, no extra fees.' },
    { _type: 'searchWidget', title: 'Ready to Find Your Perfect Stay?', subhead: 'Compare live rates from Toronto\'s top hotels in seconds.' },
    { _type: 'richText', body: pt('Skip the middlemen and get the best rates directly from downtown Toronto hotels.') },
  ]

  if (!existing) {
    const created = await client.create({
      _type: 'page',
      _id: targetId,
      title: 'Home',
      slug: { _type: 'slug', current: 'home' },
      hero: nextSections[0],
      sections: nextSections,
    })
    console.log('Created:', created._id)
    return
  }

  // Patch the existing document by its real _id
  const res = await client
    .patch(targetId)
    .set({
      hero: nextSections[0],
      sections: nextSections,
    })
    .commit()

  console.log('Patched:', res._id)
}

run().catch((err) => {
  console.error('Sync failed:', err?.message || err)
  process.exit(1)
})
