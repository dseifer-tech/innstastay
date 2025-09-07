#!/usr/bin/env node

// Seed a few POIs and attach a poiGrid to the Toronto Downtown page
// Usage: node -r dotenv/config scripts/seed-pois.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

async function upsertPoi(id, name, url, shortDescription) {
  return client.createOrReplace({
    _id: id,
    _type: 'poi',
    name,
    slug: { _type: 'slug', current: id.replace(/^poi\./,'') },
    url,
    shortDescription,
  })
}

async function attachPoiGridToDowntown(poiIds) {
  const page = await client.fetch('*[_type=="page" && slug.current=="hotels/toronto-downtown"][0]{_id, sections}')
  if (!page?._id) {
    console.error('Downtown page not found; run seed-downtown-and-fragment.js first.')
    return
  }
  const refs = poiIds.map((_id) => ({ _type: 'reference', _ref: _id }))
  const sections = Array.isArray(page.sections) ? page.sections : []
  sections.push({ _type: 'poiGrid', title: 'Nearby Points of Interest', pois: refs })
  await client.patch(page._id).set({ sections }).commit()
}

async function run() {
  console.log('Seeding POIs...')
  const poiIds = []
  poiIds.push((await upsertPoi('poi.cn-tower', 'CN Tower', 'https://www.cntower.ca/', 'Iconic tower with observation deck.'))._id)
  poiIds.push((await upsertPoi('poi.eaton-centre', 'CF Toronto Eaton Centre', 'https://www.cfshops.com/toronto-eaton-centre.html', 'Downtown mall with 200+ stores.'))._id)
  poiIds.push((await upsertPoi('poi.scotiabank-arena', 'Scotiabank Arena', 'https://www.scotiabankarena.com/', 'Home of the Leafs & Raptors.'))._id)

  await attachPoiGridToDowntown(poiIds)
  console.log('POIs seeded and poiGrid attached.')
}

run().catch((e)=>{ console.error('Seed failed:', e?.message || e); process.exit(1) })
