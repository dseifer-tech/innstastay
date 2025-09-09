#!/usr/bin/env node

// Seed Toronto Downtown page and a reusable Trust fragment, and attach it to homepage
// Usage: node -r dotenv/config scripts/seed-downtown-and-fragment.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')
const crypto = require('crypto')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })
const pt = (text) => {
  const key = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  const childKey = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  return [{ _key: key, _type: 'block', style: 'normal', children: [{ _key: childKey, _type: 'span', text }] }]
}

async function upsertFragment() {
  const fragId = 'fragment.trust'
  const frag = {
    _id: fragId,
    _type: 'fragment',
    title: 'Trust + Why Book Direct',
    sections: [
      { _key: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2), _type: 'richText', body: pt('Why Book Direct? — Transparent pricing, flexible cancellation, loyalty benefits, and 0% commission.') },
    ],
  }
  await client.createOrReplace(frag)
  return fragId
}

async function upsertDowntownPage() {
  const _id = 'page.hotels-toronto-downtown'
  const doc = {
    _id,
    _type: 'page',
    title: 'Downtown Toronto Hotels',
    slug: { _type: 'slug', current: 'hotels/toronto-downtown' },
    sections: [
      { _key: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2), _type: 'hero', headline: 'Downtown Toronto Hotels', subhead: 'Handpicked stays in the core—book direct with the hotel.' },
      { _key: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2), _type: 'richText', body: pt('Browse popular downtown hotels and points of interest. Prices shown are direct from hotels.') },
      { _key: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2), _type: 'hotelCarousel', title: 'Downtown picks', hotels: [] },
    ],
  }
  await client.createOrReplace(doc)
  return _id
}

async function attachFragmentToHome(fragId) {
  const home = await client.fetch('*[_type=="page" && slug.current=="home"][0]{_id, sections}')
  if (!home?._id) return
  const sections = Array.isArray(home.sections) ? home.sections : []
  const hasRef = sections.some((s) => s?._type === 'fragmentRef' && (s?.ref?._ref === fragId || s?.refId === fragId))
  if (!hasRef) {
    sections.push({ _type: 'fragmentRef', ref: { _type: 'reference', _ref: fragId } })
    await client.patch(home._id).set({ sections }).commit()
  }
}

async function run() {
  console.log('Seeding fragment and Downtown page...')
  const fragId = await upsertFragment()
  const pageId = await upsertDowntownPage()
  await attachFragmentToHome(fragId)
  console.log('Done:', { fragment: fragId, page: pageId })
}

run().catch((e)=>{ console.error('Seed failed:', e?.message || e); process.exit(1) })
