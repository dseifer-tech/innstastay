#!/usr/bin/env node

// Import POIs from the existing DowntownPageClient.tsx hardcoded list into Sanity
// Usage: node -r dotenv/config scripts/import-pois-from-code.js dotenv_config_path=.env.local

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

function extractPoisFromFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8')
  const listStart = src.indexOf('[', src.indexOf('Nearby Attractions'))
  const listEnd = src.indexOf('].map', listStart)
  if (listStart === -1 || listEnd === -1) return []
  const arrSrc = src.slice(listStart, listEnd+1)
  // Very loose JSON-ish transform
  const jsonish = arrSrc
    .replace(/proxify\(/g, '(')
    .replace(/\),/g, ',')
    .replace(/(\bname\s*:)\s*"/g, '"name":"')
  try {
    // Not true JSON; fallback to regex parsing per item
    const items = []
    const itemRegex = /\{\s*name:\s*"([^"]+)"[\s\S]*?link:\s*"([^"]+)"[\s\S]*?thumbnail:\s*\("([^"]+)"[\s\S]*?\)\s*,[\s\S]*?rating:\s*([0-9.]+)[\s\S]*?reviews:\s*([0-9,]+)[\s\S]*?description:\s*"([\s\S]*?)"\s*\}/g
    let m
    while ((m = itemRegex.exec(arrSrc))) {
      items.push({
        name: m[1],
        url: m[2],
        imageUrl: m[3],
        rating: Number(m[4]),
        reviews: Number(String(m[5]).replace(/,/g,'')),
        shortDescription: m[6].replace(/\\'/g, "'"),
      })
    }
    return items
  } catch (_) {
    return []
  }
}

async function upsertPoi(p) {
  const _id = `poi.${slugify(p.name)}`
  return client.createOrReplace({
    _id,
    _type: 'poi',
    name: p.name,
    slug: { _type: 'slug', current: slugify(p.name) },
    url: p.url,
    imageUrl: p.imageUrl,
    rating: p.rating,
    reviews: p.reviews,
    shortDescription: p.shortDescription,
  })
}

async function replacePoiGridOnDowntown(poiIds) {
  const page = await client.fetch('*[_type=="page" && slug.current=="hotels/toronto-downtown"][0]{_id, sections}')
  if (!page?._id) return
  const refs = poiIds.map((_id) => ({ _type: 'reference', _ref: _id }))
  const sections = Array.isArray(page.sections) ? [...page.sections] : []
  // Remove existing poiGrid sections, then add one
  const filtered = sections.filter((s) => s?._type !== 'poiGrid')
  filtered.push({ _type: 'poiGrid', title: 'Nearby Attractions', pois: refs })
  await client.patch(page._id).set({ sections: filtered }).commit()
}

async function run() {
  const filePath = path.join(process.cwd(), 'app', 'hotels', 'toronto-downtown', 'DowntownPageClient.tsx')
  const pois = extractPoisFromFile(filePath)
  if (!pois.length) {
    console.error('No POIs found in component; aborting.')
    process.exit(1)
  }
  console.log('Found POIs in code:', pois.length)
  const createdIds = []
  for (const p of pois) {
    const res = await upsertPoi(p)
    createdIds.push(res._id)
  }
  await replacePoiGridOnDowntown(createdIds)
  console.log('Imported', createdIds.length, 'POIs and updated downtown poiGrid')
}

run().catch((e)=>{ console.error('Import failed:', e?.message || e); process.exit(1) })
